<script setup>
const props = defineProps({
  changed: String,
  required: true
})

const ts2local = function (ts) {
  var options_old = {
    year: "2-digit",
    month: "short",
    day: "numeric",
  };
  var options_recent = {
    month: "short",
    day: "numeric",
    hour: 'numeric',
    minute: '2-digit'
  };
  var options_very_old = {
    year: "numeric",
    month: "short",
  };
  let now = new Date()
  if (now.getTime() / 1000 - ts < 60 * 60 * 24) {
    return new Date(ts * 1000).toLocaleString('fr-FR', options_recent)
  }
  if (now.getFullYear == Date(ts * 1000).getFullYear) {
    return new Date(ts * 1000).toLocaleString('fr-FR', options_old)
  }
  return new Date(ts * 1000).toLocaleString('fr-FR', options_very_old)
}

</script>

<template>
  <Tag :value="ts2local(changed)" severity="secondary"></Tag>
</template>

