<script setup>
const props = defineProps({
  views_total: Number,
  required: true
})
</script>

<template>
  {{ views_total }} {{ views_total > 1 ? 'vues' : 'vue' }}
</template>

