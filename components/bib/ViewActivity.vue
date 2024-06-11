<script setup>
const props = defineProps({
    nid: Number,
    required: true
})
const visible = ref(false);

const url = computed(() => {
    return `/web/c-act/n/${props.nid}/play/view`
})

</script>

<template>
    <Button label="Voir" @click="visible = true" />
    <Dialog v-model:visible="visible" maximizable modal :header="'Header ' + nid" style="width: 80%; height: 80vh"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        {{ url }}
        <iframe id="inlineFrameExample" title="Inline Frame Example" style="overflow:hidden;height:90vh;width:100%"
            height="100%" width="100%" :src=url>
        </iframe>
    </Dialog>
</template>
