import httpClient from '@capytale/activity.js/backend/capytale/http'

export const useLocalStore = defineStore('local', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getAsyncData() {
      this.data = await httpClient.getJsonAsync<any>("/web/my_json_data")
    },
  }
})
