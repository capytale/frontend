<script setup>
const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})
</script>

<template>
  <MyTableEvaluationEleve v-if="data.isSa" :data="props.data" />
  <MyTableEvaluationProf v-else :data="props.data" :isTeacher="isTeacher" />
</template>

