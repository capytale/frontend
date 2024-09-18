<template>
  <Dialog v-if="model" v-model:visible="model" :header="props.header || '&nbsp;'" :style="style ? style : 'width: 80%; height: 80vh'"
  :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" content-class="h-full" :position="position" maximizable modal dismissableMask>

  <template #header>
    <slot name="header" />
  </template>
  <slot />
    <iframe :src="props.url" width="100%" height="100%"></iframe>
  </Dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  url?: string
  header?: string
  icon?: string
  position?: string
  style?: string
}>()

const model = defineModel<boolean>()
</script>
