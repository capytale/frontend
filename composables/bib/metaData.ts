import { loadBibMetaData, type BibMetaData } from '@/utils/bibMetaData';

type ThemeItem = {
  label: string;
  parentId?: number;
}

const store = shallowReactive({
  load,
  enseignementCodes: [] as string[],
  getEnseignementLabel(key: string): string { return key; },
  niveauCodes: [] as string[],
  getNiveauLabel(key: string): string { return key; },
  modulesCodes: [] as number[],
  getModuleLabel(key: number): string { return key.toString(); },
  themesCodes: [] as number[],
  getThemeLabel(key: number): string { return key.toString(); },
  getThemeItem(key: number): ThemeItem | undefined { return undefined; },
  status: 'loading' as 'loading' | 'loaded' | 'error',
  error: null as any,
}); 


function buildIndex<TK extends string | number>(list: { id: TK, label: string }[]): [
  codes: TK[],
  labelGetter: (key: TK) => string
] {
  const index: Partial<{ [key in TK]: string }> = {};
  const codes: TK[] = [];
  for (let i = 0; i < list.length; ++i) {
    const { id, label } = list[i];
    index[id] = label;
    codes.push(id);
  }
  return [
    markRaw(codes),
    (key: TK) => index[key] ?? key.toString()
  ];
}

function buildThemeIndex(list: BibMetaData['themes']): [
  codes: number[],
  itemGetter: (key: number) => ThemeItem | undefined,
  labelGetter: (key: number) => string
] {
  const index: { [key: number]: ThemeItem } = {};
  const codes: number[] = [];
  for (let i = 0; i < list.length; ++i) {
    const { id, label, parentId } = list[i];
    index[list[i].id] = { label, parentId };
    codes.push(id);
  }
  return [
    markRaw(codes),
    (key: number) => index[key],
    (key: number) => index[key]?.label ?? key.toString()
  ];
}

let fetchPromise: Promise<void> | null = null;

/**
 * Charge les items d'indexation de la bibliothèque.
 * 
 * @param forceReload force le rechargement
 */
function load(forceReload: boolean = false): void {
  if (forceReload || (store.status !== 'loaded')) {
    if (fetchPromise != null) return;
    store.status = 'loading';
    store.error = null;
    fetchPromise = loadBibMetaData(forceReload)
      .then((l) => {
        const { enseignements, niveaux, themes, modules } = l;
        [
          store.enseignementCodes,
          store.getEnseignementLabel,
        ] = buildIndex(enseignements);
        [
          store.niveauCodes,
          store.getNiveauLabel,
        ] = buildIndex(niveaux);
        [
          store.modulesCodes,
          store.getModuleLabel,
        ] = buildIndex(modules);
        [
          store.themesCodes,
          store.getThemeItem,
          store.getThemeLabel,
        ] = buildThemeIndex(themes);
        store.status = 'loaded';
      })
      .catch((e) => {
        store.error = e;
        store.status = 'error';
      })
      .finally(() => {
        fetchPromise = null;
      });
  }
}


/**
 * Fournit un objet réactif.
 * 
 * @param lazy retarde le chargement depuis le backend
 * @returns 
 */
function useBibMetaData(lazy: boolean = false) {
  if (!lazy) load();
  return store;
}

export { useBibMetaData };