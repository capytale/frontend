<script setup>
import { useToast } from "primevue/usetoast";

import { useMyStore } from '@/stores/my'
const my = useMyStore()

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
  let obj = my.flatTags.data.find(o => o.id === id);
  return { label: obj ? obj.label : '', color: obj ? obj.color : '' }
}


</script>

<template>
  <span v-for="tid in tids" :key="nid + tid">
    <Button v-if="getName(tid).label" v-tooltip.top="{ value: 'Supprimer', showDelay: 400, hideDelay: 0 }" removable
      @click="delTag(nid, tid)" class="removable pr-1 mr-1" text>
      <i class="pi pi-tag pr-1 normal" :style="'color:' + getName(tid).color"></i>
      <i class="pi pi-times-circle pr-1 exeptionnal red"></i>
      {{ getName(tid).label }}
    </Button>
  </span>
</template>


<style scoped>
.exeptionnal {
  /* visibility: hidden; */
  display: none;
}

.normal {
  /* visibility: visible; */
  display: inline;
  : width:;
}

.removable:hover .exeptionnal {
  /* visibility: visible; */
  display: inline;
}

.removable:hover .normal {
  /* visibility: hidden; */
  display: none;

}

.red {
  color: red;
}
</style>
