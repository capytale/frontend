import { useActivityTypesList } from "~/composables/activityTypes/list"
import { useJobManager } from "./jobStore";
import { zipActivities, zipAssigments, type ActivityInfo } from "~/utils/archiveBuilder/builder";

import { useDialog } from 'primevue/usedialog';
import { useToast } from "primevue/usetoast";
import ArchiveBuilderConfirm from "~/components/archiveBuilder/Confirm.vue";
import { jobControl } from "~/utils/archiveBuilder/jobControl";
import saveAs from "~/utils/saveAs";

/** ActivityTypeStore */

function useArchiveBuilder() {
    const atl = useActivityTypesList()
    const JobManager = useJobManager();
    const dialog = useDialog();
    const toast = useToast();

    function doExportActivities(list: ActivityInfo[]): void {
        list = list.map((o) => ({ ...o }));
        JobManager.createJob(async (control) => {
            const blob = await zipActivities(list, control);
            if (blob == null) {
                if (control.aborted) return;
                toast.add({
                    severity: 'error',
                    summary: 'Export impossible',
                    detail: 'Une erreur est survenue lors de la création du fichier.',
                    life: 2000,
                });
                return;
            }
            const url = URL.createObjectURL(blob);
            saveAs('export.zip', url);
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 0);
        });
    }

    function exportActivities(list: Required<ActivityInfo>[]): void {
        if (JobManager.hasRunningJobs()) {
            toast.add({
                severity: 'warn',
                summary: 'Export impossible',
                detail: 'Un export est déjà en cours.',
                life: 2000,
            });
            return;
        }
        let exportable: typeof list = [];
        let notExportable: typeof list = [];
        for (const o of list) {
            if (!atl.typeExists(o.type)) {
                notExportable.push(o);
                continue;
            }
            const info = atl.getTypeInfo(o.type);
            if (!info.exportable) {
                notExportable.push(o);
                continue;
            }
            exportable.push(o);
        }

        if (exportable.length <= 0) {
            toast.add({
                severity: 'warn',
                summary: 'Export impossible',
                detail: 'Les éléments sélectionnés sont d\'un type qui n\'est pas exportable.',
                life: 2000,
            });
            return;
        }

        if (notExportable.length > 0) {
            dialog.open(ArchiveBuilderConfirm, {
                data: {
                    exportable,
                    notExportable,
                },
                props: {
                    blockScroll: true,
                    header: 'Création de l\'export zip'

                },
                onClose: (opt) => {
                    if (opt?.data) {
                        doExportActivities(list);
                    }
                }
            });
            return;
        }
        doExportActivities(list);
    }

    function doExportAssignments(actNid: number, assignmentsNids: number[]): void {
        JobManager.createJob(async (control) => {
            const blob = await zipAssigments(actNid, assignmentsNids, control);
            if (blob == null) {
                toast.add({
                    severity: 'error',
                    summary: 'Export impossible',
                    detail: 'Une erreur est survenue lors de la création du fichier.',
                    life: 2000,
                });
                return;
            }
            const url = URL.createObjectURL(blob);
            saveAs('export.zip', url);
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 0);
        });
    }

    function exportAssignments(activity: ActivityInfo, assignments: number[]): void {
        if (JobManager.hasRunningJobs()) {
            toast.add({
                severity: 'warn',
                summary: 'Export impossible',
                detail: 'Un export est déjà en cours.',
                life: 2000,
            });
            return;
        }
        if (activity.type != null) {
            const info = atl.getTypeInfo(activity.type);
            if (!info.exportable) {
                toast.add({
                    severity: 'warn',
                    summary: 'Export impossible',
                    detail: 'Cette activité n\'est pas exportable.',
                    life: 2000,
                });
                return;
            }
        }
        doExportAssignments(activity.nid, assignments);
    }

    return {
        exportActivities,
        exportAssignments,
    }
}

export { useArchiveBuilder };