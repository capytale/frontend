<script setup>

const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const visible = ref(false);
const my = useMyStore()

const pluriel = (s) => {
  return s > 1 ? 's' : ''
}

const details = computed(() => {
  if (!props.isTeacher) return null

  const arch = props.data.viewsTotal - props.data.viewsDetails.visible
  const a = props.data.viewsDetails["100"]
  const b = props.data.viewsDetails["200"]
  const c = props.data.viewsDetails["300"]
  return a + " copie" + pluriel(a) + " en cours\n"
    + b + " copie" + pluriel(b) + " rendue" + pluriel(b) + "\n"
    + c + " copie" + pluriel(c) + " corrigée" + pluriel(c) + "\n\n"
    + arch + " archivée" + pluriel(arch)
})
const nbViews = computed(() => {
  if (!props.isTeacher) return null

  if (props.data.viewsDetails.visible == 0)
    return "Aucune copie"
  else
    return props.data.viewsDetails.visible > 1 ? props.data.viewsDetails.visible + ' copies' : props.data.viewsDetails.visible + ' copie'
})

const testAssignments = () => {
  visible.value = true
}
</script>

<template>
  <template v-if="props.isTeacher">
    <!-- vue teacher -->
    <div v-if="props.data.extra">
      <Button @click="testAssignments" severity="primary"
        v-tooltip.top="{ value: details, showDelay: 400, hideDelay: 0 }" text> {{ nbViews }} </Button>

        <div v-if="visible">
        <AssignmentStudentList v-model="visible" :nid="props.data.nid" :viewsVisible="parseInt(data.viewsDetails.visible)" />
        </div>
    </div>
    <div v-else>
      <!-- Chargement des détails -->
    </div>
  </template>
  <template v-else>
    <!-- vue student (activité perso) -->
  </template>
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
