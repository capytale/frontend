import { shallowRef, readonly, triggerRef, type ShallowRef } from 'vue';

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
  abstractFullStatus?: 'requested' | 'present';
  abstractFull?: string | null;
  nb_clone: number;
  enseignement: string[];
  niveau: string[];
}

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const index: {
  [nid: number]: ShallowRef<BibActivityDetail | null>;
} = {};
const nids = shallowRef<number[]>([]);
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
    fetchPromise = httpClient.getJsonAsync<BibActivityDetail[]>(bibEp)
      .then((l) => {
        l ??= [];
        const _nids: number[] = [];
        for (const a of l) {
          _nids.push(a.nid);
          let sr = index[a.nid];
          if (sr == null) {
            sr = shallowRef(a);
            index[a.nid] = sr;
          }
          sr.value = a;
        }
        nids.value = _nids;
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

function getDetails(nid: number) {
  let sr = index[nid];
  if (sr == null) {
    sr = shallowRef(null);
    index[nid] = sr;
  }
  return sr.value;
}

async function loadFullAbstract(nid: number): Promise<void> {
  const sr = index[nid];
  if (sr == null) return;
  if (sr.value == null) return;
  if (sr.value.abstractFullStatus === 'requested') return;
  if (sr.value.abstractFullStatus === 'present') return;
  sr.value.abstractFullStatus = 'requested';
  triggerRef(sr);
  try {
    const dt = await httpClient.getJsonAsync<{ abstract: string }>(fullAbstractEp + nid)
    let fa = dt?.abstract ?? null;
    sr.value.abstractFull = fa;
    sr.value.abstractFullStatus = 'present';
    triggerRef(sr);
  } catch (e) {
    sr.value.abstractFullStatus = undefined;
    triggerRef(sr);
    throw e;
  }
}

function buildStore() {
  return readonly({
    load,
    nids,
    getDetails,
    loadFullAbstract,
    status,
    error,
  });
}

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