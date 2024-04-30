import { defineStore } from 'pinia'
import csrfBck from '@capytale/activity.js/backend/capytale/csrf'

export const useMyStore = defineStore('my', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async deleteActivity(nid: number) {
      const headers = await csrfBck.addCsrfHeadersAsync() as HeadersInit
      return fetch(
        "/web/c-ui/api/my-activities",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ action: "delete", nid })
        }
      )
    },
    async cloneActivity(nid: number) {
      const headers = await csrfBck.addCsrfHeadersAsync() as HeadersInit
      return fetch(
        "/web/c-ui/api/my-activities",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ action: "clone", nid })
        }
      )
    },
  }
})
