<script setup>
import { timeElapsed } from '~/utils/format';

const props = defineProps({
  changed: String,
  required: true
})
</script>

<template>
  Il y a {{ timeElapsed(changed *1000 ) }}
</template>

