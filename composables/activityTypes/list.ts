import { shallowRef, readonly, computed } from 'vue';

import typeApi, { type ActivityType } from '@capytale/activity.js/backend/capytale/activityType';

const unknownLogo = '/web/modules/custom/capytale_activity/src/Activity/logo/logo_false.svg';

const unknownType: ActivityType = {
  id: 'unknown',
  name: 'Inconnu',
  icon: { path: unknownLogo, style: {} },
  plainIcon: { path: unknownLogo, style: {} },
  helpUrl: '',
  summary: '',
  description: '',
  bundle: '',
  available: false,
  detailedEvaluation: false,
};

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

/**
 * Fournit les infos sur le type d'activité.
 * Renvoie une valeur réactive.
 * Tant que la liste des types n'est pas chargée depuis le backend, renvoie unknownType.
 * 
 * @param type le type d'activité
 * @returns une valeur réactive contenant les informations sur le type
 */
function getTypeInfo(type: string): ActivityType {
  if (typeExists(type)) return typeDico.value[type];
  else return unknownType;
}

/**
 * Fournit l'URL de création d'une activité du type donné.
 * Renvoie une valeur réactive qui est '' tant que la liste des types n'est pas chargée
 * depuis le backend.
 * Renvoie '' si le type n'existe pas.
 * 
 * @param type le type d'activité
 * @returns une valeur réactive contenant l'URL de création
 */
function getCreateUrl(type: string): string {
  if (typeExists(type)) return typeApi.getCreateUrl(getTypeInfo(type));
  else return '';
}

/**
 * Indique si le type existe
 * Renvoie une valeur réactive qui est false tant que la liste des types n'est pas chargée
 * depuis le backend.
 * 
 * @param type le type à tester
 * @returns valeur réactive indiquant si le type existe
 */
function typeExists(type: string): boolean {
  return !!typeDico.value[type];
}

/**
 * Indique si le type est disponible pour l'utilisateur courant.
 * Renvoie une valeur réactive qui est false tant que la liste des types n'est pas chargée
 * depuis le backend.
 * 
 * @param type le type à tester
 * @returns valeur réactive indiquant si le type est disponible
 */
function typeIsAvailable(type: string): boolean {
  return !!getTypeInfo(type)?.available;
}

const availableTypes = computed(() => list.value.filter(t => getTypeInfo(t)?.available));

function buildStore() {
  return readonly({
    reload,
    /**
     * Liste complète des types d'activité. Y compris les types non disponibles
     * pour l'utilisateur courant.
     * Valeur réactive égale à [] tant que la liste n'est pas chargée.
     */
    list,
    /**
     * Liste des types d'activité disponibles pour l'utilisateur courant.
     * Valeur réactive égale à [] tant que la liste n'est pas chargée.
     */
    availableTypes,
    getTypeInfo,
    getCreateUrl,
    typeExists,
    typeIsAvailable,
    /**
     * Statut du chargement de la liste des types d'activité.
     * Valeur réactive.
     */
    status,
    /**
     * Erreur lors du chargement de la liste des types d'activité
     * lorsque status === 'error'.
     * 
     * Valeur réactive.
     */
    error,
  })
};

type Store = ReturnType<typeof buildStore>;
let store: Store | null = null;

function useActivityTypesList(): Store {
  if (status.value !== 'loaded') reload();
  return store || (store = buildStore());
}

export { useActivityTypesList };
