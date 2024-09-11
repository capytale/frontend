<script setup>
const props = defineProps({
    data: Object,
    required: true
})

</script>

<template>
    <a :href="data.player">
        {{ data.fullname }}
    </a>
</template>
