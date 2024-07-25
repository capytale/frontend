<script setup>
const props = defineProps({
  activite: Object,
});
// import { useToast } from "primevue/usetoast";
// const toast = useToast();

const myStore = useMyStore();

const star = computed(() => {
  if (myStore.favorites.includes(props.activite.id)) {
    return {
      icon: "pi pi-star-fill text-yellow-400",
      tt: "Supprimer des favoris"
    };
  } else {
    return {
      icon: "pi pi-star",
      tt: "Ajouter aux favoris",
    };
  }
});

const toggleFav = async () => {

  if (myStore.favorites.includes(props.activite.id)) {
    await myStore.removeFavorite(props.activite.id);
    // toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
  } else {
    await myStore.addFavorite(props.activite.id);
    // toast.add({ severity: 'success', summary: 'Ajout effectué : ', life: 2000 });
  }
};

const goActi = (event, msg) => {
  // console.log(event.target.tagName);
  // if (!event.target.classList.contains("starspin")) {
  //   appState.value.creaActiPanel = true;
  //   appState.value.newActiPanel = false;
  //   toast.add({
  //     description: "Création d'une nouvelle activité",
  //     title: props.activite.fullName,
  //   });
  // }
  if (!['i'].includes(event.target.tagName.toLowerCase()))
    window.location.href = `/web/node/add/${props.activite.bundle}?type=${props.activite.id}`;
};
</script>

<template>
  <Card class="cursor-pointer hover:shadow-md" @click="(event) => goActi(event, 'coucou')">
    <template #title>
      <div class="flex flex-row justify-between items-center w-full">
        <img :src="activite.icon.path" class="w-16" />
        <div class="text-lg font-semibold ml-2 grow">
          {{ activite.name }} <sup v-if="activite.beta" class="text-red-500">beta</sup>
        </div>
        <i :class="'mx-2 text-lg cursor-pointer starspin star ' + star.icon" @click="toggleFav()"
          v-tooltip.top="{ value: star.tt, showDelay: 300, hideDelay: 0 }"></i>
      </div>
    </template>
    <template #content>
      <div class="text-sm">{{ activite.description }}</div>
    </template>
  </Card>
</template>

<style>
.starspin:hover {
  border-radius: 2em;
  border: 1px solid #facc15;
  padding: 0.7em;

  /* animation: ping 1s cubic-bezier(0, 0, 0.2, 1) 1; */

  /* @keyframes ping { */
  /*   50% { */
  /*     transform: scale(0.5); */
  /*   } */

  /*   100% { */
  /*     transform: scale(2.1); */
  /*   } */
}

.star {
  padding: 0.7em;
}
</style>
