import { defineStore } from 'pinia'
import localforage from 'localforage'

export const useLocalStore = defineStore('local', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getAsyncData() {
      fetch("/web/my_json_data")
        .then(r => r.json())
        .then(json => {
          // console.log(json);
          this.data = json
        });
    },
  }
})
