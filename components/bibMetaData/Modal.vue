<script setup lang="ts">
import Form from './Form.vue'

const model = defineModel<
  { nid: number, title: string } | undefined
>()

const visible = ref(false);

// le formulaire est visible dès qu'une activité est sélectionnée via le model
watch(model, (m) => {
  visible.value = m != null;
})

// Dès que le formulaire est visible, on récupère les métadonnées de l'activité
watch(visible, (v) => {
  if (!v) {
    model.value = undefined;
  }
});


</script>

<template>
  <Dialog v-model:visible="visible" :header="model?.title" modal :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }"
    :style="{ width: '75%' }" maximizable>
    <Form v-model="model" />
  </Dialog>
</template>

