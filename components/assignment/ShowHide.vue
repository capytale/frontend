<script setup>
const props = defineProps({
  data: Object,
  required: true
})
const my = useMyStore()
//const tags = useTagsStore()
const tagsStore = useTagsStore()
const tags = await useLazyAsyncData('tags', () => tagsStore.getAllTags())
const corbeilleTid = () => {
  return tags.tags.find(o => o.label === 'Corbeille').id
}
</script>

<template>
  <template v-if="props.data.tags.includes(corbeilleTid())">
  <Button @click="my.unHide(props.data.sa_nid, corbeilleTid())">Désarchiver</Button>
  </template>
  <template v-else>
    <!-- addTag({{ props.data.sa_nid }}, {{ corbeilleTid() }}) -->
  <Button @click="my.hide(props.data.sa_nid, corbeilleTid())" icon="pi pi-eye-slash" text/>
  </template>
</template>

