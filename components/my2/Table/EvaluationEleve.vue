<script setup>
const props = defineProps({
  boss: String,
  whoami: String,
  evalu: String,
  appre: String,
  required: true
})
const visible = ref(false);
const toggle = (event) => {
  visible.value = !visible.value;
};
</script>

<template>
  <Button v-if="evalu.length + appre.length > 0" :label="evalu" severity="secondary" text
    @click="toggle" class="p-0 evaluation" v-tooltip.top="{ value: 'Voir l\'évaluation de '+boss, showDelay: 300, hideDelay: 0 }">
    <template #icon>
           <i class="pi pi-search ml-2" style="font-size: 1.2rem"></i>
        </template>
  </Button>    
  <template v-else>
    <span v-tooltip.top="{ value: 'Pas encore évalué', showDelay: 400, hideDelay: 0 }">...</span>
  </template>

  <Dialog v-model:visible="visible" :header="'Évalué par ' + boss" modal
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" :style="{ width: '50%' }">
    <Fieldset legend="Évaluation" class="m-4">
      <p class="m-0">{{ evalu }}</p>
    </Fieldset>
    <Fieldset legend="Appréciation" class="m-4">
      <p class="m-0">{{ appre }}</p>
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