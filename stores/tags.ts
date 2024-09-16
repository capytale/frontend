import httpClient from '@capytale/activity.js/backend/capytale/http'

const privateTagsApiEp = "/web/c-hdls/api/private-tags"

export const useTagsStore = defineStore('tags', {
  state: () => ({
    // tags: {},
    // flatTags: {},
    data: {},
  }),
  getters: {
    tags: (state) => state.data.data?.tags || [],
    flatTags: (state) => state.data.data?.flatTags || [],
    status: (state) => state.data.status,
  },
  actions: {
    async getTags() {
      this.tags = await fetchTags()
    },
    async getFlatTags() {
      this.flatTags = await fetchFlatTags()
    },

    async getAllTags() {
      this.data = await fetchAllTags()
    },
    async createTag(label, parentId) {
      let newTid
      try {
        newTid = await httpClient.postGetJsonAsync(
          privateTagsApiEp,
          { action: "create", tagValues: label, parentId }
        )
      } catch (e) {
        // console.log("error", e)
      }
      // console.log("newTid: ", newTid)
      this.data.data.flatTags = [...this.data.data.flatTags, { id: newTid, color: "#FF0000", key: newTid, label, parentid: parentId }]
      this.data.data.tags = unflatten(this.data.data.flatTags)
    },
    async hasChildren(tid) {
      return this.data.data.flatTags.some(el => el.parentid == tid)
    },
    async destroyTag(tid) {


      // On retire le tag de toutes les activités qui le contiennent
      const activites = useActivitiesStore()

      // get all children of the tag
      const getChildren = (data, id) => {
        const children = data.filter(o => o.parentid == id)
        return children.concat(...children.map(c => getChildren(data, c.id)))
      }
      // untag all activities that have the tag or its children
      activites.activities.data = activites.activities.data.map(a => {
        a.tags = a.tags.filter(t => t != tid)
        return a
      })
      for (const child of getChildren(this.data.data.flatTags, tid)) {
        console.log("del: ", child.id)
        activites.activities.data = activites.activities.data.map(a => {
          a.tags = a.tags.filter(t => t != child.id)
          return a
        })
      }

      const filterData = (data, id) => data.filter(o => {
        if (o.children) {
          o.children = filterData(o.children, id);
        }
        return o.id != id
      })
      this.data.data.flatTags = filterData(this.data.data.flatTags, tid)
      this.data.data.tags = unflatten(this.data.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "destroy", tid }
      );
    },
    async setTagLabel(tid, label) {
      this.data.data.flatTags = this.data.data.flatTags.map(el => el.id == tid ? { ...el, label: label } : el);
      this.data.data.tags = unflatten(this.data.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "rename", tid, label }
      );
    },
    async setTagParent(tid, parentId) {
      this.data.data.flatTags = this.data.data.flatTags.map(el => el.id == tid ? { ...el, parentid: parentId } : el);
      this.data.data.tags = unflatten(this.data.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "setParent", tid, parentId }
      );
    },
    async setTagColor(tid: number, color: string) {
      this.data.data.flatTags = this.data.data.flatTags.map(el => el.id == tid ? { ...el, color: color } : el);
      this.data.data.tags = unflatten(this.data.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "setColor", tid, color }
      );
    },
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
