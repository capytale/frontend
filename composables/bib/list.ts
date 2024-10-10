import { shallowRef, readonly, type ShallowRef } from 'vue';

import httpClient from '@capytale/activity.js/backend/capytale/http';

const bibEp = "/web/c-hdls/api/bib?new";
const fullAbstractEp = "/web/c-hdls/api/bib/full-descr/";

export type BibActivityDetail = {
  nid: number;
  type: string;
  title: string;
  changed: number;
  prenom: string | null;
  nom: string | null;
  abstract: string | null;
  abstract_truncated: boolean;
  nb_clone: number;
  enseignement: string[];
  niveau: string[];
}

export type BibActivityFullAbstract = {
  status?: 'requested' | 'present' | 'error';
  error?: any;
  fullAbstract?: string;
}

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const list = shallowRef<BibActivityDetail[]>([]);
let fetchPromise: Promise<void> | null = null;

/**
 * Index des full abstracts chargés à la demande.
 */
const fullAbstracts: { [nid: number]: ShallowRef<BibActivityFullAbstract | undefined> } = {};

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
    fetchPromise = httpClient.getJsonAsync<BibActivityDetail[]>(bibEp)
      .then((l) => {
        l ??= [];
        for (let i = 0; i < l.length; ++i) {
          const a = l[i];
          if (a.abstract != null) {
            if (a.abstract_truncated) {
              // On tronque à partir du dernier espace
              const i = a.abstract.lastIndexOf(' ');
              if ((i > 0) && (a.abstract.length - i <= 60)) {
                a.abstract = a.abstract.substring(0, i);
              }
              // On ajoute une entrée dans le dictionnaire des abstracts complets
              // qui seront chargés à la demande
              fullAbstracts[a.nid] = shallowRef();
            }
          }
        }
        list.value = l;
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

async function loadFullAbstract(nid: number): Promise<void> {
  const sr = fullAbstracts[nid];
  if (sr == null) return;
  let fa = sr.value;
  if (fa == null) {
    fa = { status: undefined };
  }
  if (fa.status === 'requested') return;
  if (fa.status === 'present') return;
  sr.value = { status: 'requested' };
  try {
    const dt = await httpClient.getJsonAsync<{ abstract: string }>(fullAbstractEp + nid)
    let fa = dt?.abstract ?? '';
    sr.value = { status: 'present', fullAbstract: fa };
  } catch (e) {
    sr.value = { status: 'error', error: e };
  }
}

function getFullAbstract(nid: number): BibActivityFullAbstract {
  let sr = fullAbstracts[nid];
  if (sr == null) return { status: undefined };
  let fa = sr.value;
  if (fa == null) {
    fa = { status: undefined };
    sr.value = fa;
  }
  return fa;
}

function buildStore() {
  return readonly({
    get list() { return list.value; },
    load,
    getFullAbstract,
    loadFullAbstract,
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
function useBibList(lazy: boolean = false): Store {
  if (!lazy) load();
  return store ?? (store = buildStore());
}

export { useBibList };