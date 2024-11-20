import { shallowRef, readonly, computed } from 'vue';

import { type ActivityType } from '@capytale/activity.js/backend/capytale/activityType';

import { loadActivityIndex } from '~/utils/activityTypes';
import type { Status } from '~/types/store';

type ActivityIndex = {
  [t: string]: ActivityType;
};

const unknownLogo = '/web/modules/custom/capytale_activity/src/Activity/logo/logo_false.svg';

const unknownType: ActivityType = {
  id: 'unknown',
  name: 'Inconnu',
  icon: { path: unknownLogo, style: {} },
  helpUrl: '',
  summary: '',
  description: '',
  bundle: '',
  available: false,
  detailedEvaluation: false,
  exportable: false,
};

function buildUnknownType(type: string): ActivityType {
  return {
    ...unknownType,
    id: type,
    name: type,
  };
}

const status = shallowRef<Status>('idle');

const error = shallowRef<any>();

const list = shallowRef<string[]>([]);

const index = shallowRef<ActivityIndex>({});

/**
 * Charge la liste des types d'activité.
 * 
 * @param forceReload force le rechargement de la liste des types d'activité même si elle est déjà chargée
 */
function load(forceReload: boolean = false): void {
  if (status.value === 'loading') return;
  if ((status.value === 'success') && (!forceReload)) return;
  status.value = 'loading';
  error.value = null;
  loadActivityIndex(forceReload)
    .then((ta) => {
      const ll = Object.keys(ta);
      list.value = ll;
      index.value = ta;
      status.value = 'success';
    })
    .catch((e) => {
      error.value = e;
      status.value = 'error';
    })
}

/**
 * Fournit les infos sur le type d'activité.
 * Renvoie une valeur réactive.
 * Tant que la liste des types n'est pas chargée depuis le backend renvoie null.
 * 
 * @param type le type d'activité
 * @returns une valeur réactive contenant les informations sur le type
 */
function getTypeInfo(type: string): ActivityType | null {
  if (typeExists(type)) {
    return index.value[type];
  } else {
    if (status.value === 'success') {
      return buildUnknownType(type);
    } else {
      return null;
    }
  }
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
  if (typeExists(type)) return `/web/c-hdls/activity/${type}/add`;
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
  return !!index.value[type];
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
    load,
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

/**
 * Fournit un objet réactif contenant les informations sur les types d'activité.
 * 
 * @param lazy retarde le chargement depuis le backend
 * @returns 
 */
function useActivityTypesList(lazy: boolean = false): Store {
  if (!lazy) load();
  return store ??= buildStore();
}

export { useActivityTypesList };
