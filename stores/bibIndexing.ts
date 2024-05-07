import { defineStore } from 'pinia'
//import localforage from 'localforage'

export const useBibIndexingStore = defineStore('bibIndexing', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getIndexingElements() {
      fetch("/web/c-ui/api/my-bib-form-indexing-elements")
        .then(r => r.json())
        .then(json => {
          // console.log(json);
          this.data = json
        });
    },
  }
})
