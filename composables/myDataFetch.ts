import httpClient from '@capytale/activity.js/backend/capytale/http'

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


let myTagsCache
export function fetchTags() {
  return useLazyAsyncData('tagsKey', async () => {
    myTagsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/get-private-tags-flat-list")
    return unflatten(myTagsCache)
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
    myFlatTagsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/get-private-tags-flat-list")
    return myFlatTagsCache
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
    myTagsCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/get-private-tags-flat-list")
    return { tags: unflatten(myTagsCache), flatTags: myTagsCache }
  },
    {
      getCachedData() {
        return myAllTagsCache
      }
    }
  )
}
