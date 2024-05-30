<script setup>
import Tooltip from 'primevue/tooltip';

const props = defineProps({
  icon: String,
  type: String,
  required: true
})
</script>

<template>
  <img :src="icon" class="w-10" v-tooltip.top="{ value: type, showDelay: 400, hideDelay: 0 }" type="text" placeholder="Right" :alt="'Activité' + type">
</template>

