import httpClient from '@capytale/activity.js/backend/capytale/http'
import { online } from '@/constants'
import { myJsonData } from '@/mockup_data/my_json_data'
import { myPrivateTags } from '@/mockup_data/my-private-tags'

let myActivitiesCache: { property: object }
// renvoie {data, pending, error, status}
export function fetchMyActivities() {
  return useLazyAsyncData('activKey', async () => {
    if (online) {
      return myActivitiesCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/all-activities")
    } else {
      return myActivitiesCache = myJsonData
    }
  },
    {
      getCachedData() {
        return myActivitiesCache
      }
    }
  )
}

let assignmentsCache: { property: object }
// renvoie {data, pending, error, status}
export function fetchAssignments(nid: string) {
  return useAsyncData('assignKey'+nid, async () => {
    if (online) {
      return assignmentsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/assignments/" + nid)
    } else {
      return assignmentsCache = myJsonData
    }
  },
    {
      getCachedData() {
        return assignmentsCache
      }
    }
  )
}


let myTagsCache
export function fetchTags() {
  return useLazyAsyncData('tagsKey', async () => {
    if (online) {
      myTagsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/get-private-tags-flat-list")
      return unflatten(myTagsCache)
    } else {
      return myTagsCache = unflatten(myPrivateTags)
    }
  },
    {
      getCachedData() {
        return myTagsCache
      }
    }
  )
}

let myFlatTagsCache
export function fetchFlatTags() {
  return useLazyAsyncData('flatTagsKey', async () => {
    if (online) {
      myFlatTagsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/get-private-tags-flat-list")
      return myFlatTagsCache
    } else {
      return myFlatTagsCache = myPrivateTags
    }
  },
    {
      getCachedData() {
        return myFlatTagsCache
      }
    }
  )
}


let myAllTagsCache
export function fetchAllTags() {
  return useLazyAsyncData('alltagsKey', async () => {
    if (online) {
      myTagsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/get-private-tags-flat-list")
      return { tags: unflatten(myTagsCache), flatTags: myTagsCache }
    } else {
      return myTagsCache = { tags: unflatten(myPrivateTags), flatTags: myPrivateTags }
    }
  },
    {
      getCachedData() {
        return myAllTagsCache
      }
    }
  )
}