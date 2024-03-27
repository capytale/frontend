import { resolve } from 'path';

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt3-localforage',
  ],
  primevue: {
    usePrimeVue: true
  },
  css: ['primevue/resources/themes/aura-light-green/theme.css', 'primeicons/primeicons.css'],
    nitro: {
    devProxy: {
      '/vanilla': { target: 'https://capytaledev.ac-paris.fr/vanilla', changeOrigin: false, secure: false },
      '/p': { target: 'https://capytaledev.ac-paris.fr/p', changeOrigin: false, secure: false },
      '/web': { target: 'https://capytaledev.ac-paris.fr/web', changeOrigin: false, secure: false },
    },
  },
  devServer:{
    https: {
      key: resolve(process.env.HOME!, 'repos/virtual.ac-capytale.fr.key'),
      cert: resolve(process.env.HOME!, 'repos/virtual.ac-capytale.fr.crt')
    }
  }
})
