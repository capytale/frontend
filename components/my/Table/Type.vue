<script setup>

const my = useMyStore()
const typeIcon = (id) => {
  const obj = my.types.find(o => o.id === id)
  return obj ? obj.icon.path : ''
}

const props = defineProps({
  data: Object,
})

</script>

<template>
  <img :src="typeIcon(props.data.type)" class="w-12" v-tooltip.top="{ value: props.data.type, showDelay: 400, hideDelay: 0 }" 
    type="text" placeholder="Right" :alt="'Activité' + props.data.type">
</template>

