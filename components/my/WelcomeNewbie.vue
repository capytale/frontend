<script setup>
const props = defineProps({
  isTeacher: Boolean,
})


import { ref } from "vue";

const events = ref([
  { status: '1. Créer une activité', 
    icon: 'pi pi-sparkles', 
    color: '#327BB8', 
    float: 'left', 
    img: 'media/etape1.png', 
    content: 'Vous pouvez consulter la bibliothèque pour réutiliser une activité partagée ou en créer une nouvelle parmi celles disponibles : Python, GeoGebra, Scratch ou MathAléa mais aussi MicroBit, Arduino ou programmation de robots.'
  },
  { status: '2. Distribuer à la classe', 
    icon: 'pi pi-users', 
    color: '#F46036', 
    float: 'left', 
    img: 'media/etape2.png', 
    content: "Votre activité possède un code de partage que vous donnez aux élève pour leur permettre de créer des copies à partir de votre activité." 
  },
  { status: '3. Évaluer les travaux', 
    icon: 'pi pi-check-circle',
    color: '#22c55e', 
    float: 'left', 
    // img: 'https://cdn.ac-paris.fr/capytale/media/4_3_qualite28_GeoGebra.png', 
    img: 'media/etape3.png', 
    content: "Vous consultez et évaluez les copies de vos élèves qui arrivent automatiquement." 
  },
]);

</script>

<template>
  <template v-if="props.isTeacher">
    <h1>Bienvenue sur Capytale</h1>

    <p class="mt-8 mb-10">
    </p>

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
        <img :src="slotProps.item.img" :class="'cropped-image mt-6 ' + slotProps.item.float">
      </template>
    </Timeline>
    <p>
      Pour commencer, vous pouvez créer une nouvelle activité ci-dessus ou bien consulter la bibliothèque d'activités
      partagées entre enseignants.
    </p>


  </template>
  <template v-else>
    Welcome newbie student !
  </template>
</template>


<style scoped>
.cropped-image {
  /* width: 80%; */
  /* height: 150px; */
  border-radius: 10px;
  /* object-fit: cover; */
  /* object-position: 0% 0%; */
  /* border: 0px solid black; */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.right {
  float: right;
}

.left {
  float: left;
}
</style>

