<script setup>
import { richContentToPlainText } from '~/utils/sanitization';
import { useToast } from "primevue/usetoast";
const toast = useToast();

const props = defineProps({
    data: Object,
    required: true
})

const value = ref(richContentToPlainText(props.data.evaluation))

const save = () => {
    console.log("klklkl", value)
    toast.add({ severity: 'success', summary: 'Enregistré', life: 1000 });
}
</script>

<template>
    <Textarea v-model="value" rows="2" cols="20" @blur="save" />
</template>
