<script setup>
const props = defineProps({
  data: Object,
  required: true
})
const my = useMyStore()
const tags = useTagsStore()
const corbeilleTid = () => {
  return tags.tags.data.find(o => o.label === 'Corbeille').id
}
</script>

<template>
  <template v-if="props.data.tags.includes(corbeilleTid())">
  <button @click="my.unHide(props.data.sa_nid, corbeilleTid())">RESTORE</button>
  </template>
  <template v-else>
    {{ props.data.sa_nid }}
  <button @click="tags.addTag(props.data.sa_nid, corbeilleTid())">DELETE</button>
  </template>
</template>

