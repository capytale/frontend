<script setup>
const props = defineProps({
  changed: String,
  required: true
})

const ts2local = function (ts) {
  return new Date(ts * 1000).toLocaleString()
}

</script>

<template>
  <Tag :value="ts2local(changed)" severity="secondary"></Tag>
</template>

