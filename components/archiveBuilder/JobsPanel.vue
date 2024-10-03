<script setup lang="ts">
import { usePanelStore } from "~/composables/archiveBuilder/jobStore";

const panelStore = usePanelStore();

{
    let unregister: (() => void) | undefined;

    onMounted(() => {
        unregister = panelStore.registerPanel()
    });

    onBeforeUnmount(() => {
        unregister?.();
    });
}
</script>

<template>
    <div v-if="panelStore.visible" class="fixed bottom-0 right-0 w-96 p-6">
        <ArchiveBuilderJob v-for="(job, k) in panelStore.jobs" :key="k" :jobStore="job" />
    </div>
</template>

<style scoped>
div {
    z-index: 3000;
}
</style>