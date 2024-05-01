<script setup>
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";
const props = defineProps({
  activite: Object,
  disp: String,
});

const toast = useToast();
const fav = useState("actiFav");

const star = computed(() => {
  if (fav.value.includes(props.activite.id)) {
    return {
      icon: "i-heroicons-star-solid",
      color: "text-yellow-400",
    };
  } else {
    return {
      icon: "i-heroicons-star",
      color: "",
    };
  }
});

const toggleFav = async () => {
  if (fav.value.includes(props.activite.id)) {
    fav.value = await TypeApi.removeFavorite(props.activite.id);
    toast.add({ title: "L'élément a été retiré des favoris." });
  } else {
    fav.value = await TypeApi.addFavorite(props.activite.id);
    toast.add({ title: "L'élément a été ajouté aux favoris." });
  }
};

const goActi = (event, msg) => {
  console.log(msg);
  // if (!event.target.classList.contains("starspin")) {
  //   appState.value.creaActiPanel = true;
  //   appState.value.newActiPanel = false;
  //   toast.add({
  //     description: "Création d'une nouvelle activité",
  //     title: props.activite.fullName,
  //   });
  // }
  if (!event.target.classList.contains("starspin"))
    window.location.href = "/web/node/add/activity?type=" + props.activite.id;
};
</script>

<template>
  <UCard
    :ui="{ body: { base: 'py-2 sm:py-2 flex flex-col' } }"
    class="cursor-pointer hover:shadow-md"
    @click="(event) => goActi(event, 'coucou')"
    v-if="disp == 'desc'"
  >
    <template #header>
      <div class="flex flex-row justify-between items-center w-full">
        <img
          :src="'https://capytale2.ac-paris.fr'.concat(activite.icon.path)"
          class="w-16"
        />
        <div class="text-lg font-semibold ml-2 grow">
          {{ activite.name }} <sup v-if="activite.beta" class="text-red-500">beta</sup>
          {{ activite.score }}
        </div>
        <UIcon
          @click="toggleFav()"
          :name="star.icon"
          class="mx-2 text-lg cursor-pointer starspin"
          :class="star.color"
        ></UIcon>
      </div>
    </template>

    <div class="text-sm">{{ activite.description }}</div>
  </UCard>

  <UCard
    :ui="{
      ring: 'ring-0',
      shadow: 'shadow-none',
      body: { base: 'py-2 px-0 sm:py-2 sm:px-0 flex flex-col items-center' },
    }"
    class="cursor-pointer hover:shadow-md"
    @click="(event) => goActi(event, 'coucou')"
    v-else
  >
    <img :src="'https://capytale2.ac-paris.fr'.concat(activite.icon.path)" class="w-16" />
    <div class="text-sm">
      {{ activite.name.replace("Robot", "").replace("Carte", "").replace("Pi ", "") }}
    </div>
  </UCard>
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
