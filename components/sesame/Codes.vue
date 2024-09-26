<script setup>
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";
import { FilterMatchMode } from '@primevue/core/api';

const props = defineProps({
  codelist: Object,
  authenticated: Boolean,
})

const delCode = (code) => {
  var idx = props.codelist.findIndex((x) => { return x.code === code })
  props.codelist.splice(idx, 1)
  sesameApi.deleteCode(code)
}
const addDialog = ref(false);
const openNew = () => {
  addDialog.value = true;
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  classe: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <template v-if="!props.authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir la liste des codes Sésame valides.</div>
  </template>
  <template v-else>
    <Card class="my-4">
      <template #title>Mes Codes Sésame</template>
      <template #content>
        <DataTable v-model:filters="filters" :value="props.codelist" sortField="exp" :sortOrder="-1" filterDisplay="row"
          :globalFilterFields="['classe']" tableStyle="min-width: 50rem">
          <template #header>
            <Toolbar>
              <template #start>
                <Button label="Créer un nouveau code" icon="pi pi-plus" class="mr-2" @click="openNew" />
              </template>
              <template #end>
                <IconField>
                  <InputIcon> <i class="pi pi-search" /> </InputIcon>
                  <InputText v-model="filters['classe'].value" placeholder="Filtrer par classe" />
                </IconField>
              </template>
            </Toolbar>
          </template>
          <Column field="code" header="Code Sésame"></Column>
          <Column field="require_mail" header=""></Column>
          <Column field="classe" sortable header="Classe"> </Column>
          <Column field="count" sortable header="Comptes disponibles"></Column>
          <Column field="exp" sortable header="Date d'expiration"></Column>
          <Column field="code">
            <template #body="p">
              <i @click="delCode(p.data.code)" class="pi pi-trash text-red-500 cursor-pointer" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </template>

  <Dialog v-model:visible="addDialog" :style="{ width: '750px' }" header="Créer un code Sésame" :modal="true">
    <SesameCreateCode :authenticated="authenticated" :codelist="codelist" @closeSesameForm="addDialog = false" />
  </Dialog>
</template>
