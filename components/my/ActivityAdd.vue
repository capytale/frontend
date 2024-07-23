<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
      </h2>
      <div class="bg-red-300 border-red-500 p-4 m-4 rounded w-fit flex flex-row items-center justify-around">
      <Checkbox v-model="variant" inputId="variant" :binary="true" />
      <label for="variant" class="ml-4">Option 1 / Option 2 ?</label>
      </div>
    </template>
    <template #content>
      <div class="overscroll-x-auto myflex">
        <fieldset>
          <legend class="text-lg">Mes activités favorites</legend>
          <Button v-if="variant" rounded outlined icon="pi pi-star" @click="togglePopover" />
          <Popover v-if="variant" ref="popover">
          <a v-for="el of myStore.types.filter(el => myStore.favorites.includes(el.id))" :key="el.id"
            :href="'/web/node/add/activity?type=' + el.id" v-tooltip.bottom="el.name" class="hover:shadow-md">
            <img :src="el.icon.path" class="w-16 inline" />
            <div class="text-sm" v-if="false">
              {{ el.name.replace("Robot", "").replace("Carte", "").replace("Pi ", "") }}
            </div>
          </a>
          </Popover>

          <div v-if="!variant">
          <a v-for="el of myStore.types.filter(el => myStore.favorites.includes(el.id))" :key="el.id"
            :href="'/web/node/add/activity?type=' + el.id" v-tooltip.bottom="el.name" class="hover:shadow-md">
            <img :src="el.icon.path" class="w-16 inline" />
            <div class="text-sm" v-if="false">
              {{ el.name.replace("Robot", "").replace("Carte", "").replace("Pi ", "") }}
            </div>
          </a>
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-lg">Voir tout</legend>
          <a href="/activites" v-tooltip.bottom="'Autre'"><i
              class="p-2 pi pi-plus-circle text-blue-500 text-3xl font-bold"></i></a>
        </fieldset>
      </div>
    </template>
  </Card>
</template>

<script setup>
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";
const myStore = useMyStore();

myStore.favorites = await TypeApi.getFavorites(true);
myStore.types = await useActivities()

const popover = ref();
const togglePopover = (event) => popover.value.toggle(event);

const variant = ref(false);
</script>

<style scoped>
.myflex {
  display: flex;
  gap: 1em;
  align-items: center;
}

fieldset {
  border: 1px solid #000;
  padding: 1em;
  border-radius: 5px;
}
</style>