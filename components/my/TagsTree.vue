<template>
  <div class="flex flex-col gap-2">
    <Button v-for="tag in props.tags" :key="tag.id" severity="secondary" :text="estNullePart(tag)" :outlined="!estCommun(tag) && !estNullePart(tag)" @click="toggleTag(tag)">
    <template #default>
    <div class="flex flex-row items-center w-full">
      <i class="pi pi-tag mx-4" :style="'color :'+tag.color" />
      <span>{{ tag.label }}</span>
    </div>
    </template>
    </Button>
  </div>
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

<style>

</style>