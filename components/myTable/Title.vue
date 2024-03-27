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
    <a :href="playerUrl(nid)" class="underline text-blue-700">{{ title }}</a>
    <a v-if="whoami != 'ap'":href="editUrl(nid)" class="px-2 text-gray-100 group-hover:text-gray-600" v-tooltip="'Modifier les paramètres'" type="text" placeholder="Right">
      <font-awesome-icon icon="fa-solid fa-cog" />
    </a>
  </div>
</template>

