import { defineStore } from 'pinia'

export const useSideMenuStore = defineStore('sideMenu', {
  state: () => ({ visible: true }),
  actions: {
    toggle() {
      this.visible = !this.visible;
    },
  },
})

export const useCodeStore = defineStore('code', {
  state: () => ({ visible: false}),
  actions: {
    toggle() {
      this.visible = !this.visible;
    },
  },
})
