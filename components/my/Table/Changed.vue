<script setup>
import { timeElapsed } from '~/utils/format';

const props = defineProps({
  data: Object,
})

// const activites = useActivitiesStore()
// activites.getAllDetails(props.data)

const computedChanged = computed(() => {
  if (!props.data.extra) return props.data.changed 
  if (props.data.saMaxChanged == null) return props.data.changed
  // return `${props.data.saMaxChanged}-${props.data.changed}`
  return Math.max(props.data.changed, props.data.saMaxChanged)
})

</script>

<template>
  <div v-if="!props.data.extra">
    <i>Il y a {{ timeElapsed(data.changed * 1000) }}</i>
  </div>
  <div v-else>
    Il y a {{ timeElapsed(computedChanged * 1000) }}
  </div>
</template>

