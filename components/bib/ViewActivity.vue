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
    <Dialog v-model:visible="visible" maximizable modal :header="'&nbsp;'" style="width: 80%; height: 80vh"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <iframe id="inlineFrameExample" title="Inline Frame Example" style="overflow:hidden;height:90vh;width:100%"
            height="100%" width="100%" :src=url>
        </iframe>
    </Dialog>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  color: var(--p-sky-900);
  text-decoration: underline;
}
</style>
