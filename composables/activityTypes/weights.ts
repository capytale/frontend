import { ref, shallowRef, computed, readonly } from 'vue';

import typeApi, { type ActivityType, type ActivityGroups } from '@capytale/activity.js/backend/capytale/activityType';

import { useActivityTypesList } from './list';

let atl: ReturnType<typeof useActivityTypesList> | null = null;

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const groups = shallowRef<(ActivityGroups[string])[]>([]);
let fetchPromise: Promise<void> | null = null;

function reload(): void {
  if (atl == null) {
    atl = useActivityTypesList();
  } else {
    atl.reload();
  }
  if (fetchPromise != null) return;
  status.value = 'loading';
  error.value = null;
  fetchPromise = typeApi.getGroups()
    .then((ag) => {
      const gg: (ActivityGroups[string])[] = [];
      for (const g in ag) {
        gg.push(ag[g]);
      }
      groups.value = gg;
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

const compStatus = computed(() => {
  if (status.value === 'error' || atl!.status === 'error') return 'error';
  if (status.value === 'loading' || atl!.status === 'loading') return 'loading';
  return status.value;
});

const compError = computed(() => {
  if (error.value != null) return error.value;
  if (atl!.error.value != null) return atl!.error.value;
});

export const useActivityTypeWeights = () => {
  if (status.value !== 'loaded') reload();
  return readonly({
    reload,
    groups,
    status: compStatus,
    error: compError,
  })
}
