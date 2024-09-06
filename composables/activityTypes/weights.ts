import { shallowRef, readonly } from 'vue';

import typeApi, { type ActivityGroup } from '@capytale/activity.js/backend/capytale/activityType';

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const groups = shallowRef<ActivityGroup[]>([]);
const all = shallowRef<{ [type: string]: number }>({});
let fetchPromise: Promise<void> | null = null;

function reload(): void {
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

function load() {
  if (status.value !== 'loaded') reload();
}

export const useActivityTypeWeights = (lazy: boolean = false) => {
  if (!lazy && (status.value !== 'loaded')) reload();
  return readonly({
    reload,
    load,
    groups,
    all,
    status,
    error,
  })
}
