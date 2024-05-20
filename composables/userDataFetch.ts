import httpClient from '@capytale/activity.js/backend/capytale/http'
import { online } from '@/constants'
import { me } from '@/mockup_data/me';

let currentUserCache: { property: object }
export function fetchCurrentUser() {
  return useAsyncData('currUserKey', async () => {
    if (online) {
      return currentUserCache = await httpClient.getJsonAsync<any>("/web/c-auth/api/me")
    } else {
      return currentUserCache = me
    }
  },
    {
      getCachedData() {
        return currentUserCache
      }
    }
  )
}
