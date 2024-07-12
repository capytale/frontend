<script setup>
import Dialog from 'primevue/dialog'
import { PrimeIcons as PI } from '@primevue/core/api'
import { ref } from "vue";

const visible = ref(false);
const props = defineProps({
  nid: String,
  title: String,
  shared: String,
  web: String,
  whoami: String,
})
const shareClass = props.shared == "0" ? " unshared " : " shared "

</script>

<template>
  <div v-if="whoami != 'ap' ">
    <button @click="visible = true">
      <i v-if="shared == '1' && web == '1'" :class="PI.GLOBE + shareClass + ' globe'" />
      <i v-else-if="shared == '1' && web == '0'" :class="PI.CLONE + shareClass + ' globe'" />
      <i :class="PI.SHARE_ALT + shareClass" />
    </button>
  </div>


  <Dialog v-model:visible="visible" :header="props.title" modal :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } } "
    :style="{ width: '75%' }">
    <MyTableBibForm :nid="nid"  @closeBibForm="visible = false"/>
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
  color: var(--p-surface400);
}


.p-dialog-content {
  background: var(--gray-100);
}

.globe {
  /* font-size: 0.5em; */
  position: relative;
  bottom: 0.9em;
  left: 0.5em;
}
</style>
