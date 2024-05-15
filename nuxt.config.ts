import { resolve } from 'path';

const baseUrl = '/~';

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['nuxt-primevue', '@pinia/nuxt', "@nuxt/ui", '@vueuse/nuxt', "@nuxtjs/tailwindcss", 'nuxt-icon'],
  primevue: {
    usePrimeVue: true,
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
  },
  css: [
    //'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
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
    head: {
      link: [
        {
          id: 'theme-link',
          rel: 'stylesheet',
          href: baseUrl + 'themes/lara-light-blue/theme.css'
          //href: '/' + 'themes/lara-light-blue/theme.css'
        }
      ]
    }
  }
})
