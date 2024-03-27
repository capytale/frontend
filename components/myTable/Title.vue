<script setup>
const props = defineProps({
  title: String,
  nid: String,
  player: String,
  whoami: String,
  required: true
})

const editUrl = function (nid) {
  return `/web/node/${nid}/edit`
}

</script>

<template>
  <div class="group">
    <a :href="player" class="underline text-blue-700">{{ title }}</a>
    <a v-if="whoami != 'ap'":href="editUrl(nid)" class="px-2 text-gray-100 group-hover:text-gray-600">
      <font-awesome-icon icon="fa-solid fa-cog" />
    </a>
  </div>
</template>

