<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

const { data: user, pending: usrpnd, error: usrerr, status: usrstts } = await fetchCurrentUser()
const isTeacher = user.value.roles.includes('teacher')

import { useMyStore } from '@/stores/my'
const my = useMyStore()
my.getActivities()


const selectedTags = ref(null)
const selectedFolder = ref(null)
const opTags = ref();
const opFolders = ref();
const tagsToggle = (event) => { opTags.value.toggle(event); }
const foldersToggle = (event) => { opFolders.value.toggle(event); }

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

const confirm = useConfirm();
const toast = useToast();
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
      // my.deleteActivity(el.nid)
      my.deleteActivity(selectedNid.value)
      // }
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
const handleMoveToFolderMultiple = function () {
  const folder = Object.keys(selectedFolder.value)[0]
  console.log("folder: ", folder)
  my.moveActivities(selectedNid.value, folder)
}
const handleAddTagMultiple = function () {
  const tags = Object.keys(selectedTags.value)
  console.log("tags: ", tags)
  my.tagActivities(selectedNid.value, tags)
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  // changed: { value: null, matchMode: FilterMatchMode.IN },
});
</script>

<template>
  <Card class="flex-1">

    <template #content>

      <div v-if="my.activities.pending">
        <p>Chargement des actvités...</p>
      </div>
      <div v-else-if="my.activities.status == 'error'">
        <p>Impossible de charger les activités.</p>
      </div>
      <DataTable v-else v-model:filters="filters" v-model:selection="selectedNid" selectionMode="multiple"
        :value="my.activities.data" dataKey="nid" sortField="changed" tableStyle="min-width: 50rem" :sortOrder="-1"
        paginator :rows="20" :rowsPerPageOptions="[10, 20, 50, 100]" @rowSelect="onRowSelect()"
        @rowUnselect="onRowUnselect()" @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()"
        :globalFilterFields="['title', 'changed']" class="my-card">

        <template #header>
          <Toolbar>
            <template #start v-if="!showToolbar">
              <h2 style="margin:0px"> Mes activités </h2>
            </template>
            <template #start v-if="showToolbar">
              <Button v-if="oneCheckbox" v-tooltip.bottom="'Paramètres'" @click="handleEdit()" icon="pi pi-cog"
                class="mr-2" severity="secondary" />
              <Button v-tooltip.bottom="'Supprimer'" @click="handleDelete()" icon="pi pi-trash" class="mr-2"
                severity="danger" />
              <div class="card flex justify-content-center">
                <Button v-tooltip.bottom="'Étiqueter'" icon="pi pi-tags" class="mr-2" severity="secondary"
                  @click="tagsToggle" />
                <OverlayPanel ref="opTags">
                  <div class="gap-3 w-25rem">
                    <Tree id="tags" v-model:selectionKeys="selectedTags" :value="my.tags.data" selectionMode="multiple"
                      class="w-full md:w-30rem scroll">
                      <template #default="slotProps">
                        <i class="pi pi-tag" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
                      </template>
                    </Tree>
                    <Button v-if="selectedTags && Object.keys(selectedTags).length" type="button" label="Étiqueter"
                      class="w-full" @click="handleAddTagMultiple" />
                  </div>
                </OverlayPanel>
              </div>
              <div class="card flex justify-content-center">
                <Button v-tooltip.bottom="'Déplacer'" icon="pi pi-folder-open" class="mr-2" severity="secondary"
                  @click="foldersToggle" />
                <OverlayPanel ref="opFolders">
                  <div class="gap-3 w-25rem">
                    <Tree id="folder" v-model:selectionKeys="selectedFolder" :value="my.tags.data"
                      selectionMode="single" class="w-full md:w-30rem scroll">
                      <template #default="slotProps">
                        <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
                      </template>
                    </Tree>
                    <Button v-if="selectedFolder && Object.keys(selectedFolder).length" type="button" label="Déplacer"
                      class="w-full" @click="handleMoveToFolderMultiple" />
                  </div>
                </OverlayPanel>
              </div>
              <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2" severity="secondary" />
              <Button v-tooltip.bottom="'CSV'" icon="pi pi-file-excel" class="mr-2" severity="secondary" />
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

        <Column v-if="isTeacher" field="title" header="Titre" style="width:50rem; max-width:50rem; overflow:hidden"
          sortable>
          <template #body="p">
            <MyTableTitle :title="p.data.title" :nid="p.data.nid" :whoami="p.data.whoami" />
          </template>u
        </Column>
        <Column v-else field="title" header="Titre" style="width:40rem; max-width:40rem; overflow:hidden" sortable>
          <template #body="p">
            <MyTableTitle :title="p.data.title" :nid="p.data.nid" :whoami="p.data.whoami" />
          </template>u
        </Column>

        <Column v-if="isTeacher" field="evaluation" header="Évaluation" style="max-width:10rem">
          <template #body="p">
            <MyTableEvaluation :views_total="p.data.views_total" :boss="p.data.boss" :whoami="p.data.whoami"
              :evalu="p.data.evaluation" :appre="p.data.appreciation" :isTeacher="isTeacher" />
          </template>
        </Column>
        <Column v-else field="evaluation" header="Évaluation" style="max-width:20rem">
          <template #body="p">
            <MyTableEvaluation :views_total="p.data.views_total" :boss="p.data.boss" :whoami="p.data.whoami"
              :evalu="p.data.evaluation" :appre="p.data.appreciation" :isTeacher="isTeacher" />
          </template>
        </Column>

        <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
          <template #body="p">
            <MyTableChanged :changed="p.data.changed" />
          </template>
        </Column>

        <Column field="code" header="Partage" style="min-width: 13rem">
          <template #body="p">
            <MyTableShare :code="p.data.code" :mode="p.data.mode" :boss="p.data.boss" :whoami="p.data.whoami"
              :wf="p.data.workflow" :isTeacher="isTeacher" :tr_beg="p.data.tr_beg" :tr_end="p.data.tr_end" />
          </template>
        </Column>

        <Column v-if="isTeacher" field="bib" header="Bib." style="">
          <template #body="p">
            <MyTableBib :nid="p.data.nid" :shared="p.data.status_shared" :web="p.data.status_web" />
          </template>
        </Column>

        <Column field="tags" header="Étiquettes" style="">
          <template #body="p">
            <MyTableTags :nid="p.data.nid" :tags="p.data.tags" />
          </template>
        </Column>

        <Column field="more" header="">
          <template #body="p">
            <MyTableMore :nid="p.data.nid" :whoami="p.data.whoami" :isTeacher="isTeacher" />
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

.scroll {
  height: 50%;
  overflow: scroll;
}
</style>
