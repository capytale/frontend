<script lang="ts" setup>
const props = defineProps<{
  url?: string
  position?: string
  style?: string
}>()

const model = defineModel<boolean>()
</script>

<template>
  <Dialog v-if="model" v-model:visible="model" :style="style ? style : 'width: 100%; height: calc(100% - 1.5rem)'"
  content-class="h-full" :position="position" maximizable modal dismissableMask>

  <template #container>
    <iframe :src="props.url" width="100%" height="100%" class="border-radius"></iframe>
  </template>
  </Dialog>
</template>

<style scoped>
.border-radius {
  border-radius: var(--p-dialog-border-radius);
}
</style>

<style>
.p-dialog {
  max-height: 100% !important;
}
</style>
