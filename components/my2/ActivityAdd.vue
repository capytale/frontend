<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
      </h2>
    </template>
    <template #content>
      <div class="overscroll-x-auto myflex">
        <fieldset>
          <legend class="text-lg">Mes activités favorites <i class="pi pi-star-fill text-yellow-400"></i> </legend>
          <a v-for="el of myStore.types.filter(el => myStore.favorites.includes(el.id))" :key="el.id"
            :href="'/web/node/add/activity?type=' + el.id" v-tooltip.bottom="el.name" class="hover:shadow-md">
            <img :src="el.icon.path" class="w-16 inline" />
            <div class="text-sm" v-if="false">
              {{ el.name.replace("Robot", "").replace("Carte", "").replace("Pi ", "") }}
            </div>
          </a>
        </fieldset>
        <NuxtLink to="/activites" class="hover:shadow-md acti-button">
            <Button type="submit" label="Voir tout" />
          </NuxtLink>
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

<style scoped>
.myflex {
  display: flex;
  gap: 1em;
  align-items: center;
}

fieldset {
  border: 1px solid #000;
  padding: 0.5em 1em 1em 1em;
  border-radius: 5px;
  /* position: relative; */
  /* top: -10px; */
}
.acti-button {
  position: relative;
  top: 2px;
}
</style>
