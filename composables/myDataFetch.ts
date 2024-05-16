import httpClient from '@capytale/activity.js/backend/capytale/http'

let myActivitiesCache: { property: object }

export function fetchMyActivities() {
  return useAsyncData('activities', async () => {
    return myActivitiesCache = await httpClient.getJsonAsync<any>("/web/my_json_data")
  },
    {
      getCachedData() {
        return myActivitiesCache
      }
    }
  )
}

