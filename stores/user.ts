import httpClient from '@capytale/activity.js/backend/capytale/http'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  actions: {
    async getUser() {
      this.user = await fetchCurrentUser()
    },
  },
})