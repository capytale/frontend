<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
      </h2>
    </template>
    <template #content>
      <div class="flex flex-row gap-2 overflow-x-scroll">
      <a v-for="el of myStore.types.filter(el => myStore.favorites.includes(el.id))" :key="el.id" :href="'/web/node/add/activity?type=' + el.id" v-tooltip.bottom="el.name" class="hover:shadow-md">
          <img :src="'https://capytale2.ac-paris.fr'.concat(el.icon.path)" class="w-16" />
          <div class="text-sm" v-if="false">
            {{ el.name.replace("Robot", "").replace("Carte", "").replace("Pi ", "") }}
          </div>
      </a>
        <a href="/activites" v-tooltip.bottom="'Autre'"><i class="p-2 pi pi-plus-circle text-blue-500 text-3xl font-bold"></i></a>
      </div>
    </template>
  </Card>
</template>

<script setup>
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";
const myStore = useMyStore();

myStore.favorites = await TypeApi.getFavorites(true);
myStore.types = await useActivities()
</script>
