<script setup lang="ts">

const props = defineProps<{
  activities?: { type: string }[]
}>()

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
  let keys: readonly string[];
  if (props.activities == null) {
    keys = atl.availableTypes;
  } else {
    const used: { [key: string]: true } = {};
    for (const act of props.activities) {
      used[act.type] = true;
    }
    keys = Object.keys(used);
  }
  const ret = keys.toSorted((a, b) => atl.getTypeInfo(a).name.localeCompare(atl.getTypeInfo(b).name));
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