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
console.log(props.data.sa_nid, value)

const save = async () => {
  const appr = divRef.value.innerText
  if (value != appr && !(value == null && appr == "\n")) {
    try {
      await my.saveAppr(props.data.sa_nid, appr)
      toast.add({ severity: 'success', summary: 'Appréciation enregistrée ', life: 2000 });
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Échec enregistrement de l\'appréciation' });
    }
  }
}
</script>

<template>
  <div contenteditable="true" @click.stop @blur="save" ref="divRef" class="editable whitespace-pre-wrap"
    v-tooltip.top="{ value: 'Cliquer pour modifier. Quitter pour enregistrer.', showDelay: 300, hideDelay: 0 }">{{ value
    }}</div>
</template>

<style scoped>
.editable {
  border: 1px solid #ccc;
  padding: 5px;
  min-height: 2rem;
  border-radius: 5px;
}

.editable:empty::before {
  content: "​";
}
</style>
