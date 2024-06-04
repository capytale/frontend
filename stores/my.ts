import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    activities: [],
    tags: {},
    assignments: [],
    flatTags: {},
    favorites: [],
    types: [],
  }),
  actions: {
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet pour les tags : la liste csv des tids suffit. 
    },
    async getTags() {
      this.tags = await fetchTags()
    },
    async getAssignments(nid: string) {
      this.assignments = await fetchAssignments(nid)
    },
    async getFlatTags() {
      this.flatTags = await fetchFlatTags()
    },
    setTagColor(id: number, color: string) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == id ? { ...el, color: color } : el);
      this.tags.data = unflatten(this.flatTags.data)
      // TODO : Faire en backend 
    },
    async deleteTag(id) {
      // TODO : Faire en backend pour récupérer l'id
      this.flatTags.data = this.flatTags.data.filter((item) => item.id !== id);
      this.tags.data = unflatten(this.flatTags.data)
    },
    addTag(label, parentId) {
      // TODO : Faire en backend pour récupérer l'id
      this.flatTags.data = [...this.flatTags.data, { id: Math.random() * (999999999 - 99999999) + 99999999, color: "#FF0000", key: "122233322", label, parentid: parentId }]
      this.tags.data = unflatten(this.flatTags.data)
    },
    setTagLabel(id, label) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == id ? { ...el, label: label } : el);
      this.tags.data = unflatten(this.flatTags.data)
      // TODO : Faire en backend 
    },
    setTagParent(id, parentId) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == id ? { ...el, parentid: parentId } : el);
      this.tags.data = unflatten(this.flatTags.data)
      // TODO : Faire en backend 
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

    async deleteActivity(nid: string | Array) {
      // TODO : Faire en backend 
      if (Array.isArray(nid)) {
        for (let o of nid) {
          this.activities.data = this.activities.data.filter((item) => item.nid !== o.nid);
        }
      } else if (typeof nid === "string") {
        this.activities.data = this.activities.data.filter((item) => item.nid !== nid);
        return httpClient.postJsonAsync(
          myActivitiesApiEp,
          { action: "delete", nid }
        );
      }
    },
    async cloneActivity(nid: number) {
      // TODO : Faire en backend 
      return httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "clone", nid }
      );
    },
    async moveActivities(items: array, tid: number) {
      // TODO : Faire en backend 
      for (let item of items) {
        console.log("moveActivity", item.nid, tid)
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: tid } } : el);
      }
    },
    async tagActivities(items: array, tags: array) {
      // TODO : Faire en backend 
      for (let item of items) {
        console.log("moveActivity", item.nid, tags)
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: el.tags.tids + "," + tags.join(",") } } : el);
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
