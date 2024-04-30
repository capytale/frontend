<script setup>
const props = defineProps({
  boss: String,
  whoami: String,
  evalu: String,
  appre: String,
  required: true
})
</script>

<template>
  <Tag :value="'Par ' + boss" severity="secondary"></Tag>
  <hr/>
  {{ evalu }}
  <hr/>
  {{ appre }}
</template>

