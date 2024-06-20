import httpClient from '@capytale/activity.js/backend/capytale/http'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  actions: {
    async getUser() {
      if (Object.keys(this.user).length == 0) this.user = await fetchCurrentUser()

    },
  },
})