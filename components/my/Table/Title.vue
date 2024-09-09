<script setup>
const props = defineProps({
  data: Object,
})

const playerUrl = computed(() => {
  const mode = props.data.isSa ? 'assignment' : 'create'
  return `/web/c-act/n/${props.data.nid}/play/${mode}`
})

const visible = ref(false);
</script>

<template>
  <div class="flex flex-row items-center justify-between parent">
    <a :href="playerUrl" v-tooltip.top="data.title" class="clickable">{{ data.title }}</a>
    
    <i class="pi pi-cog cog" style="font-size: 1.5rem;" v-if="!props.data.isSa" @click="visible = true" />
    <MyActivityEdit v-model="visible" :data="props.data" />
  </div>
</template>


<style scoped>
.cog {
  color: rgba(0, 0, 0, 0);
}

.parent:hover .cog {
  color: var(--p-button-text-primary-color);
}
.clickable {
  cursor: pointer;
  color: var(--p-button-text-primary-color);
  text-decoration: underline;
  max-width: calc(100% - 2rem);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.clickable:hover {
  color: var(--p-button-text-hover-color);
}
</style>
