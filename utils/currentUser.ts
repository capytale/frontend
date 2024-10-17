import meApi, { type Me as CurrentUser } from '@capytale/activity.js/backend/capytale/me';

let currentUser: CurrentUser | null | false = false;

let fetchPromise: Promise<CurrentUser | null> | null = null;

/**
 * Charge l'utilisateur courant.
 * 
 * @param forceReload force le rechargement de l'utilisateur courant même si il est déjà chargé
 * @returns une promesse qui se résout avec l'utilisateur courant
 */
function loadCurrentUser(forceReload: boolean = false): Promise<CurrentUser | null> {
    if (fetchPromise != null) return fetchPromise;
    if (forceReload || currentUser === false) {
        if (forceReload) meApi.clearMe();
        return fetchPromise = meApi.getMeAsync()
            .then((me) => {
                currentUser = me;
                return me;
            })
            .finally(() => {
                fetchPromise = null;
            });
    }
    return Promise.resolve(currentUser);
}

export { loadCurrentUser, type CurrentUser };