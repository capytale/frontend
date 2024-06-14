import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    //activities: [],
    // tags: {},
    assignments: [],
    // flatTags: {},
    favorites: [],
    types: [],
    bib: [],
  }),
  actions: {
    async getBib() {
      this.bib = await fetchBibData()
    },
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet pour les tags : la liste csv des tids suffit. 
    },
    changeSaWf(sa_nid: string | Array, newWorkflow: string) {
      // TODO : Faire en backend 
      if (Array.isArray(sa_nid)) {
        for (let o of sa_nid) {
          this.assignments.data.tab = this.assignments.data.tab.map(el => el.sa_nid == o.sa_nid ? { ...el, workflow: newWorkflow } : el);
        }
      } else {
        this.assignments.data.tab = this.assignments.data.tab.map(el => el.sa_nid == sa_nid ? { ...el, workflow: newWorkflow } : el);
      }
    },
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
