<template>
  <div>
    <AssignmentStudentList v-model="visible" :nid="id"
    :viewsVisible="10" />
  </div>
</template>

<script lang="ts" setup>
const id = useRoute().params.id as string
const visible = ref(true)

watch(visible, async (newVal, oldVal) => {
  if (newVal === false) {
    await navigateTo('/my')
  }
})
</script>

<style scoped>

</style>