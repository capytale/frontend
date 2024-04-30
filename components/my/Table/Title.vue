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
  <div class="group">
    <a :href="playerUrl(nid)" >{{ title }}</a>
    <a v-if="whoami != 'ap'":href="editUrl(nid)" class="px-2" v-tooltip="'Modifier les paramètres'" type="text" placeholder="Right" aria-label="Modifier les paramètres">
      <i class="pi pi-cog"></i>
    </a>
  </div>
</template>

