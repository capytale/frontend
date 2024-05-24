import TypeApi, { ActivityType } from '@capytale/activity.js/backend/capytale/activityType'



export const useCats = () => [
  {
      label: 'Tous niveaux',
      value: 'all'
  },
  // {
  //     label: 'Favoris',
  //     value: 'fav'
  // },
  {
      label: 'École',
      value: 'ecole'
  },
  {
      label: 'Collège',
      value: 'college'
  },
  {
      label: 'Lycée',
      value: 'lycee'
  },
  {
      label: 'Prépa',
      value: 'prepa'
  },
]

export const useMats = () => [
  {
      label: 'Toutes matières',
      value: 'all'
  },
  // {
  //     label: 'Favoris',
  //     value: 'fav'
  // },
  {
      label: 'SNT/NSI',
      value: 'nsi'
  },
  {
      label: 'Mathématiques',
      value: 'maths'
  },
  {
      label: 'Technologie',
      value: 'techno'
  },
  {
      label: 'Physique/Chimie',
      value: 'phychim'
  },
]
export const useActivities = async () => {
    const tmp:Ref<ActivityType[]> = ref()
    tmp.value = await TypeApi.getList()
    console.log("loaded from server");
    console.log(tmp.value.length);
    return tmp.value
  }