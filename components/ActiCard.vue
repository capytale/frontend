<script setup>
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";
const props = defineProps({
  activite: Object,
});
import { useToast } from "primevue/usetoast";

const toast = useToast();
const myStore = useMyStore();

const star = computed(() => {
  if (myStore.favorites.includes(props.activite.id)) {
    return {
      icon: "pi pi-star-fill text-yellow-400",
    };
  } else {
    return {
      icon: "pi pi-star",
    };
  }
});

const toggleFav = async () => {

  if (myStore.favorites.includes(props.activite.id)) {
    myStore.favorites = await TypeApi.removeFavorite(props.activite.id);
    toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
  } else {
    myStore.favorites = await TypeApi.addFavorite(props.activite.id);
    toast.add({ severity: 'success', summary: 'Ajout effectué : ', life: 2000 });
  }
};

const goActi = (event, msg) => {
  console.log(event.target.tagName);
  // if (!event.target.classList.contains("starspin")) {
  //   appState.value.creaActiPanel = true;
  //   appState.value.newActiPanel = false;
  //   toast.add({
  //     description: "Création d'une nouvelle activité",
  //     title: props.activite.fullName,
  //   });
  // }
  if (!['svg', 'path'].includes(event.target.tagName))
    window.location.href = `/web/node/add/${props.activite.bundle}?type=${props.activite.id}`;
};
</script>

<template>
  <Card
    class="cursor-pointer hover:shadow-md"
    @click="(event) => goActi(event, 'coucou')"
  >
    <template #title>
      <div class="flex flex-row justify-between items-center w-full">
        <img
          :src="activite.icon.path"
          class="w-16"
        />
        <div class="text-lg font-semibold ml-2 grow">
          {{ activite.name }} <sup v-if="activite.beta" class="text-red-500">beta</sup>
        </div>
        <i :class="'mx-2 text-lg cursor-pointer starspin '+star.icon" @click="toggleFav()"></i>
      </div>
    </template>
    <template #content>
      <div class="text-sm">{{ activite.description }}</div>
    </template>
  </Card>
</template>

<style>
.starspin:hover {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) 1;

  @keyframes ping {
    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1.1);
    }
  }
}
</style>
