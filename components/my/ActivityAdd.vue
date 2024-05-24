<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
        <i class="p-2 pi pi-plus-circle text-blue-500 text-3xl font-bold"></i>
      </h2>
    </template>
    <template #content>
      <span v-for="el of myStore.favorites" :key="el.id">{{ el }}</span>
    </template>
  </Card>
</template>

<script setup>
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";
const myStore = useMyStore();

myStore.favorites = await TypeApi.getFavorites();
</script>