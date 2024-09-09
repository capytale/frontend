<script setup lang="ts">

const props = defineProps<{
  activities?: { type: string }[]
}>()

/**
 * Le type sélectionné
 */
const type = defineModel<string[] | null>()


import { useActivityTypesList } from "~/composables/activityTypes/list"
const atl = useActivityTypesList()

/**
 * Liste des types à afficher dans la drop down
 */
const typesList = computed<{ [type: string]: string[] }>(() => {
  let types: readonly string[];
  if (props.activities == null) {
    types = atl.availableTypes;
  } else {
    const used: { [key: string]: true } = {};
    for (const act of props.activities) {
      used[act.type] = true;
    }
    types = Object.keys(used);
  }
  const merged: { [type: string]: string[] } = {};
  for (const t of types) {
    if (!atl.typeExists(t)) continue;
    const info = atl.getTypeInfo(t);
    let mt: string;
    if (info.filterWith) {
      mt = info.filterWith;
    } else {
      mt = t;
    }
    if (merged[mt] == null) {
      merged[mt] = [];
    }
    merged[mt].push(t);
  }
  const sorted = Object.keys(merged).sort((a, b) => atl.getTypeInfo(a).name.localeCompare(atl.getTypeInfo(b).name));
  const ret: { [type: string]: string[] } = {};
  for (const t of sorted) {
    ret[t] = merged[t];
  }
  return ret;
});

const selectedType = ref<string | null>(null)

watchEffect(() => {
  if (selectedType.value == null) {
    type.value = null;
  } else {
    type.value = typesList.value[selectedType.value];
  }
})

</script>


<template>
  <Select v-model="selectedType" :options="Object.keys(typesList)" filter placeholder="Filtrer par type" class="w-full md:w-14rem" showClear>
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