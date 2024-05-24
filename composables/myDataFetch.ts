import httpClient from '@capytale/activity.js/backend/capytale/http'
import { online } from '@/constants'
import { myJsonData } from '@/mockup_data/my_json_data'
import { myPrivateTags } from '@/mockup_data/my-private-tags'

let myActivitiesCache: { property: object }
// renvoie {data, pending, error, status}
export function fetchMyActivities() {
  return useAsyncData('activKey', async () => {
    if (online) {
      return myActivitiesCache = await httpClient.getJsonAsync<any>("/web/my_json_data")
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


let myTagsCache
export function fetchTags() {
  return useAsyncData('tagsKey', async () => {
    if (online) {
      myTagsCache = await httpClient.getJsonAsync<any>("/web/c-ui/api/my-private-tags")
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
  return useAsyncData('flatTagsKey', async () => {
    if (online) {
      myFlatTagsCache = await httpClient.getJsonAsync<any>("/web/c-ui/api/my-private-tags")
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
