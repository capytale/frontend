import httpClient from '@capytale/activity.js/backend/capytale/http'

export const useUserStore = defineStore('user', {
  state: () => ({
    data: {},
  }),
  actions: {
    async getAsyncUser() {
      this.data = await httpClient.getJsonAsync<any>("/web/c-auth/api/me")
    }
  }
})
