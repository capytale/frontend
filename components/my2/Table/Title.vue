<script setup>
const props = defineProps({
  title: String,
  nid: String,
  whoami: String,
  required: true
})

const playerUrl = function (nid) {
  const mode = props.whoami == 'ap' ? 'assignment' : 'create'
  return `/web/c-act/n/${nid}/play/${mode}`
}
const editUrl = function (nid) {
  return `/web/node/${nid}/edit`
}

</script>

<template>
  <div class="group parent">
    <a :href="playerUrl(nid)" >{{ title }}</a>
    <a v-if="whoami != 'ap'" :href="editUrl(nid)" class="px-2 cog" v-tooltip.top="{ value: 'Modifier les paramètres', showDelay: 400, hideDelay: 0 }" aria-label="Modifier les paramètres">
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
