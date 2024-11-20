<script setup lang="ts">
import { useActivityTypesList } from "~/stores/activityTypes/list";
import { useActivityTypeFavorites } from "~/stores/activityTypes/favorites";

const props = defineProps < {
  type: string,
} > ();

// import { useToast } from "primevue/usetoast";
// const toast = useToast();});

const atl = useActivityTypesList();
const atf = useActivityTypeFavorites();

const star = computed(() => {
  if (atf.isFavorite(props.type)) {
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
  atf.toggleFavorite(props.type);
};

const goActi = (event: MouseEvent) => {
  if (!['i'].includes(event.target.tagName.toLowerCase()))
    window.location.href = atl.getCreateUrl(props.type);
};

const typeInfo = computed(() => atl.getTypeInfo(props.type));

const test = ref(false);
</script>

<template>
  <Card class="cursor-pointer hover:shadow-md" :dt="{ 'body.padding': '1.5rem 1.5rem 0.5rem 1.5rem' }"
    :pt="{ body: 'pc-body' }">
    <template #content>
      <div class="flex flex-row gap-4 justify-start items-center w-full" @click="(event) => goActi(event)">
        <img :src="typeInfo.icon.path" class="w-24" />
        <div>
          <div class="text-lg font-semibold">
            {{ typeInfo.name }} <sup v-if="typeInfo.status?.beta" class="text-red-500">beta</sup>
            <i :class="'mx-2 text-lg cursor-pointer starspin star ' + star.icon" @click="toggleFav()"
              v-tooltip.top="{ value: star.tt, showDelay: 300, hideDelay: 0 }" />
          </div>
          <div class="text-base">{{ typeInfo.description }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row justify-end gap-2 mt-2">
        <Button :icon="star.icon" label="Favoris" severity="secondary" @click="toggleFav()" />
        <Button as="a" label="Aide" @click="test = true" severity="secondary" />
        <Button as="a" label="Créer" :href="atl.getCreateUrl(props.type)"
          severity="primary" />
      </div>
    </template>
  </Card>
  <DialogIframe v-model="test" :url="typeInfo.helpUrl" />
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
