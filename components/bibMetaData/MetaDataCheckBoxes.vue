<script setup lang="ts">
const model = defineModel<string[]>();

const p = defineProps<{
  title: string;
  invalid: boolean;
  codes: readonly string[];
  getLabel: (code: string) => string;
}>();

</script>

<template>
  <div>
    <span class="font-semibold w-6rem" :class="{ invalid: p.invalid }">{{ p.title }} <span class="invalid">*</span></span>
    <div v-for="code of codes" :key="code" class="flex align-items-center">
      <Checkbox v-model="model" :inputId="code" name="niveau" :value="code" />
      <label :for="code">{{ getLabel(code) }}</label>
    </div>
  </div>
</template>

<style scoped>
.invalid {
  color: var(--p-red-500);
}
</style>
