import { resolve } from 'path';
import Lara from '@primevue/themes/aura';
const baseUrl = '/~';

export default defineNuxtConfig({
  ssr: false,
  // devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@nuxtjs/color-mode', '@pinia/nuxt', '@vueuse/nuxt', "@nuxtjs/tailwindcss", '@vesp/nuxt-fontawesome'],
  colorMode: {
    classSuffix: '',
    preference: 'light', // default value of $colorMode.preference
  },
  primevue: {
    usePrimeVue: true,
    options: {
      theme: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities'
        },
        preset: Lara,
        options: {
          darkModeSelector: '.dark',
        }
      }

    },
  },
  css: [
    'primeicons/primeicons.css',
    'assets/css/tailwind.css'
  ],
  fontawesome: {
    icons: {
      solid: ['balance-scale', 'glasses', 'lightbulb', 'recycle', 'bullseye', 'spell-check', 'medal', 'ban'],
      // regular: ['thumbs-up', 'thumbs-down'],
    }
  },
  nitro: {
    devProxy: {
      '/vanilla': { target: 'https://capytaledev.ac-paris.fr/vanilla', changeOrigin: false, secure: false },
      '/p': { target: 'https://capytaledev.ac-paris.fr/p', changeOrigin: false, secure: false },
      '/web': { target: 'https://capytaledev.ac-paris.fr/web', changeOrigin: false, secure: false },
    },
  },
  devServer: {
    https: {
      key: resolve(process.env.HOME!, 'repos/virtual.ac-capytale.fr.key'),
      cert: resolve(process.env.HOME!, 'repos/virtual.ac-capytale.fr.crt')
    }
  },
  app: {
    baseURL: baseUrl,
    // head: {
    //   link: [
    //     {
    //       id: 'theme-link',
    //       rel: 'stylesheet',
    //       href: baseUrl + 'themes/lara-light-blue/theme.css'
    //       //href: '/' + 'themes/lara-light-blue/theme.css'
    //     }
    //   ]
    // }
  }
})