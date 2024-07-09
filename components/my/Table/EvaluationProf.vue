<script setup>

const props = defineProps({
  nid: String,
  views_total: Number,
  isTeacher: Boolean,
  required: true
})

const visible = ref(false);

const nbViews = function () {
  if (!props.isTeacher)
    return "Activité personnelle"
  else
    return props.views_total > 1 ? props.views_total + ' vues' : props.views_total + ' vue'
}
</script>

<template>
  <template v-if="isTeacher">

    <Button v-if="views_total == 0" severity="secondary" text disabled>0 vue</Button>
    <!-- <NuxtLink v-else :to='"assignment/" + nid'>
      <Button severity="primary" size="large" v-tooltip.top="{ value: 'Voir les copies', showDelay: 400, hideDelay: 0 }"
      text>{{ nbViews() }} </Button>
    </NuxtLink> -->
    
    <Button v-else @click="visible = true" severity="primary" size="large" v-tooltip.top="{ value: 'Voir les copies', showDelay: 400, hideDelay: 0 }"
    text>{{ nbViews() }} </Button>
    <Dialog v-model:visible="visible" maximizable modal header="&nbsp;" :style="{ width: '90%' }">
      <AssignmentStudentList :nid="props.nid" />
    </Dialog>

  </template>
</template>
