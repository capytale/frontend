import { defineStore } from 'pinia'
import localforage from 'localforage'

const initData = [{}]
const localData = [
  { icon: "🔥", title: "Le feu", code: "abcd", update: "2021-08-14" },
  { icon: "✨", title: "Les étoiles", code: "efGH", update: "2021-09-14" }
]
const fetchedData = [
  ...localData,
  { icon: "🚀", title: "La fusée", code: "ijKl", update: "2021-10-14" },
  { icon: "⏰", title: "Le réveil", code: "MnOp", update: "2021-11-14" }
]

export const useLocalStore = defineStore('local', {
  state: () => ({
    data: initData,
    timestamp: Date.now(),
  }),
  actions: {
    async getAsyncData() {
      console.log('fonction Async')
      const k = await localforage.keys();
      if (k.includes('data')) {
        console.log('A')
        this.data = localData
      } else {
        console.log('B')
        this.data = fetchedData
      }
    },
    async clear() {
      console.log('clear')
      localforage.clear()
      this.getAsyncData()
    },
    async saveStorage() {
      console.log('saveStorage')
      localforage.setItem('data', localData)
      this.getAsyncData()
    }
  }
})
