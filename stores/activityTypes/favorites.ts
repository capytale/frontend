import { ref, shallowRef, computed, readonly } from 'vue';

import typeApi from '@capytale/activity.js/backend/capytale/activityType';
import type { Status } from '~/types/store';

import { useActivityTypesList } from './list';

let atl = useActivityTypesList(true);

const status = shallowRef<Status>('idle');
const error = shallowRef<any>();
const favorites = ref<{ [t: string]: boolean }>({});
const showFavorites = shallowRef<boolean>(false);

/**
 * Charge les favoris des types d'activité.
 * 
 * @param forceReload force le rechargement des favoris des types d'activité même si ils sont déjà chargés
 */
function load(forceReload: boolean = false): void {
  if (status.value === 'loading') return;
  if ((status.value === 'success') && (!forceReload)) return;
  if (!typeApi.showFavorites()) {
    showFavorites.value = false;
    status.value = 'success';
    return;
  }
  atl.load();
  status.value = 'loading';
  error.value = null;
  showFavorites.value = true;
  typeApi.getFavorites()
    .then((fa) => {
      updateFavorites(fa);
      status.value = 'success';
    })
    .catch((e) => {
      error.value = e;
      status.value = 'error';
    })
}

const compStatus = computed(() => {
  if (showFavorites.value) {
    if (status.value === 'error' || atl.status === 'error') return 'error';
    if (status.value === 'loading' || atl.status === 'loading') return 'loading';
  }
  return status.value;
});

const compError = computed(() => {
  if (error.value != null) return error.value;
  if (showFavorites.value && (atl.error.value != null)) return atl.error.value;
});

function isFavorite(t: string): boolean {
  return favorites.value[t] ?? false;
}

function updateFavorites(f: string[]): void {
  if (!showFavorites.value) return;
  const remove = [];
  for (const t in favorites.value) {
    if (!f.includes(t)) remove.push(t);
  }
  for (const t of remove) {
    favorites.value[t] = false;
  }
  for (const t of f) {
    favorites.value[t] = true;
  }
}

const lockedToggle: { [t: string]: boolean } = {}
async function toggleFavorite(t: string): Promise<void> {
  if (!showFavorites.value) return;
  if (lockedToggle[t]) return;
  lockedToggle[t] = true;
  const current = favorites.value[t] ?? false;
  // Optimistic update
  favorites.value[t] = !current;
  try {
    if (current) updateFavorites(await typeApi.removeFavorite(t));
    else updateFavorites(await typeApi.addFavorite(t));
    lockedToggle[t] = false;
  }
  catch (e) {
    // Rollback
    favorites.value[t] = current;
    lockedToggle[t] = false;
    throw e;
  }
}

const favoriteTypes = computed(() => {
  if (showFavorites.value)
    return atl.availableTypes.filter(t => isFavorite(t))
  else
    return [];
}
);

function buildStore() {
  return readonly({
    load,
    showFavorites,
    isFavorite,
    toggleFavorite,
    favoriteTypes,
    status: compStatus,
    error: compError,
  });
}

type Store = ReturnType<typeof buildStore>;
let store: Store | null = null;

function useActivityTypeFavorites(lazy: boolean = false) {
  if (!lazy) load();
  return store ??= buildStore();
}

export { useActivityTypeFavorites };
