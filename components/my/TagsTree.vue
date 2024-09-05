<template>
  <Tree :value="props.tags" :dt="{ 'tree.padding': '0', 'node.padding': '0.1rem' }" :pt="{ root: 'treePadd', rootChildren: 'treePadd'}">
  <template #default="slotProps">
    <Button :key="slotProps.node.id" severity="secondary" :text="estNullePart(slotProps.node)" :outlined="!estCommun(slotProps.node) && !estNullePart(slotProps.node)" @click="toggleTag(slotProps.node)" :dt="{ 'padding.x': '0.4rem', 'padding.y': '0.4rem'}">
    <template #default>
    <div class="flex flex-row items-center w-full pr-2">
      <i class="pi pi-tag mx-4" :style="'color :'+slotProps.node.color" />
      <span>{{ slotProps.node.label }}</span>
    </div>
    </template>
    </Button>
  </template>
  </Tree>
</template>

<script lang="ts" setup>
const selection = defineModel('selection')
const props = defineProps(['tags'])

const estCommun = (tag) => selection.value.every((activite) => activite.tags.includes(tag.id))
const estNullePart = (tag) => selection.value.every((activite) => !activite.tags.includes(tag.id))

const toggleTag = (tag) => {
  if(estCommun(tag)) {
    selection.value.forEach((activite) => {
      activite.tags = activite.tags.filter((id) => id !== tag.id)
    })
  } else if(estNullePart(tag) || (!estCommun(tag) && !estNullePart(tag))) {
    selection.value.forEach((activite) => {
      if (!activite.tags.includes(tag.id)) {
        activite.tags.push(tag.id)
      }
    })
  }
}
</script>

<style scoped>
.treePadd {
  padding: 0
}

</style>