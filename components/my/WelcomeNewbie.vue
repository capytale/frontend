<script setup>
const props = defineProps({
  isTeacher: Boolean,
})
</script>

<template>
  <template v-if="props.isTeacher">
    Welcome newbie teacher!
  </template>
  <template v-else>
    Welcome newbie student !
  </template>
</template>
