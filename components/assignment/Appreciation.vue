<script setup>
import { richContentToPlainText } from '~/utils/sanitization';
import { useToast } from "primevue/usetoast";
const toast = useToast();

const my = useMyStore()

const props = defineProps({
  data: Object,
  required: true
})

const divRef = ref()
const value = computed(() => richContentToPlainText(props.data.appreciation))

const save = () => {
  const appr = divRef.value.innerText
  my.saveAppr(props.data.sa_nid, appr)

  // TODO : faire en fonction du retour de la requête
  const response = { ok: true }
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Appréciation enregistrée ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec enregistrelent de l\'appréciation : ', detail: "nid = " });
  }
}
</script>

<template>
  <!-- <Textarea v-model="value" rows="2" cols="20" @blur="save" autoResize class="w-full h-full" /> -->
  <div contenteditable="true" @blur="save" ref="divRef" class="editable">
    {{ value }}
  </div>
</template>

<style scoped>
.editable {
  border: 1px solid #ccc;
  padding: 5px;
  min-height: 50px;
  border-radius: 5px;
}
</style>
