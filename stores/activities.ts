import httpClient from '@capytale/activity.js/backend/capytale/http'

// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: [],
  }),
  actions: {
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet pour les tags : la liste csv des tids suffit. 
    },

    async deleteActivity(nids: Array) {
      for (let nid of nids) {
        console.log("deleteActivity", nid)
        this.activities.data = this.activities.data.filter((item) => item.nid !== nid);
      }
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "delete", nids }
      );
    },
    async cloneActivity(nid: number) {
      let response
      try {
        response = await httpClient.postGetJsonAsync(
          myActivitiesApiEp,
          { action: "clone", nid }
        )
      } catch (e) {
        console.log("error", e)
      }
      console.log("nid, code, changed : ", response.nid, response.code, response.changed)
      // opération sur le store pour ajouter le clone
    },
    async tagActivities(nids: any[], tags: any[]) {
      for (let item of nids) {
        console.log("tagActivity", item.nid, tags)
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: el.tags.tids + "," + tags.join(",") } } : el);
      }
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "tag", nids, tags }
      );
    },
    async moveActivities(items: array, tid: number) {
      // TODO : Faire en backend 
      for (let item of items) {
        console.log("moveActivity", item.nid, tid)
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: tid } } : el);
      }
    },
    async untagActivity(nid: number, tid: number) {
      // TODO : Faire en backend 
      let obj = this.activities.data.find(el => el.nid == nid);
      let arrayTids = obj.tags.tids.split(",");
      let index = arrayTids.indexOf(tid);
      if (index > -1) {
        arrayTids.splice(index, 1);
      }
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, tags: { tids: arrayTids.join(",") } } : el);
    }
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
