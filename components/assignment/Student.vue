<script setup>
const props = defineProps({
    data: Object,
    required: true
})

</script>

<template>
    <a :href="data.player">
        {{ data.nom }} {{ data.prenom }}
    </a>
</template>
