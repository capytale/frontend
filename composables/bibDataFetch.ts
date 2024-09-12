import httpClient from '@capytale/activity.js/backend/capytale/http'

let bibDataCache: { property: object }
// renvoie {data, pending, error, status}
export function fetchBibData() {
  return useAsyncData('bibData', async () => {
    return bibDataCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/bib")
  },
    {
      getCachedData() {
        return bibDataCache
      }
    }
  )
}
