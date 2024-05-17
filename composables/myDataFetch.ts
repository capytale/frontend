import httpClient from '@capytale/activity.js/backend/capytale/http'

let myActivitiesCache: { property: object }
export function fetchMyActivities() {
  return useAsyncData('activKey', async () => {
    return myActivitiesCache = await httpClient.getJsonAsync<any>("/web/my_json_data")
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
    myTagsCache = await httpClient.getJsonAsync<any>("/web/c-ui/api/my-private-tags")
    return unflatten(myTagsCache)
  },
    {
      getCachedData() {
        return myTagsCache
      }
    }
  )
}
