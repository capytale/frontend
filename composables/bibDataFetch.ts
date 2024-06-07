import httpClient from '@capytale/activity.js/backend/capytale/http'
import { online } from '@/constants'
// import { myBibFormIndexingElements } from '@/mockup_data/my-bib-form-indexing-elements'

let bibDataCache: { property: object }
// renvoie {data, pending, error, status}
export function fetchBibData() {
  return useAsyncData('bibData', async () => {
    if (online) {
      return bibDataCache = await httpClient.getJsonAsync<any>("/web/c-hdls/api/bib")
    } else {
      // myBibFormIndexingElements.themes = unflatten(myBibFormIndexingElements.themes)
      return null
    }
  },
    {
      getCachedData() {
        return bibDataCache
      }
    }
  )
}