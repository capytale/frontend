import httpClient from '@capytale/activity.js/backend/capytale/http'
import { online } from '@/constants'
// import { myBibFormIndexingElements } from '@/mockup_data/my-bib-form-indexing-elements'

let bibDataCache
export function fetchBibData() {
  return useAsyncData('bibData', async () => {
    if (online) {
      bibDataCache = await httpClient.getJsonAsync<any>("web//c-hdls/api/bib")
      bibDataCache.themes = unflatten(bibDataCache.themes)
      return bibDataCache
    } else {
      myBibFormIndexingElements.themes = unflatten(myBibFormIndexingElements.themes)
      return myBibFormIndexingElements
    }
  },
    {
      getCachedData() {
        return bibDataCache
      }
    }
  )
}

