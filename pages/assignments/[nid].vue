<script setup lang="ts">
const $route = useRoute();
definePageMeta({
    validate({ params }) {
        return /^\d+$/.test(params.nid)
    },
})
</script>

<template>
    <div class="mt-4">
        <AssignmentStudentList :nid="$route.params.nid" />
    </div>
</template>