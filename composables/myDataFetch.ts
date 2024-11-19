import httpClient from '@capytale/activity.js/backend/capytale/http'
import type { Activity } from '~/types/activities'
import type { Tag } from '~/types/tags'

// let myActivitiesCache: { property: object }
// renvoie {data, pending, error, status}
let myActivitiesCache: Activity[] | null
export function fetchMyActivities() {
  return useLazyAsyncData('activKey', async () => {
    return myActivitiesCache = await httpClient.getJsonAsync<Activity[]>("/web/c-hdls/api/all-activities")
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
