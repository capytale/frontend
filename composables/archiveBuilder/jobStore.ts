import { shallowRef, readonly, reactive, computed } from 'vue';
import { jobControl, type JobControl, type Report } from "~/utils/archiveBuilder/jobControl";

const doneDelay = 1000;
const errorDelay = 3000;
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

type JobStore = ReturnType<(typeof readonly<{
    total: ReturnType<typeof shallowRef<number>>;
    current: ReturnType<typeof shallowRef<number>>;
    log: ReturnType<typeof reactive<Report[]>>;
    error: ReturnType<typeof shallowRef<any>>;
    aborted: ReturnType<typeof shallowRef<boolean>>;
    cancelJob: () => void;
}>)>

type JobStoreList = {
    [id: number]: JobStore
}

let jobIdInc: number = 0;
const jobStoreList = reactive<JobStoreList>({});

async function createJob(execute: (control: JobControl) => Promise<void>) {
    const jobId = jobIdInc++;
    const current = shallowRef<number>();
    const total = shallowRef<number>();
    const log = reactive<Report[]>([]);
    const error = shallowRef<any>();
    const aborted = shallowRef<boolean>(false);

    const [control, abort] = jobControl({
        setCount(count: number) {
            total.value = count;
        },
        report(i, r?) {
            current.value = i;
            if (r == null) r = {};
            if (r.status == null) r.status = 'pending';
            const cr = log[i];
            if (cr == null) {
                log[i] = r;
            } else {
                if (r.type != null) cr.type = r.type;
                if (r.title != null) cr.title = r.title;
                if (r.status != null) cr.status = r.status;
            }
        }
    });

    function cancelJob() {
        aborted.value = true;
        abort();
    }

    const jobStore = readonly({
        total,
        current,
        log,
        error,
        aborted,
        cancelJob,
    });

    jobStoreList[jobId] = jobStore;
    try {
        await execute(control);
        await sleep(doneDelay);
        delete jobStoreList[jobId];
    }
    catch (e) {
        error.value = e;
        await sleep(errorDelay);
        delete jobStoreList[jobId];
    }
}

function buildJobManager() {
    return readonly({
        hasRunningJobs,
        createJob,
    });
}
type JobManager = ReturnType<typeof buildJobManager>;
let jobStore: JobManager | null = null;
function useJobManager(): JobManager {
    return jobStore ??= buildJobManager();
}

let panelCount: number = 0;
function registerPanel() {
    if (++panelCount > 1) {
        console.warn('Un seul panneau de contrôle des jobs devrait être créé.');
    }
    return () => void --panelCount;
}

function hasRunningJobs() { return Object.keys(jobStoreList).length > 0; }

const visible = computed(() => hasRunningJobs());

function buildPanelStore() {
    return readonly({
        registerPanel,
        visible,
        jobs: jobStoreList,
    });
}

type PanelStore = ReturnType<typeof buildPanelStore>;
let panelStore: PanelStore | null = null;

function usePanelStore(): PanelStore {
    return panelStore ??= buildPanelStore();
}

export { usePanelStore, useJobManager, type JobStore, type Report };
