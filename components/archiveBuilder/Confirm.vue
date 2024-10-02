<script setup lang="ts">
import { inject, onMounted } from "vue";
import { useActivityTypesList } from "~/composables/activityTypes/list"


const dialogRef = inject<Ref<{
    data: {
        exportable: { nid: number, type: string, title: string }[],
        notExportable: { nid: number, type: string, title: string }[],
    },
    close: (d: any) => void,
}>>('dialogRef');

const atl = useActivityTypesList();

const title = computed(() => {
    if (dialogRef == null) return '';
    return dialogRef.value.data.notExportable.length > 1
        ? 'Les éléments sélectionnés suivants sont d\'un type qui n\'est pas exportable :'
        : 'L\'activité suivante est d\'un type qui n\'est pas exportable :';
});

</script>

<template>
    <div>
        <div class="mt-4">
            <p>{{ title }}</p>
            <ul class="h-20 overflow-scroll my-4 p-2 border-2">
                <li v-for="item in dialogRef?.data.notExportable" :key="item.nid">
                    {{ item.title }} ({{ atl.getTypeInfo(item.type).name }})
                </li>
            </ul>
        </div>
        <div>Voulez-vous exporter les autres éléments sélectionnés ?</div>
        <div class="flex justify-end gap-2 mt-4">
            <Button label="Annuler" @click="() => dialogRef?.close(false)" severity="secondary" />
            <Button label="Continuer" @click="() => dialogRef?.close(true)" />
        </div>
    </div>

</template>