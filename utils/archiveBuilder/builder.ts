// Ce module contient la logique qui permet de générer l'export des activités sous forme de fichier zip.

import "@capytale/activity.js/activity/activityBunch/all";
import archiverApi from "@capytale/activity.js/activity/archiver/all";

import loadBunch from "@capytale/activity.js/backend/capytale/activityBunch";
import evalApi from "@capytale/activity.js/backend/capytale/evaluation";
import type ActivityBunch from "@capytale/activity.js/activity/activityBunch/base";
import type { ArchiveFileData } from "@capytale/activity.js/activity/archiver/base";

import iter from "@capytale/activity.js/activity/iterator";
import * as zip from "@zip.js/zip.js";

import { loadActivityIndex } from "~/utils/activityTypes";
import { type JobControl } from "./jobControl";

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

type Report = {
    push(...items: string[]): void;
    toString(): string;
}

function createReport(): Report {
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

/**
 * Crée un fichier zip contenant les activités sélectionnées.
 * 
 * @param ids les nid des activités à inclure
 * @param cb une fonction de callback qui reçoit un message à chaque étape
 * @returns 
 */
async function zipActivities(ids: number[], control: JobControl): Promise<Blob | null> {
    const typesMap = await loadActivityIndex();
    if (!Array.isArray(ids) || ids.length === 0) return null;
    const len = ids.length;
    control.setCount(len);
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
    const usedFolder: string[] = [];
    const d = new Date();
    let report = createReport();
    report.push('Archive créée le ' + d.toLocaleString(), '');
    if (control.aborted) return null;
    let i = 0;
    for (const ap of iter(loadBunch, ids)) {
        if (control.aborted) return null;
        control.report(i)
        let itemDescription: string = `${i + 1}/${len}`;
        try {
            control.report(i, { status: 'started' });
            const a = await ap;
            control.report(i, { title: a.title.value, type: a.activityType });
            const friendlyType = typesMap[a.activityType] == null ? a.activityType : typesMap[a.activityType].name;
            itemDescription += ` (${friendlyType}) ${a.title.value}`;
            const archiver = archiverApi.getArchiverFor(a);
            if (archiver == null) {
                itemDescription += ' (Non archivable)';
                control.report(i, { status: 'unsupported' });
            } else {
                const folder = checkFolder(usedFolder, archiver.mainFileName)
                for (const f of archiver.files) {
                    if (control.aborted) return null;
                    const path = folder + '/' + f.path;
                    const data = await f.dataPromise;
                    await zipWriter.add(path, getReader(data));
                }
                control.report(i, { status: 'done' });
            }
        } catch (error) {
            itemDescription += ' (Erreur)';
            control.report(i, { status: 'error' });
        }
        report.push(itemDescription);
        ++i;
    }
    const fileName = checkFolder(usedFolder, 'rapport', 'txt');
    await zipWriter.add(fileName, new zip.TextReader(report.toString()));
    return zipWriter.close() as Promise<Blob>;
}

const wfMap: { [key: string]: string } = {
    'current': 'en cours',
    'finished': 'rendu',
    'corrected': 'corrigé',
    'unknown': '???',
};

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
    const report = createReport();
    report.push('Archive créée le ' + d.toLocaleString(), '');
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
    const saList = await evalApi.listSa(actId).then((list) => {
        const saList: { [uid: number]: (typeof list)[number] } = {};
        for (const sa of list) {
            saList[sa.uid] = sa;
        }
        return saList;
    });
    const dParser = new DOMParser();
    if (control.aborted) return null;
    control.report(0, { status: 'done' });
    let i = 1;
    for (const ap of iter(loadBunch, ids)) {
        if (control.aborted) return null;
        control.report(i);
        let itemDescription: string = `${i}/${len}`;
        try {
            control.report(i, { status: 'started' });
            const a = await ap;
            const student = saList[a.mainNode.nid];
            const wf = a.assignmentNode?.workflow ?? 'unknown';
            let state = wfMap[wf];
            if (wf === 'corrected') {
                let grade = a.assignmentNode?.grading?.value;
                if (grade != null) {
                    const doc = dParser.parseFromString(grade, 'text/html');
                    state += ' (' + doc.documentElement.textContent + ')';
                }
            }
            const studentDesc = `${student.lastname} ${student.firstname} (${student.classe})`
            control.report(i, { title: studentDesc, type: a.activityType });
            itemDescription += ` : ${studentDesc} : ${state}`;
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
            control.report(i, { status: 'done' });
        } catch (error) {
            itemDescription += ' (Erreur)';
            control.report(i, { status: 'error' });
        }
        report.push(itemDescription);
        ++i;
    }
    const fileName = checkFolder(usedFolder, 'rapport', 'txt');
    await zipWriter.add(fileName, new zip.TextReader(report.toString()));
    return zipWriter.close() as Promise<Blob>;
};

export { zipActivities, zipAssigments };