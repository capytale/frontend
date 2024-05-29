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
  toast.add({ severity: 'success', summary: 'Tag supprimé', detail: `${nid}: ${tid}`, life: 2000 });
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
    <Button v-if="getName(tid).label" v-tooltip.right="'Supprimer'" removable @click="delTag(nid, tid)" class="removable">
      <i class="pi pi-tag p-2" :style="'color:' + getName(tid).color"></i>
      {{ getName(tid).label }}
      <i class="pi pi-times-circle p-2 hide red"></i>
    </Button>
  </span>
</template>


<style scoped>
.hide {
  visibility: hidden;
}

.removable:hover .hide {
  visibility: visible;
}

.red {
  color: red;
}
</style>
