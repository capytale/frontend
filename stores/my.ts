import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    assignments: [],
    favorites: [],
    types: [],
    loadingAssignments: false,
  }),
  actions: {
    async getAssignments(nid: string) {
      this.loadingAssignments = true
      this.assignments = await httpClient.getJsonAsync<any>("/web/c-hdls/api/assignments/" + nid)
      this.loadingAssignments = false
    },
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet pour les tags : la liste csv des tids suffit. 
    },
    changeSaWf(sa_nid: string | Array, newWorkflow: string) {
      console.log("changeSaWf", sa_nid, newWorkflow, this.assignments)
      // TODO : Faire en backend 
      if (Array.isArray(sa_nid)) {
        for (let o of sa_nid) {
          this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == o.sa_nid ? { ...el, workflow: newWorkflow } : el);
        }
      } else {
        this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == sa_nid ? { ...el, workflow: newWorkflow } : el);
      }
    },
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
