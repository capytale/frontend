import { defineStore } from 'pinia'
import localforage from 'localforage'

export const useLocalStore = defineStore('local', {
  state: () => ({
    data: [{}],
    timestamp: Date.now(),
  }),
  actions: {
    async getAsyncData() {
      const k = await localforage.keys();
      if (k.includes('data')) {
        // console.log('On a des données locales, on les récupère')
        localforage.getItem('data').then((data) => {
          this.data = data
        });
      } else {
        // console.log('Pas de données locales, on va chercher sur le serveur')
        fetch("/web/my_json_data")
          .then(r => r.json())
          .then(json => {
            console.log(json);
            this.data = json
            localforage.setItem('data', json)
          });
      }
    },
    async clear() {
      // console.log('clear')
      localforage.clear()
    },
  }
})
