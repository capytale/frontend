import { shallowRef, readonly, computed } from 'vue';

import typeApi, { type ActivityType } from '@capytale/activity.js/backend/capytale/activityType';

const status = shallowRef<'loading' | 'loaded' | 'error'>('loading');
const error = shallowRef<any>();
const typeDico = shallowRef<{ [t: string]: ActivityType }>({});
const list = shallowRef<string[]>([]);
let fetchPromise: Promise<void> | null = null;

function reload(): void {
  if (fetchPromise != null) return;
  status.value = 'loading';
  error.value = null;
  fetchPromise = typeApi.getList()
    .then((ta) => {
      const dd: { [t: string]: ActivityType } = {};
      const tl: string[] = [];
      for (const t of ta) {
        dd[t.id] = t;
        tl.push(t.id);
      }
      typeDico.value = dd;
      list.value = tl;
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

function getTypeInfo(type: string): ActivityType | undefined {
  return typeDico.value[type];
}

function getCreateUrl(type: string): string {
  const info = getTypeInfo(type);
  if (info == null) return '';
  return typeApi.getCreateUrl(info);
}

function typeExists(type: string): boolean {
  return !!typeDico.value[type];
}

function typeIsAvailable(type: string): boolean {
  return !!getTypeInfo(type)?.available;
}

const availableTypes = computed(() => list.value.filter(t => getTypeInfo(t)?.available));

export const useActivityTypesList = () => {
  if (status.value !== 'loaded') reload();
  return readonly({
    reload,
    list,
    availableTypes,
    getTypeInfo,
    getCreateUrl,
    typeExists,
    typeIsAvailable,
    status,
    error,
  })
};
