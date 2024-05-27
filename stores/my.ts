import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-ui/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    activities: [],
    tags: {},
    flatTags: {},
    favorites: [],
    types: [],
  }),
  actions: {
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet : la liste csv des tids suffit. 
    },
    async getTags() {
      this.tags = await fetchTags()
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
      this.flatTags.data = [...this.flatTags.data, { id: 122233322, color:"#FF0000", key: "122233322", label, parentid: parentId }]
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
    async deleteActivity(nid: number) {
      this.activities.data = this.activities.data.filter((item) => item.nid !== nid);
      // TODO : Faire en backend 
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
    async moveActivities(items: array, tid: number) {
      for (let item of items) {
        console.log("moveActivity", item.nid, tid)
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: tid } } : el);
      }
    },
  }
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
