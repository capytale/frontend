import httpClient from '@capytale/activity.js/backend/capytale/http'

const privateTagsApiEp = "/web/c-hdls/api/private-tags"

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: {},
    flatTags: {},
  }),
  actions: {
    async getTags() {
      this.tags = await fetchTags()
    },
    async getFlatTags() {
      this.flatTags = await fetchFlatTags()
    },
    async createTag(label, parentId) {
      let r
      try {
        r = await httpClient.postGetJsonAsync(
          privateTagsApiEp,
          { action: "create", tagValues: label, parentId }
        )
      } catch (e) {
        console.log("error", e)
      }
      // TODO : utiliser ce que revoir r pour ajouter le tag au store sans utiliser le random

      this.flatTags.data = [...this.flatTags.data, { id: Math.random() * (999999999 - 99999999) + 99999999, color: "#FF0000", key: "122233322", label, parentid: parentId }]
      this.tags.data = unflatten(this.flatTags.data)
    },
    async destroyTag(tid) {
      // TODO : Faire en backend pour récupérer l'id
      this.flatTags.data = this.flatTags.data.filter((item) => item.id !== tid);
      this.tags.data = unflatten(this.flatTags.data)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "destroy", tid }
      );
    },
    setTagColor(id: number, color: string) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == id ? { ...el, color: color } : el);
      this.tags.data = unflatten(this.flatTags.data)
      // TODO : Faire en backend 
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
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
