<script setup>
import Tooltip from 'primevue/tooltip';

const props = defineProps({
  icon: String,
  type: String,
  required: true
})
</script>

<template>
  <img :src="icon" class="w-10" v-tooltip="type" type="text" placeholder="Right">
</template>

