<script setup>
const props = defineProps({
  title: String,
  player: String,
  required: true
})
</script>

<template>
  <a :href="player" class="underline text-blue-700">{{ title }}</a>
</template>

