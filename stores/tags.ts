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
      let newTid
      try {
        newTid = await httpClient.postGetJsonAsync(
          privateTagsApiEp,
          { action: "create", tagValues: label, parentId }
        )
      } catch (e) {
        console.log("error", e)
      }
      console.log("newTid: ", newTid)
      this.flatTags.data = [...this.flatTags.data, { id: newTid, color: "#FF0000", key: newTid, label, parentid: parentId }]
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
    async setTagColor(tid: number, color: string) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == tid ? { ...el, color: color } : el);
      this.tags.data = unflatten(this.flatTags.data)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "setColor", tid, color }
      );
    },
    async setTagLabel(tid, label) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == tid ? { ...el, label: label } : el);
      this.tags.data = unflatten(this.flatTags.data)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "rename", tid, label }
      );
    },
    setTagParent(tid, parentId) {
      this.flatTags.data = this.flatTags.data.map(el => el.id == tid ? { ...el, parentid: parentId } : el);
      this.tags.data = unflatten(this.flatTags.data)
      // TODO : Faire en backend 
    },
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
