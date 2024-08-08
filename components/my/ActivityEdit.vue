<script lang="ts">
let handler: undefined | (() => void)

(window as any).$drupalCloseActivityEdit = () => {
  if (handler) {
    handler()
    handler = undefined
  }
}

const setCloseHandler = (h: () => void) => {
  if (handler) {
    handler()
  }
  handler = h
}

const removeCloseHandler = (h: () => void) => {
  if (handler === h) {
    handler = undefined
  }
}
</script>

<script setup lang="ts">
const props = defineProps<{
  data: {
    nid: number
  }
}>()

const emit = defineEmits<{
  close: []
}>()

const editUrl = computed(() => `/web/c-hdls/node/${props.data.nid}/edit`)

const close = () => {
  emit('close')
}

onMounted(() => {
  setCloseHandler(close)
})

onBeforeUnmount(() => {
  removeCloseHandler(close)
})
</script>


<template>
  <iframe title="Modification des paramètres de l'activité" style="overflow:hidden;height:90vh;width:100%" height="100%"
    width="100%" :src="editUrl">
  </iframe>
</template>
