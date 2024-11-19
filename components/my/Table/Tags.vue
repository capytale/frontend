<script setup>
import { useTagsStore } from '@/stores/tags'

//const tags = useTagsStore()
const tagsStore = useTagsStore()
const tags = await useLazyAsyncData('tags', () => tagsStore.getAllTags())
const activites = useActivitiesStore()

const props = defineProps({
  data: Object,
  tmp: Object
})

const delTag = (nid, tid) => {
  activites.untagActivity(nid, tid)
}

const getName = (id) => {
  let obj = tags.flatTags.find(o => o.id === id);
  return { label: obj ? obj.label : '', color: obj ? obj.color : '' }
}

const workingTags = computed(() => {
  return props.tmp || props.data
})

const testSet = computed(() => {
  return new Set([...(props.data.tags || []), ...(props.tmp?.tags || [])])
})
</script>

<template>
<div class="flex flex-row justify-between items-center">
  <div>
    <span class="whitespace-nowrap flex flex-row items-center" v-for="tag in testSet" :key="workingTags.nid + tag"
      :class="props.data.tags.includes(tag) ? (workingTags.tags.includes(tag) ? '' : 'line-through') : 'italic'">
      <i class="pi pi-tag mr-2" :style="'color:' + getName(tag).color"></i>
      {{ getName(tag).label }}{{ props.data.tags.includes(tag) ? (workingTags.tags.includes(tag) ? '' : '') : '*' }}
    </span>
  </div>
  <Button v-if="false" icon="pi pi-pencil" severity="secondary" text rounded aria-label="Éditer" class="self-center" size="small" @click="editItem" />
</div>
</template>


<style scoped>
.etiquette {
  cursor: default;
}

.poubelle {
  display: none;
  position: absolute;
  left: 100%;
  bottom: -50%;
  padding-left: 0.3rem;
  z-index: 1;
}

.parent {
  position: relative;
}

.parent:hover .poubelle {
  display: inline;
}
</style>
