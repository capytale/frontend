<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import { useLocalStore } from '@/stores/local';
import { useUserStore } from '@/stores/user';
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

// Charge les données locales ou distantes
const local = useLocalStore();
local.getAsyncData()
const user = useUserStore();
user.getAsyncUser()

const selectedNid = ref();
const showToolbar = ref(false);
const oneCheckbox = ref(false);

const onRowSelect = function () {
  showToolbar.value = true
  oneCheckbox.value = selectedNid.value.length == 1
}
const onRowSelectAll = function () {
  showToolbar.value = true
  oneCheckbox.value = local.data.length == 1
  console.log(local.data.length)
}
const onRowUnselectAll = function () {
  showToolbar.value = false
  oneCheckbox.value = false
}
const onRowUnselect = function () {
  showToolbar.value = selectedNid.value.length > 0
  oneCheckbox.value = selectedNid.value.length == 1
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  changed: { value: null, matchMode: FilterMatchMode.IN },
});
</script>

<template>
  <Card class="flex-1">
    <template #title>
      <h1>
        Mes activités
        <a href="/actiList" class="p-2" aria-label="maximize"> <i class="pi pi-window-maximize"></i> </a>
      </h1>
    </template>

    <template #content>

      <DataTable v-model:filters="filters" v-model:selection="selectedNid" selectionMode="multiple" :value="local.data"
        dataKey="nid" sortField="changed" tableStyle="min-width: 50rem" :sortOrder="-1" paginator :rows="20"
        :rowsPerPageOptions="[10, 20, 50, 100]" @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()"
        @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()" :globalFilterFields="['title', 'changed']">

        <template #header>
          <Toolbar>
            <template #start v-if="showToolbar">
              <Button v-if="oneCheckbox" label="Paramètres" icon="pi pi-cog" class="mr-2" severity="secondary" />
              <Button label="Supprimer" icon="pi pi-trash" class="mr-2" severity="danger" />
              <Button label="Étiqueter" icon="pi pi-tags" class="mr-2" severity="secondary" />
              <Button label="Télécharger" icon="pi pi-download" class="mr-2" severity="secondary" />
              <Button label="CSV" icon="pi pi-file-excel" class="mr-2" severity="secondary" />
            </template>

            <template #end>
              <div class="flex justify-content-end">
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Rechercher" />
                </IconField>
              </div>
            </template>

          </Toolbar>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <Column field="icon" header="Type" sortable>
          <template #body="p">
            <MyTableIcon :icon="p.data.icon" :type="p.data.type" />
          </template>
        </Column>

        <Column field="title" header="Titre" sortable>
          <template #body="p">
            <MyTableTitle :title="p.data.title" :nid="p.data.nid" :whoami="p.data.whoami" />
          </template>
        </Column>

        <Column field="appr" header="Évaluation">
          <template #body="p">
            <MyTableEvalApprViews :views_total="p.data.views_total" :boss="p.data.boss" :whoami="p.data.whoami"
              :evalu="p.data.evaluation" :appre="p.data.appreciation" />
          </template>
        </Column>

        <Column field="changed" header="Dernière modif." sortable>
          <template #body="p">
            <MyTableChanged :changed="p.data.changed" />
          </template>
        </Column>

        <Column field="mode" header="Partage">
          <template #body="p">
            <MyTableCodeMode :code="p.data.code" :mode="p.data.mode" :tr_beg="p.data.tr_beg" :tr_end="p.data.tr_end" />
          </template>
        </Column>

        <Column field="plus" header="">
          <template #body="p">
            <MyTableMore :type="p.data.type" :icon="p.data.icon" />
          </template>
        </Column>

      </DataTable>
    </template>
  </Card>
</template>
