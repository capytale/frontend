import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-ui/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    tags: {},
    flatTags: {},
    data: [{}],
    favorites: [],
    types: [],
  }),
  actions: {
    async getTags() {
      this.tags = await fetchTags()
    },
    async getFlatTags() {
      this.flatTags = await fetchFlatTags()
    },
    setTagColor(id, color) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == id ? {...el, color: color} : el);
      this.tags.data = unflatten(this.flatTags.data)
    },
    setTagLabel(id, label) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == id ? {...el, label: label} : el);
      this.tags.data = unflatten(this.flatTags.data)
    },
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
