<script setup>
import { useToast } from "primevue/usetoast";

import { useMyStore } from '@/stores/my'
import { useTagsStore } from '@/stores/tags'
const my = useMyStore()
const tags = useTagsStore()

const props = defineProps({
  nid: String,
  tags: Object,
  required: true
})

const toast = useToast();
const delTag = (nid, tid) => {
  // const index = tids.value.indexOf(tid);
  // tids.value.splice(index, 1);
  my.untagActivity(nid, tid)
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

const toDelete = ref(false)

const toggleDelete = () => {
  toDelete.value = !toDelete.value
}
</script>

<template>
  <span v-for="tid in tids" :key="nid + tid">
    <Button v-if="getName(tid).label" removable class="removable pr-2 mr-1" text @click="toggleDelete">
      <template v-if="!toDelete">
        <i class="pi pi-tag px-2 normal" :style="'color:' + getName(tid).color"></i>
        <i class="pi pi-trash px-2 exeptionnal red" @click="delTag(nid, tid)"
          v-tooltip.top="{ value: 'Supprimer', showDelay: 400, hideDelay: 0 }"></i>{{ getName(tid).label }}
      </template>
      <template v-else>
        <i class="pi pi-trash px-2" :style="'color:' + getName(tid).color" @click="delTag(nid, tid)"
          v-tooltip.top="{ value: 'Supprimer', showDelay: 400, hideDelay: 0 }"></i>{{ getName(tid).label }}
      </template>
    </Button>

  </span>
</template>


<style scoped>
.exeptionnal {
  /* visibility: hidden; */
  display: none;
  cursor: pointer;
}

.normal {
  /* visibility: visible; */
  display: inline;
}

.removable:hover .exeptionnal {
  /* visibility: visible; */
  display: inline;
}

.removable:hover .normal {
  /* visibility: hidden; */
  display: none;
}

.removable {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 3px;
  display: inline-block;
}

.red {
  color: red;
}
</style>
