import { shallowRef, readonly, type ShallowRef } from 'vue';

import httpClient from "@capytale/activity.js/backend/capytale/http";
import { ApiError } from "@capytale/activity.js/api/http/error";

const bibEp = "/web/c-hdls/api/bibliotheque";

export type BibActivityDetail = {
  nid: number;
  type: string;
  title: string;
  changed: number;
  prenom: string | null;
  nom: string | null;
  auteur?: string;
  abstract: string | null;
  abstract_truncated: boolean;
  nb_clone: number;
  enseignement: string[];
  niveau: string[];
  for_all: boolean;
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
const fullAbstracts: { [nid: number]: ShallowRef<BibActivityFullAbstract> } = {};

function buildAuthor(a: BibActivityDetail): string {
  let nom = a.nom;
  if (nom == null || nom == '') nom = null;
  else nom.trim();
  let prenom = a.prenom;
  if (prenom == null || prenom == '') prenom = null;
  else prenom.trim();
  let r = '';
  if (nom == null) {
    return '';
  } else {
    if (prenom == null) return nom;
    else return prenom + ' ' + nom;
  }


  return r;
}

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
          a.auteur = buildAuthor(a);
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

function getFullAbstractRef(nid: number): ShallowRef<BibActivityFullAbstract> {
  let sr = fullAbstracts[nid];
  if (sr == null) {
    sr = shallowRef<BibActivityFullAbstract>({ status: undefined });
    fullAbstracts[nid] = sr;
  }
  return sr;
}

async function loadFullAbstract(nid: number): Promise<void> {
  const sr = getFullAbstractRef(nid);
  let fa = sr.value;
  if (fa.status === 'requested') return;
  if (fa.status === 'present') return;
  sr.value = { status: 'requested' };
  try {
    let fa = await httpClient.getJsonAsync<string>(`${bibEp}/${nid}/abstract`)
    fa = fa ?? '';
    sr.value = { status: 'present', fullAbstract: fa };
  } catch (e) {
    sr.value = { status: 'error', error: e };
  }
}

function getFullAbstract(nid: number): BibActivityFullAbstract {
  const sr = getFullAbstractRef(nid);
  return sr.value;
}

function remove(nid: number): void {
  const l = list.value;
  const i = l.findIndex((a) => a.nid === nid);
  if (i >= 0) {
    l.splice(i, 1);
    delete fullAbstracts[nid];
    triggerRef(list);
  }
}

async function refresh(nid: number): Promise<void> {
  if (status.value !== 'loaded') return;
  try {
    const data = await httpClient.getJsonAsync<BibActivityDetail>(`${bibEp}/${nid}`);
    if (data == null) {
      remove(nid);
    } else {
      data.auteur = buildAuthor(data);
      const l = list.value;
      const i = l.findIndex((a) => a.nid === nid);
      if (i >= 0) {
        l[i] = data;
        const sr = getFullAbstractRef(nid);
        sr.value = { status: undefined };
        triggerRef(list);
      } else {
        l.push(data);
        triggerRef(list);
      }
    }
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    // Une erreur ici signifie que l'activité n'existe pas ou n'est plus dans la bibliothèque
    // On la retire de la liste
    remove(nid);
  }


}

function buildStore() {
  return readonly({
    get list() { return list.value; },
    load,
    getFullAbstract,
    loadFullAbstract,
    refresh,
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