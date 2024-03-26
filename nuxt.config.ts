// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  // experimental: {
  //   renderJsonPayloads: true,
  // },
  css: ['primevue/resources/themes/aura-light-green/theme.css', 'primeicons/primeicons.css']
  // css: ['primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css', '@/assets/styles.scss']
})
