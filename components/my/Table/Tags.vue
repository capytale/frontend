<script setup>
import { useToast } from "primevue/usetoast";
const props = defineProps({
  nid: String,
  tags: Object,
  required: true
})

const toast = useToast();
const delTag = (nid, tid) => {

  const index = tids.value.indexOf(tid);
  tids.value.splice(index, 1);
  toast.add({ severity: 'success', summary: 'Tag supprimé', detail: `${nid}: ${tid}`, life: 2000 });
}

const tids = ref([])
let names = []
let colors = []

if (Object.keys(props.tags).length > 0) {
  tids.value = props.tags.tids.split(',')
  names = props.tags.names.split(',')
  colors = props.tags.colors.split(',')
}

</script>

<template>
  <span v-for="(tid, key) in tids" :key="nid + tid">
    <Button v-tooltip.left="'Cliquer pour supprimer'" removable @click="delTag(nid, tid)">
      <i class="pi pi-tag pr-2" :style="'color:' + colors[key]"></i>
      {{ names[key] }}
    </Button>
  </span>
</template>

