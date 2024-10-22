<script setup>

import { ref } from "vue";

const events = ref([
  {
    status: '1. Créer une activité',
    icon: 'pi pi-sparkles',
    color: '#327BB8',
    img: 'media/etape1.png',
    content: 'Vous pouvez consulter la bibliothèque pour réutiliser une activité partagée ou en créer une nouvelle parmi celles disponibles : Python, GeoGebra, Scratch ou MathAléa mais aussi MicroBit, Arduino ou programmation de robots.'
  },
  {
    status: '2. Distribuer à la classe',
    icon: 'pi pi-users',
    color: '#F46036',
    img: 'media/etape2.png',
    content: "Votre activité possède un code de partage que vous donnez aux élève pour leur permettre de créer des copies à partir de votre activité."
  },
  {
    status: '3. Évaluer les travaux',
    icon: 'pi pi-check-circle',
    color: '#22c55e',
    img: 'media/etape3.png',
    content: "Vous consultez et évaluez les copies de vos élèves qui arrivent automatiquement."
  },
]);

const publicUrl = usePublicUrl();

</script>

<template>
  <Timeline :value="events" class="customized-timeline">
    <template #marker="slotProps">
      <span class="flex w-12 h-12 items-center justify-center text-white rounded-full z-10 shadow-sm"
        :style="{ backgroundColor: slotProps.item.color }">
        <i :class="slotProps.item.icon"></i>
      </span>
    </template>
    <template #opposite="slotProps">
      <Card class="mt-4">
        <template #title>
          {{ slotProps.item.status }}
        </template>
        <template #content>
          <p>
            {{ slotProps.item.content }}

          </p>
        </template>
      </Card>
    </template>
    <template #content="slotProps">
      <img :src="publicUrl(slotProps.item.img)" class="image mt-6 mb-4">
      <img :src="null" class="image mt-6 mb-4">
    </template>
  </Timeline>
</template>
