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


  <Dialog v-model:visible="visible" header="Partage dans la bibliothèque" :style="{ width: '75%' }">
    <MyTableBibForm :nid="nid"/>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="visible = false"></Button>
    </div>
  </Dialog>
</template>

<style scoped>
.shared {
  color: green;
  font-weight: bold;
  font-size: 1.3rem
}

.unshared {
  color: var(--surface-400);
}

.globe {
  /* font-size: 0.5em; */
  position: relative;
  bottom: 1.1em;
  left: 0.5em;
  color: green;
}
</style>
