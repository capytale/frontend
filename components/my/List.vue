<script setup>
import { FilterMatchMode } from '@primevue/core/api';

const { data: user, pending: usrpnd, error: usrerr, status: usrstts } = await fetchCurrentUser()
const isTeacher = user.value.roles.includes('teacher')

import { useMyStore } from '@/stores/my'
const my = useMyStore()
const activites = useActivitiesStore()
const tags = useTagsStore()

activites.getActivities()

my.types = await useActivities();
// console.log(my.types);

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
  // oneCheckbox.value = local.data.length == 1
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
    message: `Vous vous apprêtez à supprimer ${selectedNid.value.length} éléments DÉFINITIVEMENT.`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Annuler',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptLabel: 'Supprimer',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await activites.deleteActivity([...selectedNid.value.map((o) => o.nid)])
        toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
      }
      catch (e) {
        toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: `nid = ${selectedNid.value} - ${e}` });
      }
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Annulation', life: 3000 });
    }
  });
}
const handleMoveToFolderMultiple = async () => {
  const folder = Object.keys(selectedFolder.value)[0]
  // console.log("folder: ", folder)
  await activites.moveActivities(selectedNid.value, folder)
}
const handleAddTagMultiple = async () => {
  const tags = Object.keys(selectedTags.value)
  await activites.tagActivities(selectedNid.value, tags)
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// affiche l'icône du type TODO : Déplacer dans utils
const typeIcon = (id) => {
  const obj = my.types.find(o => o.id === id)
  return obj ? obj.icon.path : ''
}

const activeTag = useActiveTagStore()

const getTagName = (tid) => {
  const tag = tags.flatTags.data.find(o => o.id === tid)
  return tag ? tag.label : ''
}

const corbeilleTid = () => {
  return tags.tags.data.find(o => o.label === 'Corbeille').id
}

const myactivities = computed(() => {
  if (activeTag.tid) { // user has selected a tag
    return activites.activities.data.filter(o => {
      if (!o.tags.tids) return false
      // console.log("o: ", o.code, o.tags.tids.split(','), activeTag.tid, o.tags.tids.split(',').includes(activeTag.tid) ? 'true' : 'false')
      return o.tags.tids.split(',').includes(activeTag.tid)
    })
  } else { // no tag selected : show all activities except those in the trash
    return activites.activities.data.filter(o => {
      if (!o.tags.tids) return true
      return !o.tags.tids.split(',').includes(corbeilleTid())
    })
  }
})


</script>

<template>
  <Card class="flex-1">

    <template #content>

      <div v-if="activites.activities.pending">
        <p>Chargement des actvités...</p>
      </div>
      <div v-else-if="activites.activities.status == 'error'">
        <p>Impossible de charger les activités.</p>
      </div>
      <DataTable v-else v-model:filters="filters" v-model:selection="selectedNid" selectionMode="multiple"
        :value="myactivities" dataKey="nid" sortField="changed" tableStyle="min-width: 50rem" :sortOrder="-1" paginator
        :rows="10" :rowsPerPageOptions="[10, 20, 50, 100]" @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()"
        @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()" :globalFilterFields="['title', 'type']"
        class="my-card">

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
                <Popover ref="opTags">
                  <div class="gap-3 w-25rem">
                    <Tree id="tags" v-model:selectionKeys="selectedTags" :value="tags.tags.data" selectionMode="multiple"
                      class="w-full md:w-30rem scroll">
                      <template #default="slotProps">
                        <i class="pi pi-tag" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
                      </template>
                    </Tree>
                    <Button v-if="selectedTags && Object.keys(selectedTags).length" type="button" label="Étiqueter"
                      class="w-full" @click="handleAddTagMultiple" />
                  </div>
                </Popover>
              </div>
              <div class="card flex justify-content-center">
                <Button v-tooltip.bottom="'Déplacer'" icon="pi pi-folder-open" class="mr-2" severity="secondary"
                  @click="foldersToggle" />
                <Popover ref="opFolders">
                  <div class="gap-3 w-25rem">
                    <Tree id="folder" v-model:selectionKeys="selectedFolder" :value="tags.tags.data"
                      selectionMode="single" class="w-full md:w-30rem scroll">
                      <template #default="slotProps">
                        <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
                      </template>
                    </Tree>
                    <Button v-if="selectedFolder && Object.keys(selectedFolder).length" type="button" label="Déplacer"
                      class="w-full" @click="handleMoveToFolderMultiple" />
                  </div>
                </Popover>
              </div>
              <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2" severity="secondary" />
              <Button v-tooltip.bottom="'CSV'" icon="pi pi-file-excel" class="mr-2" severity="secondary" />
            </template>

            <template #end>
              <template v-if="activeTag.tid">
                Filtre par étiquette :
                <Button removable class="removable pr-2 mr-1" text @click="activeTag.activate(null)"
                  v-tooltip.top="{ value: 'Supprimer', showDelay: 400, hideDelay: 0 }">
                  {{ getTagName(activeTag.tid) }}
                  <i class="pi pi-times px-2" style="color:red"></i>
                </Button>
              </template>

              <div class="flex justify-content-end">
                <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id"
                  placeholder="Filter par type" class="w-full md:w-14rem" showClear>
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <img :src="typeIcon(slotProps.value)" class="w-8 mr-3" />
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <img :src="slotProps.option.icon.path" class="w-8 mr-3" />
                      <div>{{ slotProps.option.name }}</div>
                    </div>
                  </template>
                </Select>


                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['title'].value" placeholder="Rechercher dans le titre" />
                </IconField>
              </div>
            </template>

          </Toolbar>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <Column field="type" header="Type" sortable>
          <template #body="p">
            <MyTableType :icon="typeIcon(p.data.type)" :type="p.data.type" />
          </template>
        </Column>

        <Column v-if="isTeacher" field="title" header="Titre" style="min-width:20rem; max-width:30rem; overflow:hidden"
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

        <Column v-if="isTeacher" field="evaluation" header="Évaluation" style="max-width:12rem">
          <template #body="p">
            <MyTableEvaluation :nid="p.data.nid" :views_total="p.data.views_total" :boss="p.data.boss"
              :whoami="p.data.whoami" :evalu="p.data.evaluation" :appre="p.data.appreciation" :isTeacher="isTeacher" />
          </template>
        </Column>
        <Column v-else field="evaluation" header="Évaluation" style="max-width:20rem">
          <template #body="p">
            <MyTableEvaluation :views_total="p.data.views_total" :boss="p.data.boss" :whoami="p.data.whoami"
              :evalu="p.data.evaluation" :appre="p.data.appreciation" :isTeacher="isTeacher" />
          </template>
        </Column>

        <Column field="changed" header="Modifié" style="min-width: 10rem; width:14rem" sortable>
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

        <Column v-if="isTeacher" field="bib" header="Bib." style="min-width: 5rem">
          <template #body="p">
            <MyTableBib :nid="p.data.nid" :title="p.data.title" :shared="p.data.status_shared" :web="p.data.status_web"
              :whoami="p.data.whoami" />
          </template>
        </Column>

        <Column field="tags" header="Étiquettes" style="">
          <template #body="p">
            <MyTableTags :nid="p.data.nid" :tags="p.data.tags" />
          </template>
        </Column>

        <Column field="more" header="">
          <template #body="p">
            <MyTableMore :nid="p.data.nid" :mode="p.data.mode" :whoami="p.data.whoami" :isTeacher="isTeacher" />
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
