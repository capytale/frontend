import { ref, shallowRef, computed, readonly } from 'vue';

import typeApi, { type ActivityType, type ActivityGroups } from '@capytale/activity.js/backend/capytale/activityType';

import { useActivityTypesList } from './list';

let atl: ReturnType<typeof useActivityTypesList> | null = null;

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const favorites = ref<{ [t: string]: boolean }>({});
const showFavorites = shallowRef<boolean>(false);
let fetchPromise: Promise<void> | null = null;

function reload(): void {
  if (atl == null) {
    atl = useActivityTypesList();
  } else {
    atl.reload();
  }
  if (fetchPromise != null) return;
  if (typeApi.showFavorites()) {
    status.value = 'loading';
    error.value = null;
    fetchPromise = typeApi.getFavorites()
      .then((fa) => {
        updateFavorites(fa);
        showFavorites.value = true;
        status.value = 'loaded';
      })
      .catch((e) => {
        error.value = e;
        status.value = 'error';
      })
      .finally(() => {
        fetchPromise = null;
      });
  } else {
    status.value = 'loaded';
    error.value = null;
  }
}

const compStatus = computed(() => {
  if (status.value === 'error' || atl!.status === 'error') return 'error';
  if (status.value === 'loading' || atl!.status === 'loading') return 'loading';
  return status.value;
});

const compError = computed(() => {
  if (error.value != null) return error.value;
  if (atl!.error.value != null) return atl!.error.value;
});

function isFavorite(t: string): boolean {
  return favorites.value[t] ?? false;
}

function updateFavorites(f: string[]): void {
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

const favoriteTypes = computed(() => atl!.availableTypes.filter(t => isFavorite(t)));

export const useActivityTypeFavorites = () => {
  if (status.value !== 'loaded') reload();
  return readonly({
    reload,
    showFavorites,
    isFavorite,
    toggleFavorite,
    favoriteTypes,
    status: compStatus,
    error: compError,
  })
}
