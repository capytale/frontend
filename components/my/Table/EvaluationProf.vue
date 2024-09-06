<script setup>

const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const visible = ref(false);
const my = useMyStore()
const details = computed(() => {
  if (!props.isTeacher)
    return "Activité personnelle"
  else
  return props.data.viewsDetails["100"] + " copies en cours\n"
    + props.data.viewsDetails["200"] + " copies rendue(s)\n"
    + props.data.viewsDetails["300"] + " copies corrigée(s)\n\n"
})
const nbViews = computed(() => {
  if (!props.isTeacher)
    return "Activité personnelle"
  else
    return props.data.viewsDetails.visible > 1 ? props.data.viewsDetails.visible + ' vues' : props.data.viewsDetails.visible + ' vue'
})
</script>

<template>
  <div v-if="props.data.extra">
    <Button v-if="data.viewsTotal == 0" severity="secondary" text disabled>0 vue</Button>
    <Button v-else @click="visible = true" severity="primary" size="large"
      v-tooltip.top="{ value: details + 'Cliquez pour les voir', showDelay: 400, hideDelay: 0 }" text> {{ nbViews }} </Button>
    <Dialog v-model:visible="visible" position="top" maximizable modal header="&nbsp;" :style="{ width: '90%' }" dismissableMask>
      <template #header v-if="my.loadingAssignments">
        <Skeleton shape="circle" size="4rem" class="mr-2 my-2"></Skeleton>
        <Skeleton width="20rem" class="mb-2"></Skeleton>
      </template>
      <template #header v-else>
        <img :src="my.assignments.icon" alt="icon" class="w-16 h-16" />
        <span class="activity-title">{{ my.assignments.title }}</span>
      </template>
      <AssignmentStudentList :nid="props.data.nid" :viewsVisible="parseInt(data.viewsDetails.visible)" />
    </Dialog>
  </div>
</template>

<style scoped>

.encours {
  color: var(--warning-color);
}
.activity-title {
  font-size: 2rem;
  font-weight: bold;
}

</style>
