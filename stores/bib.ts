import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useBibStore = defineStore('bib', {
  state: () => ({
    bib: [],
  }),
  actions: {
    async getBib() {
      this.bib = await fetchBibData()
    },
  },
})
