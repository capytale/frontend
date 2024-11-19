import type { Tag } from '~/types/tags'
import { fetchPrivateTags, createTag } from '~/api/tags'


export const useTagsStore = defineStore('tags', {
  state: () => ({
    data: undefined as { tags: Tag[], flatTags: Tag[] } | undefined,
    status: "idle" as "idle" | "loading" | "success" | "error"
  }),
  getters: {
    tags: (state) => state.data?.tags || [],
    flatTags: (state) => state.data?.flatTags || [],
  },
  actions: {
    async getAllTags() {
      if (!this.data) {
        try {
          this.status = "loading"
          const dt = await fetchPrivateTags()
          this.data = { tags: unflatten(dt), flatTags: dt }
          this.status = "success"
        } catch (e) {
          this.status = "error"
          this.data = undefined
        }
      }
    },
    async createTag(label: string, parentId: number) {
      try {
        const newTid = await createTag(label, parentId)
        this.data!.flatTags.push({ id: newTid, color: "#FF0000", key: newTid, label, parentid: parentId })
        this.data!.tags = unflatten(this.data!.flatTags)
      } catch (e) {
        // console.log("error", e)
      }
      // console.log("newTid: ", newTid)
    },
    async hasChildren(tid: number | string) {
      return this.data?.flatTags.some(el => el.parentid == tid)
    },
    async destroyTag(tid: number | string) {


      // On retire le tag de toutes les activités qui le contiennent
      const activites = useActivitiesStore()

      // get all children of the tag
      const getChildren:(id: number) => Tag[] = (id: number) => {
        const children = this.data?.flatTags.filter(o => o.parentid == id)
        return children!.concat(...children!.map(c => getChildren(c.id)))
      }
      // untag all activities that have the tag or its children
      activites.activities.data = activites.activities.data.map(a => {
        a.tags = a.tags.filter(t => t != tid)
        return a
      })
      for (const child of getChildren(tid)) {
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
      this.data.flatTags = filterData(this.data.flatTags, tid)
      this.data.tags = unflatten(this.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "destroy", tid }
      );
    },
    async setTagLabel(tid, label) {
      this.data.flatTags = this.data.flatTags.map(el => el.id == tid ? { ...el, label: label } : el);
      this.data.tags = unflatten(this.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "rename", tid, label }
      );
    },
    async setTagParent(tid, parentId) {
      this.data.flatTags = this.data.flatTags.map(el => el.id == tid ? { ...el, parentid: parentId } : el);
      this.data.tags = unflatten(this.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "setParent", tid, parentId }
      );
    },
    async setTagColor(tid: number, color: string) {
      this.data.flatTags = this.data.flatTags.map(el => el.id == tid ? { ...el, color: color } : el);
      this.data.tags = unflatten(this.data.flatTags)
      await httpClient.postJsonAsync(
        privateTagsApiEp,
        { action: "setColor", tid, color }
      );
    },
  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
