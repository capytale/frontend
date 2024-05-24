import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-ui/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    data: [{}],
    favorites: [],
    types: [],
  }),
  actions: {
    async deleteActivity(nid: number) {
      return httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "delete", nid }
      );
    },
    async cloneActivity(nid: number) {
      return httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "clone", nid }
      );
    },
  }
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.