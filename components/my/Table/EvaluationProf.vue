<script setup>

const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const visible = ref(false);

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
    <Dialog v-model:visible="visible" maximizable modal header="&nbsp;" :style="{ width: '90%' }" dismissableMask>
      <AssignmentStudentList :nid="props.data.nid" :viewsTotal="parseInt(data.viewsTotal)" />
    </Dialog>
  </div>
</template>
