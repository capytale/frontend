<script setup>
const props = defineProps({
  data: Object,
})

const playerUrl = function (nid) {
  const mode = props.data.isSa ? 'assignment' : 'create'
  return `/web/c-act/n/${props.data.nid}/play/${mode}`
}
const editUrl = function (nid) {
  return `/web/node/${props.data.nid}/edit`
}

</script>

<template>
  <div class="group parent">
    <a :href="playerUrl(data.nid)" >{{ data.title }}</a>
    <a v-if="!props.data.isSa" :href="editUrl(nid)" class="px-2 cog" v-tooltip.top="{ value: 'Modifier les paramètres', showDelay: 400, hideDelay: 0 }"
      aria-label="Modifier les paramètres">
      <i class="pi pi-cog"></i>
    </a>
  </div>
</template>


<style scoped>
.cog {
  display: none;
}
.parent:hover .cog {
  display: inline;
}
</style>
