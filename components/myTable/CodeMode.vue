<script setup>
const props = defineProps({
  code: String,
  mode: String,
  required: true
})
</script>

<template>
  <MyTableCode :code="code" />
  <MyTableMode :mode="mode" />
</template>

