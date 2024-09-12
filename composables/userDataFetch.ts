import httpClient from '@capytale/activity.js/backend/capytale/http'

let currentUserCache: { property: object }
export function fetchCurrentUser() {
  return useLazyAsyncData('currUserKey', async () => {
    return currentUserCache = await httpClient.getJsonAsync<any>("/web/c-auth/api/me")
  },
    {
      getCachedData() {
        return currentUserCache
      }
    }
  )
}
