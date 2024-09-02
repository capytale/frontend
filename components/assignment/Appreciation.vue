<script setup>
import { richContentToPlainText } from '~/utils/sanitization';
import { useToast } from "primevue/usetoast";
const toast = useToast();

const my = useMyStore()

const props = defineProps({
  data: Object,
  required: true
})

const value = ref(richContentToPlainText(props.data.appreciation))
watch(() => props.data.appreciation, () => value.value = richContentToPlainText(props.data.appreciation))

const save = () => {
  my.saveAppr(props.data.sa_nid, value)
  const response = { ok: true} // TODO 
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Appréciation enregistrée', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec enregistrelent de l\'appréciation : ', detail: "nid = " });
  }
}
</script>

<template>
  <Textarea v-model="value" rows="2" cols="20" @blur="save" autoResize />
</template>
