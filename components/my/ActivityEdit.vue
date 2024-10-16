<script setup lang="ts">
const props = defineProps<{
  data: {
    nid: number
  }
}>()

const activites = useActivitiesStore()

const visible = defineModel<boolean>()

const editUrl = computed(() => `/web/c-hdls/node/${props.data.nid}/edit`)

const close = () => {
  visible.value = false
}

watch(visible, (v, ov) => {
  if (v) {
    drupal.setCloseHandler(close)
  } else {
    if (ov) activites.refreshDetails(props.data)
    drupal.removeCloseHandler(close)
  }
})

onBeforeUnmount(() => {
  drupal.removeCloseHandler(close)
})

</script>


<template>
  <DialogIframe v-model="visible" header="Modification des paramètres" :url="editUrl" />
</template>
