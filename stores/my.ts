import httpClient from '@capytale/activity.js/backend/capytale/http'

const myActivitiesApiEp = "/web/c-ui/api/my-activities"

export const useMyStore = defineStore('my', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async deleteActivity(nid: number) {
      return httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "delete", nid }
      );
    },
    async cloneActivity(nid: number) {
      return httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "clone", nid }
      );
    },
  }
})
