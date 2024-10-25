<script setup lang="ts">
import { useBibMetaData } from '@/composables/bib/metaData';
const bibMetadata = useBibMetaData()

const model = defineModel<number[]>();

const selected = ref<{ id: number, label: string }[]>([])

watchImmediate([model, () => bibMetadata.getModuleLabel],  ([m, gml]) => {
  if (m == null) {
    selected.value.length = 0;
  } else {
    selected.value.length = m.length;
    for (let i = 0; i < m.length; i++) {
      selected.value[i] = { id: m[i], label: gml(m[i]) };
    }
  }
});

watch(selected, (acm) => {
  if (model.value == null) return
  model.value.length = acm.length;
  for (let i = 0; i < acm.length; i++) {
    model.value[i] = acm[i].id;
  }
});

const suggestedModules = ref<{
  id: number;
  label: string;
}[]>([])

const fullList = computed(() => {
  return bibMetadata.modulesCodes.map((id) => {
    return { id, label: bibMetadata.getModuleLabel(id), lowLabel: bibMetadata.getModuleLabel(id).toLowerCase() };
  })
})

function search(event: { query: string }) {
  const query = event.query.trim().toLowerCase();
  if (query.length === 0) {
    suggestedModules.value.length = 0;
  } else {
    suggestedModules.value = fullList.value.filter((item) => {
      return !selected.value.some((v) => v.id === item.id) && item.lowLabel.includes(query);
    });
  }
}

</script>

<template>
  <div>
    <label for="modules" class="font-semibold w-6rem">Modules utilisés</label>
    <AutoComplete id="modules" v-model="selected" multiple :suggestions="suggestedModules" optionLabel="label"
      @complete="search" />
  </div>
</template>
