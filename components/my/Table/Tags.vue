<script setup>
import { useTagsStore } from '@/stores/tags'

const tags = useTagsStore()
const activites = useActivitiesStore()

const props = defineProps({
  data: Object,
  tmp: Object
})

const delTag = (nid, tid) => {
  activites.untagActivity(nid, tid)
}

const getName = (id) => {
  let obj = tags.flatTags.data.find(o => o.id === id);
  return { label: obj ? obj.label : '', color: obj ? obj.color : '' }
}

const workingTags = computed(() => {
  return props.tmp || props.data
})
</script>

<template>
  <div v-for="tag in workingTags.tags" :key="workingTags.nid + tag">
    <!-- {{ tag }} {{ workingTags.nid }} -->
    <!-- {{ workingTags.info }} -->
    <span class="parent mr-1">
      <Button v-if="getName(tag).label" removable class="pr-3 small-button" text @click="op = !op">
        <i class="pi pi-tag px-2 normal" :style="'color:' + getName(tag).color"></i>
        <span class="whitespace-nowrap" :class="props.data.tags.includes(tag) ? '' : 'italic'">
        {{ getName(tag).label }}{{ props.data.tags.includes(tag) ? '' : '*' }}
        </span>
      </Button>
      <div class="poubelle">
        <Button icon="pi pi-times" severity="danger" @click="delTag(workingTags.nid, tag)" outlined rounded />
      </div>
    </span>
  </div>
</template>


<style scoped>
.poubelle {
  display: none;
  position: absolute;
  left: 100%;
  bottom: -30%;
  padding-left:0.5rem;
  z-index: 1;
}
.parent{
  position: relative;
}
.parent:hover .poubelle {
  display: inline;
}
.small-button {
  padding: 0;
}
</style>
