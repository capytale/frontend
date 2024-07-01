import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    assignments: [],
    favorites: [],
    types: [],
    loadingAssignments: false,
    typesTree: {
      "cartes": {
        "title": "Cartes électroniques",
        "activities": ['lti.vs.microbit', 'lti.vs.arduino', 'lti.vs.esp32', 'lti.vs.galaxia', 'lti.vs.l476'],
      },
      "robots": {
        "title": "Robots",
        "activities": ['lti.vs.mbot', 'lti.vs.cyberpi', 'lti.vs.eliobot', 'lti.vs.thymio'],
      }
    },
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
