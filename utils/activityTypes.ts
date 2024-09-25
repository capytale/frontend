import typeApi, { type ActivityType } from '@capytale/activity.js/backend/capytale/activityType';

type ActivityIndex = {
    [t: string]: ActivityType;
};

let fetchPromise: Promise<ActivityIndex> | null = null;
let index: ActivityIndex | null = null;

/**
 * Charge l'index des types d'activité.
 * 
 * @param forceReload force le rechargement de l'index des types d'activité même si il est déjà chargé
 * @returns une promesse qui se résout avec l'index des types d'activité
 */
function loadActivityIndex(forceReload: boolean = false): Promise<ActivityIndex> {
    if (fetchPromise != null) return fetchPromise;
    if (forceReload || index == null) {
        return fetchPromise = typeApi.getList()
            .then((ta) => {
                const newIndex: { [t: string]: ActivityType } = {};
                for (const t of ta) {
                    newIndex[t.id] = t;
                }
                index = newIndex;
                return newIndex;
            })
            .finally(() => {
                fetchPromise = null;
            });
    }
    return Promise.resolve(index);
}

export { loadActivityIndex };