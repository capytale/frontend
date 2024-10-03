// Ce module contient la logique qui permet de générer l'export des activités sous forme de fichier zip.

import "@capytale/activity.js/activity/activityBunch/all";
import "@capytale/activity.js/activity/activityBunch/uni";


import archiverApi from "@capytale/activity.js/activity/archiver/all";

import loadBunch from "@capytale/activity.js/backend/capytale/activityBunch";
import evalApi from "@capytale/activity.js/backend/capytale/evaluation";
import type ActivityBunch from "@capytale/activity.js/activity/activityBunch/base";
import type { ArchiveFileData } from "@capytale/activity.js/activity/archiver/base";

import iterator from "@capytale/activity.js/util/iterator";

import * as zip from "@zip.js/zip.js";

import { loadActivityIndex, type ActivityIndex } from "~/utils/activityTypes";
import { type JobControl, type ReportHandler, type Report } from "./jobControl";

function checkFolder(usedFolder: string[], n: string, ext?: string): string {
    let to = ext ? n + '.' + ext : n;
    if (usedFolder.includes(to)) {
        const name = n + '(';
        ext = ext ? ').' + ext : ')';
        let i = 0;
        do { to = name + ++i + ext } while (usedFolder.includes(to));
    }
    usedFolder.push(to);
    return to;
}

function getReader(data: ArchiveFileData): zip.Reader<any> {
    switch (data.type) {
        case 'url': return new zip.HttpReader(data.data);
        case 'text': return new zip.TextReader(data.data);
        case 'uint8array': return new zip.Uint8ArrayReader(data.data);
    }
    return new zip.TextReader('Erreur');
}

type ReportFile = {
    push(...items: string[]): void;
    toString(): string;
}

function createReportFile(): ReportFile {
    const lines: string[] = [];
    return {
        push(...items: string[]) {
            lines.push(...items);
        },
        toString() {
            return lines.join('\r\n');
        }
    };
}

type ItemReport = {
    readonly title?: Report['title'];
    readonly type?: Report['type'];
    readonly status?: Report['status'];
    add(r: Report): void;
    toString(index: ActivityIndex | null): string;
}

function createItemReport(): ItemReport {
    let title: Report['title'];
    let type: Report['type'];
    let status: Report['status'] = 'pending';
    return {
        get title() { return title },
        get type() { return type },
        get status() { return status },
        add(r) {
            if (r.title != null) title = r.title;
            if (r.type != null) type = r.type;
            if (r.status != null) status = r.status;
        },
        toString(index) {
            let _title = title ?? '…';
            let _type: string = '';
            if (type != null) {
                if ((index != null) && (index[type] != null)) _type = index[type].name;
                else _type = type;
                _type = ` (${_type})`;
            }
            let _status = '';
            if (status === 'error') _status = ' (erreur)';
            else if (status === 'unsupported') _status = ' (non supporté)';
            else if (status === 'forbidden') _status = ' (accès interdit)';
            return `${_title}${_type}${_status}`;
        }
    };
}

export type ActivityInfo = { nid: number, type?: string, title?: string }


/**
 * Crée un fichier zip contenant les activités sélectionnées.
 * 
 * @param ids les nid des activités à inclure
 * @param cb une fonction de callback qui reçoit un message à chaque étape
 * @returns 
 */
async function zipActivities(ids: (number | ActivityInfo)[], control: JobControl): Promise<Blob | null> {
    const typesMap = await loadActivityIndex();
    if (!Array.isArray(ids) || ids.length === 0) return null;
    ids = ids.map((id) => typeof id === 'object' ? id : { nid: id });
    const len = ids.length;
    control.setCount(len);
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
    const usedFolder: string[] = [];
    const d = new Date();
    let reportFile = createReportFile();
    reportFile.push('Archive créée le ' + d.toLocaleString(), '');
    if (control.aborted) return null;
    let i = 0;
    for (const [id, ap] of iterator(ids as ActivityInfo[], (id) => loadBunch(id.nid))) {
        if (control.aborted) return null;
        const itemReport = createItemReport();
        function report(r?: Report) {
            control.report(i, r);
            if (r != null) itemReport.add(r);
        }
        report(id);
        try {
            report({ status: 'started' });
            const a = await ap;
            report({ title: a.title.value, type: a.activityType });
            itemReport.add({ title: a.title.value, type: a.activityType });
            const archiver = archiverApi.getArchiverFor(a);
            if (archiver == null) {
                report({ status: 'unsupported' });
            } else {
                const folder = checkFolder(usedFolder, archiver.mainFileName)
                for (const f of archiver.files) {
                    if (control.aborted) return null;
                    const path = folder + '/' + f.path;
                    const data = await f.dataPromise;
                    await zipWriter.add(path, getReader(data));
                }
                report({ status: 'done' });
            }
        } catch (e) {
            if (((e as Error).name === 'api_error')
                || ((e as Error).name === 'status_error')) report({ status: 'forbidden' });
            else report({ status: 'error' });
        }
        reportFile.push(`${i + 1}/${len} ` + itemReport.toString(typesMap));
        ++i;
    }
    const fileName = checkFolder(usedFolder, 'rapport', 'txt');
    await zipWriter.add(fileName, new zip.TextReader(reportFile.toString()));
    return zipWriter.close() as Promise<Blob>;
}

