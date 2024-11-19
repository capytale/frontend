import httpClient from '@capytale/activity.js/backend/capytale/http'

import type { Tag } from '~/types/tags'
import { fetchPrivateTags, createTag as _createTag } from '~/api/tags'

const privateTagsApiEp = "/web/c-hdls/api/private-tags"

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<Tag[]>([])
  const flatTags = ref<Tag[]>([])
  const status = ref<"idle" | "loading" | "success" | "error">("idle")


  const getAllTags = async () => {
    if (status.value == "success") return
    if (status.value == "loading") return
    try {
      status.value = "loading"
      const dt = await fetchPrivateTags()
      tags.value = unflatten(dt)
      flatTags.value = dt
      status.value = "success"
    } catch (e) {
      status.value = "error"
    }
  }
  getAllTags()

  const createTag = async (label: string, parentId: number) => {
    const newTid = await _createTag(label, parentId)
    flatTags.value.push({ id: newTid, color: "#FF0000", key: newTid, label, parentid: parentId })
    tags.value = unflatten(flatTags.value)
  }

  const hasChildren = async (tid: number | string) => {
    return flatTags.value.some(el => el.parentid == tid)
  }
  const destroyTag = async (tid: number | string) => {
    const activites = useActivitiesStore()
    // get all children of the tag
    const getChildren: (id: number) => Tag[] = (id: number) => {
      const children = flatTags.value.filter(o => o.parentid == id)
      return children!.concat(...children!.map(c => getChildren(c.id)))
    }
    // untag all activities that have the tag or its children
    activites.activities = activites.activities.map(a => {
      a.tags = a.tags.filter(t => t != tid)
      return a
    })
    for (const child of getChildren(tid)) {
      console.log("del: ", child.id)
      activites.activities = activites.activities.map(a => {
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
    flatTags.value = filterData(flatTags.value, tid)
    tags.value = unflatten(flatTags.value)
    await httpClient.postJsonAsync(
      privateTagsApiEp,
      { action: "destroy", tid }
    );
  }
  const setTagLabel = async (tid, label) => {
    flatTags.value = flatTags.value.map(el => el.id == tid ? { ...el, label: label } : el);
    tags.value = unflatten(flatTags.value)
    await httpClient.postJsonAsync(
      privateTagsApiEp,
      { action: "rename", tid, label }
    );
  }
  const setTagParent = async (tid, parentId) => {
    flatTags.value = flatTags.value.map(el => el.id == tid ? { ...el, parentid: parentId } : el);
    tags.value = unflatten(flatTags.value)
    await httpClient.postJsonAsync(
      privateTagsApiEp,
      { action: "setParent", tid, parentId }
    );
  }
  const setTagColor = async (tid: number, color: string) => {
    flatTags.value = flatTags.value.map(el => el.id == tid ? { ...el, color: color } : el);
    tags.value = unflatten(flatTags.value)
    await httpClient.postJsonAsync(
      privateTagsApiEp,
      { action: "setColor", tid, color }
    );
  }
  const data = reactive({ tags, flatTags })

  return {
    tags,
    flatTags,
    /** @deprecated */
    data,
    getAllTags,
    createTag,
    status,
    hasChildren,
    destroyTag,
    setTagLabel,
    setTagParent,
    setTagColor
  }

})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
