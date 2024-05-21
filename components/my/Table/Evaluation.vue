<script setup>
const props = defineProps({
  boss: String,
  whoami: String,
  evalu: String,
  appre: String,
  isTeacher: Boolean,
  views_total: Number,
  required: true
})
</script>

<template>
  <MyTableEvaluationEleve v-if="whoami == 'ap' " :boss="boss" :whoami="whoami" :evalu="evalu" :appre="appre" />
  <MyTableEvaluationProf v-else :views_total="views_total" :isTeacher="isTeacher" />
</template>

