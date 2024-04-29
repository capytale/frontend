<script setup>
const props = defineProps({
  views_total: Number,
  required: true
})
const nbViews = function () {
  return props.views_total > 1 ? props.views_total + ' vues' : props.views_total + ' vue'
}
</script>

<template>
  <Button v-if="views_total == 0" severity="secondary" rounded>0 vue</Button>
  <a v-else href="https://capytale2.ac-paris.fr/web/assignments/1760082">
    <Button severity="contrast" size="large" rounded>{{ nbViews() }}  </Button>
  </a>
</template>

