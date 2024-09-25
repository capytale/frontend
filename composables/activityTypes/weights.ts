import { shallowRef, readonly } from 'vue';

import typeApi, { type ActivityGroup } from '@capytale/activity.js/backend/capytale/activityType';

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const groups = shallowRef<ActivityGroup[]>([]);
const all = shallowRef<{ [type: string]: number }>({});
let fetchPromise: Promise<void> | null = null;

/**
 * Charge les poids des types d'activité.
 * 
 * @param forceReload force le rechargement des poids des types d'activité même si ils sont déjà chargés
 */
function load(forceReload: boolean = false): void {
  if (forceReload || (status.value !== 'loaded')) {
    if (fetchPromise != null) return;
    status.value = 'loading';
    error.value = null;
    fetchPromise = typeApi.getWeights()
      .then((w) => {
        const gg: ActivityGroup[] = [];
        for (const g in w.groups) {
          gg.push(w.groups[g]);
        }
        groups.value = gg;
        const aa: { [type: string]: number } = {};
        for (const a in w.all) {
          aa[a] = w.all[a];
        }
        all.value = aa;
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

function buildStore() {
  return readonly({
    load,
    groups,
    all,
    status,
    error,
  });
}

type Store = ReturnType<typeof buildStore>;
let store: Store | null = null;

/**
 * Fournit un objet réactif contenant les poids et groupes des types d'activité. 
 * 
 * @param lazy retarde le chargement depuis le backend
 * @returns 
 */
function useActivityTypeWeights(lazy: boolean = false): Store {
  if (!lazy) load();
  return store ?? (store = buildStore());
}

export { useActivityTypeWeights };