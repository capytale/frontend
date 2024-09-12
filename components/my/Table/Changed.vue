<script setup lang="ts">
import { timeElapsed } from '~/utils/format';

const props = defineProps<{data: {changed: number|string}}>()

</script>

<template>
  <div>
    <i>Il y a {{ timeElapsed(data.changed * 1000) }}</i>
  </div>
</template>

