import httpClient from '@capytale/activity.js/backend/capytale/http'
import type { Tag } from '~/types/tags'

let myActivitiesCache: { property: object }
// renvoie {data, pending, error, status}
export function fetchMyActivities() {
  return useLazyAsyncData('activKey', async () => {
    return myActivitiesCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/all-activities")
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
  return useAsyncData('assignKey' + nid, async () => {
    return assignmentsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/assignments/" + nid)
  },
    {
      getCachedData() {
        return assignmentsCache
      }
    }
  )
}




let myAllTagsCache: { tags: Tag[], flatTags: Tag[] }
export function fetchAllTags() {
  return useLazyAsyncData('alltagsKey', async () => {
    const dt = (await httpClient.getJsonAsync<Tag[]>("/web/c-hdls/api/get-private-tags-flat-list"))!
    myAllTagsCache = { tags: unflatten(dt), flatTags: dt }
    return myAllTagsCache
  },
    {
      getCachedData() {
        return myAllTagsCache
      }
    }
  )
}
