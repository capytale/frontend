<script setup>
const props = defineProps({
  code: String,
  required: true
})
</script>

<template>
  <Tag :value="code" class="font-mono"></Tag>
</template>

