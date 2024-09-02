<script setup>

const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const visible = ref(false);
const my = useMyStore()
const nbViews = computed(() => {
  if (!props.isTeacher)
    return "Activité personnelle"
  else
    return props.data.viewsTotal > 1 ? props.data.viewsTotal + ' vues' : props.data.viewsTotal + ' vue'
})
</script>

<template>
  <div v-if="props.data.extra">
    <Button v-if="data.viewsTotal == 0" severity="secondary" text disabled>0 vue</Button>
    <Button v-else @click="visible = true" severity="primary" size="large"
      v-tooltip.top="{ value: 'Voir les copies', showDelay: 400, hideDelay: 0 }" text>{{ nbViews }} </Button>
    <Dialog v-model:visible="visible" position="top" maximizable modal header="&nbsp;" :style="{ width: '90%' }" dismissableMask>
      <template #header v-if="my.loadingAssignments">
        <Skeleton shape="circle" size="4rem" class="mr-2 my-2"></Skeleton>
        <Skeleton width="20rem" class="mb-2"></Skeleton>
      </template>
      <template #header v-else>
        <img :src="my.assignments.icon" alt="icon" class="w-16 h-16" />
        <span class="activity-title">{{ my.assignments.title }}</span>
      </template>
      <AssignmentStudentList :nid="props.data.nid" :viewsTotal="parseInt(data.viewsTotal)" />
    </Dialog>
  </div>
</template>

<style scoped>


.activity-title {
  font-size: 2rem;
  font-weight: bold;
}

</style>
