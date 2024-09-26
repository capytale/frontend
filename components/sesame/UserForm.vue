<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const props = defineProps({
  data: Object,
  field: String,
})

const value = ref(props.data[props.field])

const save = () => {
  // sesame.updateUser({ uid, [props.field]: val })
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Évaluation enregistrée', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec enregistrelent de l\'évaluation : ', detail: "nid = " });
  }
}

</script>

<template>
  <div class="flex flex-row gap-2">
    <InputText type="text" v-model="value" @blur="save" class="smallit" />
  </div>
</template>

<style>
.smallit {
  width: 7em;
}
</style>
