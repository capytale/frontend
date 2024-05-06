<script setup>
import { PrimeIcons as PI } from 'primevue/api'
const props = defineProps({
  nid: String,
  shared: String,
  web: String,
})
const shareClass = props.shared == "0" ? " unshared " : " shared "
</script>
})

<template>
  <i v-if="web == '1'" :class="PI.GLOBE + ' globe'" :style="style" />
  <i :class="PI.SHARE_ALT + shareClass" />
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
