<script setup>
const props = defineProps({
    data: Object,
})
const visible = ref(false);

const url = computed(() => {
    return `/web/c-act/n/${props.data.nid}/play/view`
})
</script>

<template>
     <span @click="visible = true" class="clickable" >{{ props.data.title }}</span>

    <DialogIframe v-model="visible" :header="'&nbsp;'" :url="url" />
</template>

<style scoped>
.clickable {
  cursor: pointer;
  color: var(--p-sky-900);
  text-decoration: underline;
}
</style>
