<script setup lang="ts">
import { useActivityTypesList } from "~/composables/activityTypes/list";

const atl = useActivityTypesList();

const props = defineProps<{ data: { type: string } }>();

const dispData = computed<{ loading: boolean, name?: string, icon?: string }>(() => {
  const typeInfo = atl.getTypeInfo(props.data.type);
  if (typeInfo == null) {
    return {
      loading: true,
    }

  } else {
    return {
      name: typeInfo.name,
      icon: typeInfo.icon.path,
      loading: false,
    }
  }
})

</script>

<template>
  <div class="aspect-square w-12 relative">
    <img v-if="!dispData.loading" :src="dispData.icon" class="w-full h-full text-transparent"
      v-tooltip.top="{ value: dispData.name, showDelay: 400, hideDelay: 0 }"
      :alt="'Activité' + props.data.type">
    <Skeleton v-else height="100%" />
  </div>
</template>
