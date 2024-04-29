<script setup>
const props = defineProps({
  code: String,
  mode: String,
  tr_beg: String,
  tr_end: String,
  required: true
})
</script>

<template>
  <div class="flex flex-wrap align-items-center gap-2">
  <MyTableCode :code="code" />
  <MyTableMode :mode="mode" :tr_beg="tr_beg" :tr_end="tr_end" />
    </div>
</template>

