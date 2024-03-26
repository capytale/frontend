<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';

const files = useFiles()

const tsToSt = function (ts) {
  const event = new Date(ts * 1000);
  return event.toLocaleString('fr-FR');
}
</script>

<template>
  <DataTable :value="files" removableSort stripedRows tableStyle="min-width: 50rem">

    <template #header> <span class="text-xl text-900 font-bold">Mes Activités</span> </template>

    <Column field="title" header="Titre"></Column>
    <Column field="changed" header="Denrnière modif." sortable>
        <template #body="slotProps">
        <Tag :value="tsToSt(slotProps.data.changed)" severity="secondary"></Tag>
        </template>
    </Column>
    <Column field="views_total" header="Vues" sortable>
        <template #body="slotProps">
        <Badge :value="slotProps.data.views_total + (slotProps.data.views_hidden >0 ? '+':'')"></Badge>
        </template>
    </Column>

    <template #footer> {{ files ? files.length : 0 }} activités. </template>

  </DataTable>
</template>
