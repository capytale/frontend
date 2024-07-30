<script setup>
import { typeIcon } from '~/utils/format';
const my = useMyStore()

const props = defineProps({
  data: Object,
})

</script>

<template>
  <img :src="typeIcon(props.data.type, my)" class="w-12" v-tooltip.top="{ value: props.data.type, showDelay: 400, hideDelay: 0 }" 
    type="text" placeholder="Right" :alt="'Activité' + props.data.type">
</template>

