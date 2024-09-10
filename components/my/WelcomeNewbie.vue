<script setup>
const props = defineProps({
  isTeacher: Boolean,
})


import { ref } from "vue";

const events = ref([
    { status: '1. Créer une activité', icon: 'pi pi-sparkles', color: '#327BB8', content: 'Vous pouvez consulter la bibliothèque pour réutiliser une activité partagée ou en créer une nouvelle en cliquant dans la liste présentée ci-dessus.'},
    { status: '2. Distribuer à la classe', icon: 'pi pi-users', color: '#F46036', content: "Votre activité possède un code de partage que vous donnez aux élève pour leur permettre de créer des copies à partir de votre activité." },
    { status: '3. Évaluer les travaux', icon: 'pi pi-check-circle', color: '#22c55e', content: "Vous consultez et évaluez les copies de vos élèves qui arrivent automatiquement." },
]);

</script>

<template>
  <template v-if="props.isTeacher">
    <h1>Bienvenue sur Capytale</h1>
    <h2>le service de partage d'activités de sciences et de codage !</h2>

    <h3>
      Vous n'avez pas encore d'activité.
    </h3>

    <Timeline :value="events" align="alternate" class="customized-timeline">
            <template #marker="slotProps">
                <span class="flex w-12 h-12 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: slotProps.item.color }">
                    <i :class="slotProps.item.icon"></i>
                </span>
            </template>
            <template #content="slotProps">
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
