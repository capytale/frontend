import { defineStore } from 'pinia'
//import localforage from 'localforage'

export const useModulesStore = defineStore('modules', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getModules() {
      fetch("/web/c-api/modules_rest?_format=json")
        .then(r => r.json())
        .then(json => {
          // console.log(json);
          this.data = json
        });
    },
  }
})
