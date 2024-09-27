<script setup lang="ts">
import { type JobStore, type Report } from "~/composables/archiveBuilder/jobStore";

const p = defineProps<{
    jobStore: JobStore;
}>();

const progressValue = computed<['indeterminate' | 'determinate', number | undefined]>(() => {
    if ((p.jobStore.total == null)
        || (p.jobStore.total <= 0)
        || (p.jobStore.current == null)
        || (p.jobStore.current < 0)
    ) {
        return [
            'indeterminate',
            undefined
        ];
    }
    const current = p.jobStore.log[p.jobStore.current];
    if (current == null) return [
        'determinate',
        Math.floor((p.jobStore.current / p.jobStore.total) * 100)
    ];
    return [
        'determinate',
        Math.floor(((p.jobStore.current + getStatusDelta(current.status)) / p.jobStore.total) * 100)
    ];
});

function getStatusDelta(status: Report['status']): number {
    if (status === 'pending') return 0.1;
    if (status === 'started') return 0.5;
    if (status === 'done') return 1;
    if (status === 'error') return 1;
    return 0;
}



const lastRef = shallowRef<HTMLDivElement | null>(null);
function onRef(el: Element | null) {
    lastRef.value = el as HTMLDivElement;
}

watchEffect(() => {
    if ((p.jobStore.current != null) && (lastRef.value != null)) {
        nextTick(() => {
            if (lastRef.value != null) {
                lastRef.value.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
})

function getCancelLabel(): string {
    if (p.jobStore.aborted) return 'Annulation';
    return 'Annuler';
}

</script>

<template>
    <div class="h-52 w-full mt-6 p-2 rounded-lg" style="border: 1px solid; background: var(--p-content-background);">
        <ProgressBar class="mb-2" :value="progressValue[1]" :mode="progressValue[0]" />
        <div class="h-24 overflow-scroll mb-2">
            <template v-for="(item, k) of p.jobStore.log" :key="k">
                <div :ref="(el) => { if (k === p.jobStore.log.length - 1) onRef(el as Element) }">
                    <ArchiveBuilderJobItem :jobItem="item" />
                </div>
            </template>
        </div>
        <Button @click="p.jobStore.cancelJob" :disabled="p.jobStore.aborted">{{ getCancelLabel() }}</Button>
    </div>
</template>

<style scoped></style>