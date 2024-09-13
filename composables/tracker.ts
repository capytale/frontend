import activityJsTracker from '@capytale/activity.js/backend/capytale/tracker';

type Tracker = {
    /**
     * Tracker un événement page view
     * 
     * @param url L'url de la page à tracker (doit commencer par '/')
     */
    trackPageView(url?: string): void;
};


const baseUrl = window.location.origin;


function createTracker(): Tracker {
    const config = useRuntimeConfig();
    return {
        trackPageView(url?: string) {
            if (url != null) {
                if (url.startsWith('/')) {
                    url = baseUrl + config.app.baseURL + url;
                } else if (!url.startsWith(baseUrl)) {
                    console.error(`Tracker: l'url '${url}' n'est pas valide. Veuillez fournir une url qui commence par '/'`);
                    url = undefined;
                }
            }
            if (url != null) {
                activityJsTracker.push(['setCustomUrl', url]);
            }
            activityJsTracker.trackPageView();
        }
    };
}

let tracker: Tracker | undefined;
export function useTracker(): Tracker {
    return tracker ??= createTracker();
}