<script setup lang="ts">
import { timeElapsed } from '~/utils/format';

const props = defineProps < { data: { changed: number | string } } > ()

</script>

<template>
  <div>
    <span class='whitespace-nowrap'>Il y a {{ timeElapsed(data.changed * 1000) }}</span>
  </div>
</template>
