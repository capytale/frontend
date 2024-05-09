<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useLocalStore } from '@/stores/local';
import { useUserStore } from '@/stores/user';
import { FilterMatchMode } from 'primevue/api';

const confirm = useConfirm();
const toast = useToast();

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
}
const onRowUnselectAll = function () {
  showToolbar.value = false
  oneCheckbox.value = false
}
const onRowUnselect = function () {
  showToolbar.value = selectedNid.value.length > 0
  oneCheckbox.value = selectedNid.value.length == 1
}

const handleEdit = function () {
  const nid = selectedNid.value[0].nid
  const url = `/web/node/${nid}/edit`
  window.location.href = url
}

const handleDelete = function () {
  confirm.require({
    message: 'Vous vous apprêtez à supprimer DÉFINITIVEMENT.',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Annuler',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptLabel: 'Supprimer',
    acceptClass: 'p-button-danger',
    accept: () => {
      // for (const el of selectedNid.value) {
      //   console.log(el.nid)
      // }
      // const response = await my.deleteActivity(props.nid)
      const response = {}
      if (response.ok) {
        toast.add({ severity: 'success', summary: 'Suppression effectuée : ', life: 2000 });
      } else {
        toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: "nid = " });
      }
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Annulation', life: 3000 });
    }
  });
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  changed: { value: null, matchMode: FilterMatchMode.IN },
});
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast position="bottom-right"/>
  <Card class="flex-1">

    <template #content>

      <DataTable v-model:filters="filters" v-model:selection="selectedNid" selectionMode="multiple" :value="local.data"
        dataKey="nid" sortField="changed" tableStyle="min-width: 50rem" :sortOrder="-1" paginator :rows="20"
        :rowsPerPageOptions="[10, 20, 50, 100]" @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()"
        @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()" :globalFilterFields="['title', 'changed']"
        class="my-card">

        <template #header>
          <Toolbar>
            <template #start v-if="!showToolbar">
              <h2 style="margin:0px"> Mes activités </h2>
            </template>
            <template #start v-if="showToolbar">
              <Button v-if="oneCheckbox" label="Paramètres" @click="handleEdit()" icon="pi pi-cog" class="mr-2"
                severity="secondary" />
              <Button label="Supprimer" @click="handleDelete()" icon="pi pi-trash" class="mr-2" severity="danger" />
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

        <Column field="type" header="Type" sortable>
          <template #body="p">
            <MyTableType :icon="p.data.icon" :type="p.data.type" />
          </template>
        </Column>

        <Column field="title" header="Titre" style="width:50rem; max-width:50rem; overflow:hidden" sortable>
          <template #body="p">
            <MyTableTitle :title="p.data.title" :nid="p.data.nid" :whoami="p.data.whoami" />
          </template>u
        </Column>

        <Column field="evaluation" header="Évaluation" style="max-width:10rem">
          <template #body="p">
            <MyTableEvaluation :views_total="p.data.views_total" :boss="p.data.boss" :whoami="p.data.whoami"
              :evalu="p.data.evaluation" :appre="p.data.appreciation" />
          </template>
        </Column>

        <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
          <template #body="p">
            <MyTableChanged :changed="p.data.changed" />
          </template>
        </Column>

        <Column field="code" header="Partage" style="min-width: 13rem">
          <template #body="p">
            <MyTableShare :code="p.data.code" :mode="p.data.mode" :tr_beg="p.data.tr_beg" :tr_end="p.data.tr_end" />
          </template>
        </Column>

        <Column field="bib" header="Bib." style="">
          <template #body="p">
            <MyTableBib :nid="p.data.nid" :shared="p.data.status_shared" :web="p.data.status_web" />
          </template>
        </Column>

        <Column field="more" header="">
          <template #body="p">
            <MyTableMore :nid="p.data.nid" :whoami="p.data.whoami" />
          </template>
        </Column>

      </DataTable>
    </template>
  </Card>
</template>


<style>
.p-datatable-hoverable-rows .p-selectable-row {
  cursor: default;
}
</style>
