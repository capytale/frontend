import { shallowRef, readonly } from 'vue';

import { loadBibMetaData, type BibMetaData } from '@/utils/bibMetaData';

type MetaDataIndex = {[key: string]: string};
type ModuleIndex = {[key: number]: string};

type TreeNode = {
  key: string;
  label: string;
  children?: TreeNode[];
}

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const enseignementsIndex = shallowRef<MetaDataIndex>({});
const niveauxIndex = shallowRef<MetaDataIndex>({});
const themesTree = shallowRef<TreeNode[]>([]);
const modules = shallowRef<BibMetaData['modules']>([]);
let fetchPromise: Promise<void> | null = null;

function buildTree(flat: BibMetaData['themes']): TreeNode[] {
  const tree: TreeNode[] = [];
  const map: {[key: number]: TreeNode} = {};
  for (let i = 0; i < flat.length; ++i) {
    const { id, label, parentid } = flat[i];
    map[id] = { key: id.toString(), label };
  }
  for (let i = 0; i < flat.length; ++i) {
    const { id, parentid } = flat[i];
    const node = map[id];
    if (parentid == null) {
      tree.push(node);
    } else {
      const parent = map[parentid];
      if (parent == null) {
        console.error(`Parent ${parentid} not found for ${id}`);
        tree.push(node);
      } else {
        if (parent.children == null) parent.children = [];
        parent.children.push(node);
      }
    }
  }
  return tree;
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
    fetchPromise = loadBibMetaData(forceReload)
      .then((l) => {
        const { enseignements, niveaux, themes, modules: mods } = l;
        const ei: MetaDataIndex = {};
        for (let i = 0; i < enseignements.length; ++i) {
          ei[enseignements[i].id] = enseignements[i].label;
        }
        enseignementsIndex.value = ei;
        const ni: MetaDataIndex = {};
        for (let i = 0; i < niveaux.length; ++i) {
          ni[niveaux[i].id] = niveaux[i].label;
        }
        niveauxIndex.value = ni;
        themesTree.value = buildTree(themes);
        modules.value = mods;
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
    themesTree,
    modules,
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