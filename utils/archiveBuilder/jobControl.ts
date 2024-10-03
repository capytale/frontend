type Report = {
    type?: string | null,
    title?: string | null,
    status?: 'pending' | 'started' | 'done' | 'error' | 'unsupported' | 'forbidden';
}
type ReportHandler = (i: number, r?: Report) => void;

type JobControl = {
    /**
     * Indique si le job doit être annulé.
     */
    readonly aborted: boolean;

    /**
     * @param count Fournit le nombre prévu d'éléments à traiter.
     */
    readonly setCount: (count: number) => void;

    /**
     * Fournit un rapport sur l'avancement du job.
     * 
     * @param i L'index de l'élément en cours de traitement.
     * @param r Les informations sur l'élément en cours de traitement.
     */
    readonly report: ReportHandler;
};

type JobWatcher = {
    setCount(count: number): void;
    report: ReportHandler;
}

/**
 * Crée un objet de contrôle de job.
 * Cet objet peut être fourni aux fonctions
 * @see zipActivities et @see zipAssigments pour permettre l'annulation du job.
 * 
 * exemple:
 *   const [control, abort] = jobControl((i, total, msg) => console.log(msg));
 * 
 * @param ph une fonction de callback qui reçoit un message à chaque étape
 * @returns un tableau contenant l'objet de contrôle et une fonction pour annuler le job
 */
function jobControl(watcher: JobWatcher): [JobControl, () => void] {
    let aborted = false;
    return [
        {
            get aborted() { return aborted },
            get setCount() { return watcher.setCount },
            get report() { return watcher.report }
        },
        () => { aborted = true; }
    ];
}

export { jobControl, type JobControl, type JobWatcher, type Report, type ReportHandler };
