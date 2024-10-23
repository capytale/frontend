<script setup>
const activites = useActivitiesStore()
const toast = useToast();
const props = defineProps({
  data: Object,
})

const title = ref(props.data.title + ' (copie)')
const invalidTitle = ref(false)
const emit = defineEmits(['closeCloningForm'])

async function handleSubmit() {
  if (title.value === "") {
    invalidTitle.value = true;
    return;
  }
  invalidTitle.value = false;
  console.log("handleSubmit:", title.value)
  try {
    await activites.cloneActivity(props.data.nid, title.value)
    emit('closeCloningForm')
  }
  catch (e) {
    toast.add({ severity: 'error', summary: 'Échec du clonage : ', detail: `nid = ${props.data.nid} - ${e}` });
  }
}
</script>

<template>
  <div v-focustrap class="flex flex-col gap-2 mb-4">
    <label for="title" class="font-semibold w-24">Titre</label>
    <InputText v-model="title" id="title" class="flex-auto" autocomplete="off" autofocus :invalid="invalidTitle" />
    <small v-if="invalidTitle" id="title-help" class="text-red-500">Le titre ne peut pas être vide</small>
  </div>
  <div class="flex justify-end gap-2">
    <Button type="button" label="Annuler" severity="secondary" @click="$emit('closeCloningForm')"></Button>
    <Button type="button" label="Enregistrer" @click="handleSubmit()"></Button>
  </div>
</template>
