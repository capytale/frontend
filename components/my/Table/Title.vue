<script setup>
const props = defineProps({
  data: Object,
})

const playerUrl = computed(() => {
  const mode = props.data.isSa ? 'assignment' : 'create'
  return `/web/c-act/n/${props.data.nid}/play/${mode}`
})

const visible = ref(false);
</script>

<template>
  <div class="group parent">
    <a :href="playerUrl" class="clickable">{{ data.title }}</a>
    
    <Button v-if="!props.data.isSa" class="pi pi-cog px-2 cog" @click="visible = true"
      v-tooltip.top="{ value: 'Modifier les paramètres', showDelay: 400, hideDelay: 0 }"
      aria-label="Modifier les paramètres" text />
    <Dialog v-model:visible="visible" maximizable modal :header="'&nbsp;'" style="width: 80%; height: 80vh"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" content-class="h-full" dismissableMask>
      <MyActivityEdit :data="props.data" @close="visible = false" />
    </Dialog>
  </div>
</template>


<style scoped>
.cog {
  display: none;
}

.parent:hover .cog {
  display: inline;
}
.clickable {
  cursor: pointer;
  color: var(--p-sky-900);
  text-decoration: underline;
}
</style>
