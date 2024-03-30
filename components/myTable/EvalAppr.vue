<script setup>
const props = defineProps({
  boss: String,
  whoami: String,
  eval: String,
  appr: String,
  required: true
})
</script>

<template>
  <Tag :value="'Par ' + boss" severity="secondary"></Tag>
  <hr/>
  {{ eval }}
  <hr/>
  {{ appr }}
</template>

