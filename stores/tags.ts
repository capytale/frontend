import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

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
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
