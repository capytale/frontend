<script setup>
import { useToast } from "primevue/usetoast";
import { useMyStore } from '@/stores/my'
import { useTagsStore } from '@/stores/tags'

const my = useMyStore()
const tags = useTagsStore()
const activites = useActivitiesStore()

const props = defineProps({
  nid: String,
  tags: Object,
  required: true
})

const toast = useToast();
const delTag = (nid, tid) => {
  activites.untagActivity(nid, tid)
  // TODO : Faire en backend 
}

const tids = computed(() => {
  if (Object.keys(props.tags).length > 0) {
    return props.tags.tids.split(',')
  }
  return []
})

const getName = (id) => {
  let obj = tags.flatTags.data.find(o => o.id === id);
  return { label: obj ? obj.label : '', color: obj ? obj.color : '' }
}
</script>

<template>
  <div v-for="tid in tids" :key="nid + tid">
    <span class="parent mr-1">
      <Button v-if="getName(tid).label" removable class="pr-3 small-button" text @click="op = !op">
        <i class="pi pi-tag px-2 normal" :style="'color:' + getName(tid).color"></i>{{ getName(tid).label }}
      </Button>
      <div class="poubelle">
        <Button icon="pi pi-times" severity="danger" @click="delTag(nid, tid)" outlined rounded />
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