const wfMap: { [key: string]: string } = {
    'current': 'en cours',
    'finished': 'rendu',
    'corrected': 'corrigé',
    'unknown': '???',
};

export type AssignmentInfo = { nid: number, firstname?: string, lastname?: string }

type AssignmentReport = {
    firstname?: string;
    lastname?: string;
    classe?: string;
    wf?: keyof typeof wfMap;
    grade?: string | null;
    status?: Report['status'];
}

/**
 * Crée un fichier zip contenant les copies des élèves pour une activité donnée.
 * 
 * @param actId nid de l'activité
 * @param ids les nid des copies à inclure
 * @param cb une fonction de callback qui reçoit un message à chaque étape
 * @returns 
 */
async function zipAssigments(actId: number, ids: number[], control: JobControl): Promise<Blob | null> {
    if (!Array.isArray(ids) || ids.length === 0) return null;
    const len = ids.length;
    const ab: ActivityBunch = await loadBunch(actId);
    control.setCount(1);
    control.report(0, { title: ab.title.value, type: ab.activityType });
    const archiver = archiverApi.getArchiverFor(ab);
    if (archiver == null) {
        control.report(0, { status: 'unsupported' });
        return null;
    }
    control.setCount(len + 1);
    const isFolderModel = archiver.assignmentModel == 'folder';
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
    const d = new Date();
    const reportFile = createReportFile();
    reportFile.push('Archive créée le ' + d.toLocaleString(), '');
    const usedFolder: string[] = [];
    if (!isFolderModel) {
        try {
            if (control.aborted) return null;
            for (const f of archiver.activityFiles) {
                if (control.aborted) return null;
                const path = f.path;
                const data = await f.dataPromise;
                await zipWriter.add(path, getReader(data));
                usedFolder.push(path);
            }
        } catch (error) {
            throw new Error("Erreur lors de l'ajout des fichiers de l'activité");
        }
    }
    const saList = await evalApi.listSa(actId, 'all').then((list) => {
        const saList: { [uid: number]: (typeof list)[number] } = {};
        for (const sa of list) {
            saList[sa.nid] = sa;
        }
        return saList;
    });
    const dParser = new DOMParser();
    if (control.aborted) return null;
    control.report(0, { status: 'done' });
    let i = 1;
    for (const [id, ap] of iterator(ids, (id) => loadBunch(id))) {
        if (control.aborted) return null;
        const itemReport = createItemReport();
        function report(ar?: AssignmentReport) {
            const r: Report = { type: null };
            if (ar == null) {
                control.report(i, r);
            } else {
                if (ar.firstname != null) {
                    let state = wfMap[ar.wf ?? 'unknown'];
                    if (ar.wf === 'corrected' && ar.grade != null) {
                        const doc = dParser.parseFromString(ar.grade, 'text/html');
                        state += ' (' + doc.documentElement.textContent + ')';
                    }
                    r.title = `${ar.firstname} ${ar.lastname} (${ar.classe}) : ${state}`;
                }
                if (ar.status != null) r.status = ar.status;
                control.report(i, r);
                itemReport.add(r);
            }
        }
        report();
        try {
            control.report(i, { status: 'started' });
            const a = await ap;
            const student = saList[a.mainNode.nid];
            const wf = a.assignmentNode?.workflow;
            const grade = a.assignmentNode?.grading?.value;
            report({ firstname: student.firstname, lastname: student.lastname, classe: student.classe, wf, grade });
            const archiver = archiverApi.getArchiverFor(a);
            if (archiver != null) {
                let fileName = student.lastname + "_" + student.firstname;
                fileName = archiverApi.slugify(fileName);
                if (control.aborted) return null;
                if (isFolderModel) {
                    const folder = checkFolder(usedFolder, fileName)
                    for (const f of archiver.files) {
                        if (control.aborted) return null;
                        const path = folder + '/' + f.path;
                        const data = await f.dataPromise;
                        await zipWriter.add(path, getReader(data));
                    }
                } else {
                    const file = archiver.mainFile;
                    fileName = checkFolder(usedFolder, fileName, file.ext);
                    const data = await file.dataPromise;
                    await zipWriter.add(fileName, getReader(data));
                }
            }
            report({ status: 'done' });
        } catch (error) {
            report({ status: 'error' });
        }
        reportFile.push(`${i}/${len} ` + itemReport.toString(null));
        ++i;
    }
    const fileName = checkFolder(usedFolder, 'rapport', 'txt');
    await zipWriter.add(fileName, new zip.TextReader(reportFile.toString()));
    return zipWriter.close() as Promise<Blob>;
};

export { zipActivities, zipAssigments };