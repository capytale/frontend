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
  if (!['i'].includes(event.target.tagName.toLowerCase()))
    window.location.href = `/web/node/add/${props.activite.bundle}?type=${props.activite.id}`;
};
</script>

<template>
  <Card class="cursor-pointer hover:shadow-md" :dt="{ 'body.padding': '1.5rem 1.5rem 0.5rem 1.5rem' }" :pt="{ body: 'pc-body' }">
    <template #content>
      <div class="flex flex-row gap-4 justify-start items-center w-full" @click="(event) => goActi(event, 'coucou')">
        <img :src="activite.icon.path" class="w-24" />
        <div>
          <div class="text-lg font-semibold">
            {{ activite.name }} <sup v-if="activite.beta" class="text-red-500">beta</sup>
          <i :class="'mx-2 text-lg cursor-pointer starspin star ' + star.icon" @click="toggleFav()"
            v-tooltip.top="{ value: star.tt, showDelay: 300, hideDelay: 0 }" />
          </div>
          <div class="text-base">{{ activite.description }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row justify-end gap-2 mt-2">
        <Button :icon="star.icon" label="Favoris" severity="secondary" @click="toggleFav()" />
        <Button as="a" label="Aide" :href="activite.helpUrl" severity="secondary" />
        <Button as="a" label="Créer" :href="`/web/node/add/${props.activite.bundle}?type=${props.activite.id}`" severity="primary" />
      </div>
    </template>
  </Card>
</template>

<style>
.starspin:hover {
  border-radius: 2em;
  border: 1px solid #facc15;
  padding: 0.7em;
}

.star {
  padding: 0.7em;
}

.pc-body {
  height: 100%;
  justify-content: space-between;
}
</style>
