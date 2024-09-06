<template>
<div class="gap-3 w-25rem">
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
  <div class="flex flex-row justify-between">
    <Button label="Appliquer" @click="replaceTags" class="mt-4" size="small" />
    <Button label="Annuler" @click="cancelModif" class="mt-4" severity="secondary"
      size="small" />
  </div>
</div>

</template>

<script lang="ts" setup>
const activities = useActivitiesStore()
const selection = defineModel('selection')
const props = defineProps(['tags'])

const events = []

const replaceTags = async () => {
  await activities.replaceTags([...selection.value.map((o) => o.nid)], selection.value.map((o) => toRaw(o.tags)))
}

const cancelModif = () => {
  events.slice().reverse().forEach((event) => {
    if (event.type === 'tag') {
      selection.value.find((activite) => activite.nid === event.nid).tags = selection.value.find((activite) => activite.nid === event.nid).tags.filter((id) => id !== event.tid)
    } else if (event.type === 'untag') {
      selection.value.find((activite) => activite.nid === event.nid).tags.push(event.tid)
    }
  })
  events.splice(0, events.length)
}


const estCommun = (tag) => selection.value.every((activite) => activite.tags.includes(tag.id))
const estNullePart = (tag) => selection.value.every((activite) => !activite.tags.includes(tag.id))

const toggleTag = (tag) => {
  console.log(tag);
  
  if(estCommun(tag)) {
    selection.value.forEach((activite) => {
      activite.tags = activite.tags.filter((id) => id !== tag.id)
      events.push({ type: 'untag', nid: activite.nid, tid: tag.id })
    })
  } else if(estNullePart(tag) || (!estCommun(tag) && !estNullePart(tag))) {
    selection.value.forEach((activite) => {
      if (!activite.tags.includes(tag.id)) {
        activite.tags.push(tag.id)
        events.push({ type: 'tag', nid: activite.nid, tid: tag.id })
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