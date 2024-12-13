<template>
  <div ref="carousel" class="lg:grid lg:grid-cols-3 lg:grid-rows-none lg:gap-4 flex flex-col items-center w-full mb-32"
    v-if="carouItems && carouItems.length > 0">
    <Card class="lg:col-span-2 order-2 lg:self-start mt-2 min-h-[700px]" ref="vidCard">
      <template #title>
        <p class="text-lg font-semibold">{{ carouItems[acti].name }}</p>
        {{ carouItems[acti].description }}
      </template>
      <template #content>
        <video class="mavideo" controls autoplay :src="'https://cdn.ac-paris.fr/capytale/media/4_3_qualite28_' +
          videos[acti % 7] +
          '.mp4'
          " type="video/mp4" v-if="smAL" />
        <img :src="'https://cdn.ac-paris.fr/capytale/media/4_3_qualite28_' +
          videos[acti % 7] +
          '.png'
          " v-else />
      </template>
    </Card>

    <div
      class="px-0 mb-4 pt-2 lg:mb-0 order-1 lg:order-2 flex flex-row sm:justify-center flex-nowrap lg:flex-col overflow-x-scroll lg:overflow-y-auto w-full"
      :style="lgAL ? 'height: ' + vidH.height.value + 'px' : ''" ref="scrolly">
      <Card ref="itemRefs" v-for="(activite, index) of carouItems"
        class="p-2 lg:p-1 box-border m-1 first:mt-0 last:mb-0 lg:basis-full cursor-pointer flex flex-row justify-center items-center itemcard"
        :class="acti == index ? 'selectedCard' : ''" @click="acti = index">
        <template #content>
          <p class="whitespace-nowrap font-semibold">{{ activite.name }}</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const carousel = ref();
const { isOutside } = useMouseInElement(carousel);

const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAL = breakpoints.greaterOrEqual("lg");
const smAL = breakpoints.greaterOrEqual("sm");
const vidCard = ref();
const vidH = useElementBounding(vidCard);

const acti = ref(0);
const loop = ref(true);
setInterval(() => {
  if (isOutside.value) {
    if (acti.value < carouItems.length - 1) {
      acti.value++;
    } else acti.value = 0;
  }
}, 5000);


const videos = [
  "Codabloc",
  "ConsolePython",
  "GeoGebra",
  "MicroBit",
  "NotebookPython",
  "PixelArt",
  "PyxelStudio",
];

const carouItems = [
  {
    id: "codabloc",
    name: "Codabloc",
    description:
      "L'environnement Scratch intégré dans Capytale pour apprendre à programmer avec des blocs.",
    summary:
      "L'environnement Scratch intégré dans Capytale pour apprendre à programmer avec des blocs.",
  },
  {
    id: "console.python3",
    name: "Script-Console",
    description:
      "L'environnement classique de programmation : un script Python à gauche et une console d'exécution à droite.",
    summary:
      "L'environnement classique de programmation : un script Python à gauche et une console d'exécution à droite.",
  },
  {
    id: "geogebra",
    name: "GeoGebra",
    description:
      "Géométrie dynamique avec Geogebra enrichi des fonctionnalités pédagogiques de Capytale.",
    summary:
      "Géométrie dynamique avec Geogebra enrichi des fonctionnalités pédagogiques de Capytale.",
  },
  {
    id: "lti.vs.microbit",
    name: "Carte Microbit",
    description:
      "Programmation de la carte Microbit avec le module Vittascience intégré dans Capytale.",
    summary:
      "Programmation de la carte Microbit avec le module Vittascience intégré dans Capytale.",
  },
  {
    id: "notebook.python3",
    name: "Notebook Python",
    description:
      "Python dans un notebook Jupyter : une alternance de cellules de texte riche et de cellules de code exécutables.",
    summary:
      "Python dans un notebook Jupyter : une alternance de cellules de texte riche et de cellules de code exécutables.",
  },
  {
    id: "pixel",
    name: "Pixel Art",
    description: "Construire un dessin pixelisé avec des blocs de code.",
    summary: "Construire un dessin pixelisé avec des blocs de code.",
  },
  {
    id: "pyxelstudio",
    name: "Pyxel Studio",
    description:
      "Studio de création de jeux et d'applications avec le moteur de jeu Pyxel.",
    summary: "Studio de création de jeux et d'applications avec le moteur de jeu Pyxel.",
  },
];
</script>

<style lang="scss" scoped>
.dark .itemcard:hover {
  background-color: var(--p-surface-700);
}

.itemcard:hover {
  background-color: var(--p-surface-100);
}

.dark .itemcard {
  border: 1px solid var(--p-surface-700);
}

.selectedCard {
  border: 1px solid var(--p-primary-500);
}

.dark .selectedCard {
  border: 1px solid var(--p-primary-500);
}

.mavideo {
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>
