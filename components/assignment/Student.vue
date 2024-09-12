<script setup>
const props = defineProps({
    data: Object,
    required: true
})

</script>

<template>
    <a :href="data.player" class="clickable">
        {{ data.fullname }}
    </a>
</template>
