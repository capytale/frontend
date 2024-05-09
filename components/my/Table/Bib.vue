<script setup>
import Dialog from 'primevue/dialog'
import { PrimeIcons as PI } from 'primevue/api'
import { ref } from "vue";

const visible = ref(false);
const props = defineProps({
  nid: String,
  shared: String,
  web: String,
})
const shareClass = props.shared == "0" ? " unshared " : " shared "
</script>

<template>
  <button @click="visible = true">
    <i v-if="web == '1'" :class="PI.GLOBE + ' globe'" />
    <i :class="PI.SHARE_ALT + shareClass" />
  </button>


  <Dialog v-model:visible="visible" header="Partage dans la bibliothèque" :style="{ width: '75%'}" >
    <MyTableBibForm :nid="nid"/>
  </Dialog>
</template>

<style>
.shared {
  color: green;
  font-weight: bold;
  font-size: 1.3rem
}

.p-dialog .p-dialog-header {
  background: var(--gray-200);
}

.unshared {
  color: var(--surface-400);
}

.p-tree-selectable {
  background: var(--gray-100);
}

.p-dialog-content {
  background: var(--gray-100);
}

.globe {
  /* font-size: 0.5em; */
  position: relative;
  bottom: 1.1em;
  left: 0.5em;
  color: green;
}
</style>
