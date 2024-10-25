import type { Me } from '@capytale/activity.js/api/me/backend';
import httpClient from '@capytale/activity.js/backend/capytale/http';

const apiEp = "/web/c-hdls/api/my-bib-form-indexing-elements";

type MetaDataItem = {
    id: string;
    label: string;
};

type TaxonomyItem = {
    id: number;
    label: string;
};

type TaxonomyTreeItem = TaxonomyItem & {
    parentId?: number;
}

type BibMetaData = {
    enseignements: MetaDataItem[];
    niveaux: MetaDataItem[];
    themes: TaxonomyTreeItem[];
    modules: TaxonomyItem[];
}

let fetchPromise: Promise<BibMetaData> | null = null;
let index: BibMetaData | null = null;

/**
 * Charge l'index des types d'activité.
 * 
 * @param forceReload force le rechargement de l'index des types d'activité même si il est déjà chargé
 * @returns une promesse qui se résout avec l'index des types d'activité
 */
function loadBibMetaData(forceReload: boolean = false): Promise<BibMetaData> {
    if (fetchPromise != null) return fetchPromise;
    if (forceReload || index == null) {
        return fetchPromise = httpClient.getJsonAsync<BibMetaData>(apiEp)
            .then((ta) => {
                index = ta!;
                return ta!;
            })
            .finally(() => {
                fetchPromise = null;
            });
    }
    return Promise.resolve(index);
}

export { loadBibMetaData, type BibMetaData };