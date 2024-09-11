import { resolve } from 'path';
import Lara from '@primevue/themes/lara';
import { definePreset } from '@primevue/themes';

const capyPreset = definePreset(Lara, {
  primitive: {
    capycolor: {'50': '#f3f7fc','100': '#e5eef9','200': '#c6dcf1','300': '#93bfe6','400': '#5a9ed6','500': '#327bb8','600': '#2567a4','700': '#1f5285','800': '#1d466f','900': '#1d3c5d','950': '#14273d' }
  },
  semantic: {
    primary: {
      50: '{emerald.50}',
      100: '{capycolor.100}',
      200: '{capycolor.200}',
      300: '{capycolor.300}',
      400: '{capycolor.400}',
      500: '{capycolor.500}',
      600: '{capycolor.600}',
      700: '{capycolor.700}',
      800: '{capycolor.800}',
      900: '{capycolor.900}',
      950: '{capycolor.950}'
    },
  },
  components: {
    card: {
      colorScheme: {
        light: {
          shadow: '0 1px 3px 0 var(--p-surface-300), 0 1px 2px -1px var(--p-surface-300)',
        },
        dark: {
          shadow: '0 1px 3px 0 var(--p-surface-800), 0 1px 2px -1px var(--p-surface-800)',
        }
      }
    }
  }
});

const baseUrl = '/coucou';

export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: true },
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
        preset: capyPreset,
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
      solid: ['balance-scale', 'glasses', 'lightbulb', 'recycle', 'bullseye', 'spell-check', 'medal', 'ban', 'moon', 'sun'],
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
    publicPath: baseUrl,
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
  },

  compatibilityDate: '2024-08-26'
})
