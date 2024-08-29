<script lang="ts">
let handler: undefined | (() => void)

(window as any).$drupalCloseActivityEdit = () => {
  if (handler) {
    handler()
    handler = undefined
  }
}

const setCloseHandler = (h: () => void) => {
  if (handler === h) return
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

const visible = defineModel<boolean>()

const editUrl = computed(() => `/web/c-hdls/node/${props.data.nid}/edit`)

const close = () => {
  visible.value = false
}

watch(visible, (v) => {
  if (v) {
    setCloseHandler(close)
  } else {
    removeCloseHandler(close)
  }
})

onBeforeUnmount(() => {
  removeCloseHandler(close)
})

</script>


<template>
  <DialogIframe v-model="visible" header="Modification des paramètres de l'activité" :url="editUrl" />
</template>