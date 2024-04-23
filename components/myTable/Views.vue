<script setup>
const props = defineProps({
  views_total: Number,
  required: true
})
</script>

<template>
  <Badge v-if="views_total == 0" :value="views_total" severity="secondary"></Badge>
  <a v-else href="https://capytale2.ac-paris.fr/web/assignments/1760082">
    <Badge :value="views_total" severity="contrast"></Badge>
  </a>
</template>

