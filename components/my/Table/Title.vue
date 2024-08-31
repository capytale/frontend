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
    
    <Button v-if="!props.data.isSa" icon="pi pi-cog" class="px-2 cog" @click="visible = true"
      v-tooltip.top="{ value: 'Modifier les paramètres', showDelay: 400, hideDelay: 0 }"
      aria-label="Modifier les paramètres" text :dt="{ 'padding.y': '0' }" />
    <MyActivityEdit v-model="visible" :data="props.data" />
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
  color: var(--p-button-text-primary-color);
  text-decoration: underline;
}

.clickable:hover {
  color: var(--p-button-text-hover-color);
}
</style>
