import { defineStore } from 'pinia'
//import localforage from 'localforage'

export const useThemesStore = defineStore('themes', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getThemes() {
      fetch("/web/c-api/themes_rest?_format=json")
        .then(r => r.json())
        .then(json => {
          // console.log(json);
          this.data = json
        });
    },
  }
})
