<template>
<div class="gap-3 w-25rem">
  <Tree :value="props.tags" :dt="{ 'tree.padding': '0', 'node.padding': '0.1rem' }" :pt="{ root: 'treePadd', rootChildren: 'treePadd', nodeLabel: 'nlabel'}">
  <template #default="slotProps">
    <Button :key="slotProps.node.id" severity="secondary" :text="estNullePart(slotProps.node)" :outlined="!estCommun(slotProps.node) && !estNullePart(slotProps.node)" @click="toggleTag(slotProps.node)" :dt="{ 'padding.x': '0.4rem', 'padding.y': '0.4rem'}" pt:root:class="shrink w-full">
    <template #default>
    <div class="flex flex-row items-center justify-start w-full pr-2">
      <i class="pi pi-tag mr-4" :style="'color :'+slotProps.node.color" />
      <span>{{ slotProps.node.label }}</span>
    </div>
    </template>
    </Button>
  </template>
  </Tree>
</div>

</template>

<script lang="ts" setup>
const selection = defineModel('selection')
const props = defineProps(['tags'])

const events = []


// const cancelModif = () => {
//   events.slice().reverse().forEach((event) => {
//     if (event.type === 'tag') {
//       selection.value.find((activite) => activite.nid === event.nid).tags = selection.value.find((activite) => activite.nid === event.nid).tags.filter((id) => id !== event.tid)
//     } else if (event.type === 'untag') {
//       selection.value.find((activite) => activite.nid === event.nid).tags.push(event.tid)
//     }
//   })
//   events.splice(0, events.length)
// }




const estCommun = (tag) => selection.value.every((activite) => activite.tags.includes(tag.id))
const estNullePart = (tag) => selection.value.every((activite) => !activite.tags.includes(tag.id))

const toggleTag = (tag) => {
  // console.log(tag);
  
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

<style>
.treePadd {
  padding: 0 !important;
}

.nlabel {
  flex-grow: 2;
}
</style>