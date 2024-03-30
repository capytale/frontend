<script setup>
const props = defineProps({
  boss: String,
  whoami: String,
  evalu: String,
  appre: String,
  views_total: Number,
  required: true
})
</script>

<template>
  <MyTableEvalAppr v-if="whoami == 'ap' ":boss="boss" :whoami="whoami" :eval="evalu" :appr="appre" />
  <MyTableViews v-else :views_total="views_total" />
</template>

