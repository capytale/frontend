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
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Création de l'archive zip</h2>
        </div>
        <div class="mt-4">
            <p>{{ title }}</p>
            <ul class="h-24 overflow-scroll mb-2">
                <li v-for="item in dialogRef?.data.notExportable" :key="item.nid">
                    {{ item.title }} ({{ atl.getTypeInfo(item.type).name }})
                </li>
            </ul>
        </div>
        <div>Voulez-vous exporter les autres éléments sélectionnés ?</div>
        <Button label="Continuer" icon="pi pi-check" @click="() => dialogRef?.close(true)" />
        <Button label="Annuler" icon="pi pi-check" @click="() => dialogRef?.close(false)" />
    </div>

</template>