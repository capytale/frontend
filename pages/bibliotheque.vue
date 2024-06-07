<script setup>
import { useMyStore } from '@/stores/my'
const my = useMyStore()

my.getBib()
console.log("n=bib", my.bib.data)

</script>

<template>
  <div v-if="my.bib.pending">
    <p>Chargement des actvités...</p>
  </div>
  <div v-else-if="my.bib.status == 'error'">
    <p>Impossible de charger les activités.</p>
  </div>
  <template v-else>
    <h1>Bibliothèque</h1>

    <DataTable :value="my.bib.data" paginator :rows="20" :rowsPerPageOptions="[10, 20, 50]"
      tableStyle="min-width: 50rem">


      <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
        <template #body="p">
          <MyTableType :icon="p.data.icon" :type="p.data.type" />
        </template>
      </Column>

      <Column field="title" header="Titre">
        <template #body="p">
          <a :href="p.data.player_url">{{ p.data.title }}</a>
        </template>
      </Column>

      <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
        <template #body="p">
          <MyTableChanged :changed="p.data.changed" />
        </template>
      </Column>

      <Column field="abstract" header="Description"></Column>
    </DataTable>
  </template>
</template>
