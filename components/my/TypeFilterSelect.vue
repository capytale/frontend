<script setup lang="ts">

/**
 * Le type sélectionné
 */
const type = defineModel<string | null>()


import { useActivityTypesList } from "~/composables/activityTypes/list"
const atl = useActivityTypesList()

const activites = useActivitiesStore()

/**
 * Liste des types à afficher dans la drop down
 */
const typesList = computed(() => {
  const used: { [key: string]: true } = {};
  if (activites.activities.data) {
    for (const act of activites.activities.data) {
      used[act.type] = true;
    }
  }
  const keys = Object.keys(used);
  const ret = keys.sort((a, b) => atl.getTypeInfo(a).name.localeCompare(atl.getTypeInfo(b).name));
  return ret;
});
</script>


<template>
  <Select v-model="type" :options="typesList" filter
    placeholder="Filtrer par type" class="w-full md:w-14rem" showClear>
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex va">
        <img :src="atl.getTypeInfo(value).icon.path" class="w-8 mr-3" />
        {{ atl.getTypeInfo(value).name }}
      </div>
      <span v-else>
        {{ placeholder }}
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex va">
        <img :src="atl.getTypeInfo(option).icon.path" class="w-8 mr-3" />
        <div>{{ atl.getTypeInfo(option).name }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.va {
  align-items: center;
}
</style>