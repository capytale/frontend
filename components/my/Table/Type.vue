<script setup>
import { useActivityTypesList } from "~/composables/activityTypes/list";

const atl = useActivityTypesList();

const props = defineProps({
  data: Object,
})

const dispData = computed(() => {
  return {
    name: atl.getTypeInfo(props.data.type)?.name,
    icon: atl.getTypeInfo(props.data.type)?.icon.path,
  }
})

</script>

<template>
  <img :src="dispData.icon" class="w-12" v-tooltip.top="{ value: dispData.name, showDelay: 400, hideDelay: 0 }"
    type="text" placeholder="Right" :alt="'Activité' + props.data.type">
</template>
