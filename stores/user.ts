import { defineStore } from 'pinia'
import localforage from 'localforage'

export const useUserStore = defineStore('user', {
  state: () => ({
    data: {},
  }),
  actions: {
    async getAsyncUser() {
      fetch("/web/c-auth/api/me")
        .then(r => r.json())
        .then(json => {
          // console.log(json);
          this.data = json
        });
    }
  }
})
