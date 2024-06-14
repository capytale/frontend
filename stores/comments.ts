import httpClient from '@capytale/activity.js/backend/capytale/http'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: []
  }),
  actions: {
    async getComments() {
      this.comments = await httpClient.getJsonAsync<any>("/web/c-hdls/api/comments/36192")
    },
  },
})