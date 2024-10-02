<script setup lang="ts">
import { type Report } from "~/composables/archiveBuilder/jobStore";

const p = defineProps<{
    jobItem: Report;
}>();

function getSeverity(): string {
    switch (p.jobItem.status) {
        case 'error':
            return 'error';
        case 'done':
            return 'success';
        case 'unsupported':
            return 'warning';
        case 'pending':
            return 'secondary';
        case 'started':
            return 'info';
        default:
            return 'info';
    }
}

function getMessage(): string {
    if (p.jobItem.title == null) return '…';
    let label = p.jobItem.title;
    if (p.jobItem.status === 'error') label += ' (erreur)';
    else if (p.jobItem.status === 'unsupported') label += ' (non supporté)';
    else if (p.jobItem.status === 'forbidden') label += ' (accès interdit)';
    return label;
}
</script>

<template>
    <Message :severity="getSeverity()">{{ getMessage() }}</Message>
</template>