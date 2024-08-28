<script setup>
const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})
</script>

<template>
  <div class="centered">
    <MyTableEvaluationEleve v-if="data.isSa" :data="props.data" />
    <MyTableEvaluationProf v-else :data="props.data" :isTeacher="isTeacher" />
  </div>
</template>

<style scoped>
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
