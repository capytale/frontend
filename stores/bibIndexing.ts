import { defineStore } from 'pinia'
import httpClient from '@capytale/activity.js/backend/capytale/http'
//import localforage from 'localforage'

export const useBibIndexingStore = defineStore('bibIndexing', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getIndexingElements() {
      this.data = await httpClient.getJsonAsync<any>("/web/c-ui/api/my-bib-form-indexing-elements")
    },
  }
})
