<script setup lang="ts">
const props = defineProps<{
  data: {
    nid: number
  }
}>()

const visible = defineModel<boolean>()

const editUrl = computed(() => `/web/c-hdls/node/${props.data.nid}/edit`)

const close = () => {
  visible.value = false
}

watch(visible, (v) => {
  if (v) {
    drupal.setCloseHandler(close)
  } else {
    drupal.removeCloseHandler(close)
  }
})

onBeforeUnmount(() => {
  drupal.removeCloseHandler(close)
})

</script>


<template>
  <DialogIframe v-model="visible" header="Modification des paramètres de l'activité" :url="editUrl" />
</template>