<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
      </h2>
    </template>
    <template #content>
      <div class="overscroll-x-auto myflex">
        <template v-if="myStore.favorites.length === 0">
          <!-- <div class="text-center">Aucune activité favorite</div> -->
        </template>
        <template v-else>
          <a v-for="el of myStore.types.filter(el => myStore.favorites.includes(el.id))" :key="el.id"
            :href="'/web/node/add/activity?type=' + el.id" v-tooltip.bottom="el.name" class="hover:shadow-md">
            <img :src="el.icon.path" class="w-16 inline" />
            <span class="mystar">
              <i class="pi pi-star-fill text-yellow-400" style="font-size: 0.5rem"></i>
            </span>
            <div class="text-sm" v-if="false">
              {{ el.name.replace("Robot", "").replace("Carte", "").replace("Pi ", "") }}
            </div>
          </a>
        </template>
        <a v-for="el of listActivityTypesWithActivities().slice(0,nb)" :key="el.id" 
          :href="'/web/node/add/activity?type=' + el.id" v-tooltip.bottom="el.name" class="hover:shadow-md">
          <img :src="el.icon.path" class="w-16 inline" />
        </a>

        <NuxtLink to="/activites" class="hover:shadow-md acti-button">
          <Button type="submit" label="Toutes les activités" />
        </NuxtLink>
      </div>
    </template>
  </Card>
</template>

<script setup>
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";
const myStore = useMyStore();
const activites = useActivitiesStore()

myStore.favorites = await TypeApi.getFavorites(true);
myStore.types = await useActivities()

// list activitiy types ordered by number of activities
const listActivityTypes = () => {
  let types = myStore.types.map((el) => {
    return {
      id: el.id,
      name: el.name,
      count: activites.activities.data.filter((act) => act.type === el.id).length,
      icon: el.icon,
    };
  });
  return types.sort((a, b) => b.count - a.count);
};

// reduce listActivityTypes to only show types with activities
const listActivityTypesWithActivities = () => {
  return listActivityTypes().filter((el) => el.count > 0);
};

// count number of favorites
const nbFav = () => {
  return myStore.favorites.length;
};

// nb elements to display
const nb = 8-nbFav();

</script>

<style scoped>
.myflex {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.mystar {
  display: inline-block;
  position: relative;
  top: -30px;
  left: -2px;
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
