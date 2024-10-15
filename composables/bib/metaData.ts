import { shallowRef, readonly, triggerRef, type ShallowRef } from 'vue';

import { loadBibMetaData, type BibMetaData } from '@/utils/bibMetaData';

type MetaDataIndex = {[key: string]: string};

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const enseignementsIndex = shallowRef<MetaDataIndex>({});
const niveauxIndex = shallowRef<MetaDataIndex>({});
let fetchPromise: Promise<void> | null = null;

/**
 * Charge les activités de la bibliothèque.
 * 
 * @param forceReload force le rechargement
 */
function load(forceReload: boolean = false): void {
  if (forceReload || (status.value !== 'loaded')) {
    if (fetchPromise != null) return;
    status.value = 'loading';
    error.value = null;
    fetchPromise = loadBibMetaData(forceReload)
      .then((l) => {
        const { enseignements, niveaux, themes, modules } = l;
        const ei: MetaDataIndex = {};
        for (let i = 0; i < enseignements.length; ++i) {
          ei[enseignements[i].key] = enseignements[i].value;
        }
        enseignementsIndex.value = ei;
        const ni: MetaDataIndex = {};
        for (let i = 0; i < niveaux.length; ++i) {
          ni[niveaux[i].key] = niveaux[i].value;
        }
        niveauxIndex.value = ni;
        status.value = 'loaded';
      })
      .catch((e) => {
        error.value = e;
        status.value = 'error';
      })
      .finally(() => {
        fetchPromise = null;
      });
  }
}

function getEnseignementLabel(key: string): string {
  return enseignementsIndex.value[key] ?? key;
}

function getNiveauLabel(key: string): string {
  return niveauxIndex.value[key] ?? key;
}

function buildStore() {
  return readonly({
    load,
    get enseignementCodes() { return Object.keys(enseignementsIndex.value); },
    getEnseignementLabel,
    get niveauCodes() { return Object.keys(niveauxIndex.value); },
    getNiveauLabel,
    status,
    error,
  })
};


type Store = ReturnType<typeof buildStore>;
let store: Store | null = null;

/**
 * Fournit un objet réactif.
 * 
 * @param lazy retarde le chargement depuis le backend
 * @returns 
 */
function useBibMetaData(lazy: boolean = false): Store {
  if (!lazy) load();
  return store ?? (store = buildStore());
}

export { useBibMetaData };