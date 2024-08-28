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

const visible = defineModel<boolean>()

const editUrl = computed(() => `/web/c-hdls/node/${props.data.nid}/edit`)
</script>


<template>
  <DialogIframe v-model="visible" titre="Modification des paramètres de l'activité" :url="editUrl" />
</template>