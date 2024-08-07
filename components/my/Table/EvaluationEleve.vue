<script setup>
const props = defineProps({
  data: Object,
})
const visible = ref(false);
const toggle = (event) => {
  visible.value = !visible.value;
};
</script>

<template>
  <Button v-if="data.evalu || data.appre" :label="data.evalu" severity="secondary" text @click="toggle"
    class="p-0 evaluation" v-tooltip.top="{ value: 'Voir l\'évaluation de ' + data.boss, showDelay: 300, hideDelay: 0 }">
    <template #icon>
      <i class="pi pi-search ml-2" style="font-size: 1.2rem"></i>
    </template>
  </Button>
  <template v-else>
    <span v-tooltip.top="{ value: 'Pas encore évalué', showDelay: 400, hideDelay: 0 }">...</span>
  </template>


  <Dialog v-model:visible="visible" :header="'Évalué par ' + data.boss" modal
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" :style="{ width: '50%' }">
    <Fieldset legend="Évaluation" class="m-4">
      <p class="m-0">{{ data.evalu }}</p>
    </Fieldset>
    <Fieldset legend="Appréciation" class="m-4">
      <p class="m-0">{{ data.appre }}</p>
    </Fieldset>
  </Dialog>
</template>

<style>
.evaluation .p-button-label {
  /* font-size: smaller; */
}

.evaluation {
  flex-direction: row-reverse;
}
</style>
