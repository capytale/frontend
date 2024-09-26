<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const props = defineProps({
  data: Object,
})

const value = ref(props.data.firstname)

const save = () => {
  my.saveEval(props.data.sa_nid, value)
  const response = { ok: true } // TODO 
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Évaluation enregistrée', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec enregistrelent de l\'évaluation : ', detail: "nid = " });
  }
}

</script>

<template>
  <div class="flex flex-row gap-2">
    <InputText type="text" v-model="value" @blur="save" />
  </div>
</template>
