import { defineStore } from 'pinia'
import { usePrimeVue } from 'primevue/config';

// const primevue = usePrimeVue();

export const useSideMenuStore = defineStore('sideMenu', {
  state: () => ({ visible: true }),
  actions: {
    toggle() {
      this.visible = !this.visible;
    },
  },
})

function MaverickchangeTheme(currentTheme, newTheme, linkElementId, callback) {
    var _linkElement$parentNo;
    var linkElement = document.getElementById(linkElementId);
    var cloneLinkElement = linkElement.cloneNode(true);
    var newThemeUrl = linkElement.getAttribute("href").replace(currentTheme, newTheme);
    cloneLinkElement.setAttribute("id", linkElementId + "-clone");
    cloneLinkElement.setAttribute("href", newThemeUrl);
    cloneLinkElement.addEventListener("load", function() {
      linkElement.remove();
      cloneLinkElement.setAttribute("id", linkElementId);
      if (callback) {
        callback();
      }
    });
    (_linkElement$parentNo = linkElement.parentNode) === null || _linkElement$parentNo === void 0 || _linkElement$parentNo.insertBefore(cloneLinkElement, linkElement.nextSibling);
  };

export const useThemeStore = defineStore('theme', {
  state: () => ({ current: "light" }),
  actions: {
    toggle() {
      const newTheme = this.current === "light" ? "dark" : "light"
      MaverickchangeTheme(this.current, newTheme, 'theme-link')
      this.current = newTheme 
    },
  },
})

export const useCodeStore = defineStore('code', {
  state: () => ({ visible: false }),
  actions: {
    toggle() {
      this.visible = !this.visible;
    },
  },
})
