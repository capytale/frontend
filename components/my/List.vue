<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { useArchiveBuilder } from "~/composables/archiveBuilder/builder";

const userStore = useCurrentUserStore()
const activites = useActivitiesStore()
const tags = useTagsStore()
type Activity = { tags?: string[] }; 

const activitiesByTag: { [key: string]: Activity[] } = {};

const createActivitiesByTag = () => {
  if (Object.keys(activitiesByTag).length > 0)
    Object.keys(activitiesByTag).forEach(key => delete activitiesByTag[key]);
  activites.activities.data.forEach((activity: Activity) => {
    if (activity.tags) {
      activity.tags.forEach(tag => {
        if (!activitiesByTag[tag]) {
          activitiesByTag[tag] = [];
        }
        activitiesByTag[tag].push(activity);
      });
    }
  });
}

createActivitiesByTag()

/**
 * L'activité dont le formulaire Bib est ouvert
 * Undefined si aucun formulaire n'est ouvert
 */
const bibFormActivity = ref < { nid: number, title: string } | undefined > ()

const selectedFolder = ref(null)
const opTags = ref();
const opTags2 = ref();
const tmpTags = ref([]);
const opFolders = ref();
const colsChoice = ref();
const tagsToggle2 = (event) => {
  opTags2.value.toggle(event);
  selectedNid.value.forEach((o) => {
    tmpTags.value.push({ nid: o.nid, tags: [...o.tags], info: 'tmp' })
  })
}

const replaceTags = async () => {
  await activites.replaceTags([...tmpTags.value.map((o) => o.nid)], tmpTags.value.map((o) => o.tags))
  selectedNid.value.forEach((o) => {
    o.tags = tmpTags.value.find((p) => p.nid === o.nid).tags
  })
  createActivitiesByTag()
  tmpTags.value = []
  opTags2.value.hide()
  selectedNid.value = []
  showToolbar.value = false
}
const cancelModif = () => {
  tmpTags.value = []
  opTags2.value.hide()
}

const foldersToggle = (event) => { opFolders.value.toggle(event); }
const colsChoiceToggle = (event) => { colsChoice.value.toggle(event); }

// TODO : enregistrer les colonnes dans les prefs utilisateur et les charger au démarrage
const cols = ref({
  type: true,
  title: true,
  evaluation: true,
  changed: true,
  code: true,
  tags: true,
  more: true,
  bib: true,
})

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

const confirm = useConfirm();
const toast = useToast();
const handleDelete = function () {
  confirm.require({
    message: `Vous vous apprêtez à supprimer ${selectedNid.value.length} élément(s) DÉFINITIVEMENT.`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Annuler',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptLabel: 'Supprimer',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        const notDeleted = await activites.deleteActivity([...selectedNid.value.map((o) => o.nid)])
        console.log("notDeleted: ", notDeleted)
        if (notDeleted.length == 0) {
          toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
        } else {
          if (selectedNid.value.length == 1) {
            toast.add({ severity: 'warn', summary: 'Échec de la suppression', detail: `Vous n'avez pas le droit de supprimer cet élément` });
          } else
            toast.add({ severity: 'warn', summary: 'Échec de la suppression', detail: `Vous n'avez pas le droit de supprimer certains éléments` });
        }
      }
      catch (e) {
        toast.add({ severity: 'error', summary: 'Échec de la suppression', detail: `nid = ${selectedNid.value} - ${e}` });
      }
    },
  });
}

const handleBulkArchive = function () {
  if (corbeilleTid() == null) {
    toast.add({ severity: 'error', summary: 'Archivage impossible', detail: `L'étiquette spéciale nommée "Corbeille" doit être présente mais n'a pas été trouvée.` });
    return
  }
  confirm.require({
    message: `Vous vous apprêtez à archiver toutes les copies de ${selectedNid.value.length} élément(s).`,
    header: 'Confirmation',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Annuler',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptLabel: 'Archiver',
    acceptClass: 'p-button-info',
    accept: async () => {
      try {
        await activites.bulkArchive([...selectedNid.value.map((o) => o.nid)], corbeilleTid())
        toast.add({ severity: 'success', summary: 'Archivage effectué', life: 2000 });
      }
      catch (e) {
        toast.add({ severity: 'error', summary: 'Échec de l\'archivage', detail: `nid = ${selectedNid.value} - ${e}` });
      }
    },
  });
}
const handleMoveToFolderMultiple = async () => {
  const folder = Object.keys(selectedFolder.value)[0]
  // console.log("folder: ", folder)
  await activites.moveActivities(selectedNid.value, folder)
}

const archiveBuilder = useArchiveBuilder();

function handleDownload() {
  let sel;
  if (selectedNid.value.length > 0) {
    sel = selectedNid.value;
  } else {
    sel = myactivities.value;
  }
  sel = sel.map((o) => ({ nid: o.nid, type: o.type, title: o.title }));
  archiveBuilder.exportActivities(sel);
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.IN },
  whoami: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const activeTag = useActiveTagStore()

const getTidFromStore = (obj) => {
  for (let tid in obj) {
    return tid
  }
}
const getTagName = (obj) => {
  const tid = getTidFromStore(obj)
  if (tid) {
    return tags.flatTags.find(o => o.id == tid).label
  }
}

const corbeilleTid = () => {
  const corbeilleTag = tags.tags.find(o => o.label === 'Corbeille')
  if (!corbeilleTag) return null
  return corbeilleTag.id
}

const myactivities = computed(() => {
  const tid = getTidFromStore(activeTag.tid)
  if (tid) { // user has selected a tag
    return activitiesByTag[tid] || []
  } else { // no tag selected : show all activities except those in the trash
    if (!activites.activities.data) return []
    const corbTid = corbeilleTid();
    return activites.activities.data.filter(o => {
      if (!o.tags) return true
      for (let tag of o.tags) {
        if (tag === corbTid) return false
      }
      return true
    })
  }
})
const nbselected = () => {
  if (selectedNid.value.length == 1) return "1 élément sélectionné "
  return selectedNid.value.length + " éléments sélectionnés "
}

const iAm = [
  { label: 'Créateur', code: 'cr', img: '/web/modules/custom/capytale_ui/assets/owner-color.svg' },
  { label: 'Apprenant', code: 'ap', img: '/web/modules/custom/capytale_ui/assets/student-color.svg' },
  { label: 'Associé', code: 'as', img: '/web/modules/custom/capytale_ui/assets/associate-color.svg' },
]

const getIAmLabel = (code) => {
  return iAm.find(o => o.code == code).label
}
const getIAmImg = (code) => {
  return iAm.find(o => o.code == code).img
}

// TODO : ajouter skeletons dans le cas où activites.activities.pending
</script>

<template>
  <BibMetaDataModal v-model="bibFormActivity" />
  <Card class="flex-1">

    <template #content>

      <div v-if="activites.activities.pending">
        <p>Chargement des activités...</p>
      </div>
      <div v-else-if="activites.activities.status == 'error'">
        <p>Impossible de charger les activités.</p>
      </div>
      <template v-else>
        <MyWelcomeNewbie v-if="activites.activities.data.length == 0" :isTeacher="userStore.isTeacher" />

        <template v-else>

          <DataTable v-model:filters="filters" v-model:selection="selectedNid" selectionMode="multiple"
            :value="myactivities" dataKey="nid" sortField="changed" tableStyle="min-width: 50rem" :sortOrder="-1"
            paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate='Activités {first} à {last} sur {totalRecords} &nbsp; &nbsp;'
            @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()" @rowUnselectAll="onRowUnselectAll()"
            @rowSelectAll="onRowSelectAll()" :globalFilterFields="['title', 'type', 'whoami']" class="mydatatable">


            <template #header class="hdr">
              <Toolbar>
                <template #start v-if="!showToolbar">
                  <h2 class="ml-8"> Mes activités </h2>
                </template>
                <template #start v-if="showToolbar">
                  <span class="ml-8 mr-2">{{ nbselected() }}</span>

                  <Button v-tooltip.bottom="'Supprimer'" @click="handleDelete()" icon="pi pi-times-circle" class="mr-2"
                    severity="danger" outlined />
                  <Button v-tooltip.bottom="'Archiver toutes les copies et mettre le compteur de copies à 0'"
                    @click="handleBulkArchive()" icon="pi pi-eye-slash" class="mr-2" outlined severity="secondary" />

                  <div class="card flex justify-content-center">
                    <Button v-tooltip.bottom="'Étiqueter'" icon="pi pi-tags" class="mr-2" @click="tagsToggle2"
                      severity="secondary" outlined />
                    <Popover ref="opTags2" @hide="cancelModif">
                      <MyTagsTree v-if="tmpTags.length === 0" v-model:selection="selectedNid" :tags="tags.tags" />
                      <MyTagsTree v-else v-model:selection="tmpTags" :tags="tags.tags" />
                      <div class="flex flex-row justify-between gap-2">
                        <Button label="Annuler" @click="cancelModif" class="mt-4" severity="secondary" size="small" />
                        <Button label="Appliquer" @click="replaceTags" class="mt-4" size="small" />
                      </div>
                    </Popover>
                  </div>
                  <div class="card flex justify-content-center" v-if="false">
                    <Button v-tooltip.bottom="'Déplacer'" icon="pi pi-folder-open" class="mr-2" severity="secondary"
                      @click="foldersToggle" />
                    <Popover ref="opFolders">
                      <div class="gap-3 w-25rem">
                        <Tree id="folder" v-model:selectionKeys="selectedFolder" :value="tags.tags"
                          selectionMode="single" class="w-full md:w-30rem scroll">
                          <template #default="slotProps">
                            <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{
                              slotProps.node.label
                            }}
                          </template>
                        </Tree>
                        <Button v-if="selectedFolder && Object.keys(selectedFolder).length" type="button"
                          label="Déplacer" class="w-full" @click="handleMoveToFolderMultiple" />
                      </div>
                    </Popover>
                  </div>
                  <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2" severity="secondary"
                    @click="handleDownload" />
                  <!-- <Button v-tooltip.bottom="'CSV'" icon="pi pi-file-excel" class="mr-2" severity="secondary" /> -->
                </template>

                <template #end>
                  <template v-if="getTidFromStore(activeTag.tid)">
                    <span class="text-red-500 font-bold">Filtre par étiquette :</span>
                    <Button removable class="removable pr-2 mr-1" text @click="activeTag.tid = {}"
                      v-tooltip.top="{ value: 'Supprimer', showDelay: 400, hideDelay: 0 }">
                      {{ getTagName(activeTag.tid) }}
                      <i class="pi pi-times px-2" style="color:red"></i>
                    </Button>
                  </template>

                  <div class="flex gap-2 justify-content-end">

                    <TypeFilterSelect v-model="filters['type'].value" :activities="myactivities" />

                    <IconField iconPosition="left">
                      <InputIcon>
                        <i class="pi pi-search" />
                      </InputIcon>
                      <InputText v-model="filters['title'].value" placeholder="Rechercher dans le titre" />
                    </IconField>

                    <Select v-model="filters['whoami'].value" :options="iAm" optionLabel="label" optionValue="code"
                      placeholder="Je suis" showClear checkmark :highlightOnSelect="false" class="w-full jesuis">
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center">
                          <img :src="getIAmImg(slotProps.value)" class="mr-2" style="width: 18px" />
                          <div class="mr-4">{{ getIAmLabel(slotProps.value) }}</div>
                        </div>
                        <span v-else>
                          {{ slotProps.placeholder }}
                        </span>
                      </template>
                      <template #option="slotProps">
                        <div class="flex items-center">
                          <img :src="slotProps.option.img" class="mr-2" style="width: 18px" />
                          <div>{{ slotProps.option.label }}</div>
                        </div>
                      </template>
                      <template #header>
                        <div class="font-medium p-3">Choisir un rôle</div>
                      </template>
                    </Select>

                    <Button label="Colonnes" icon="pi pi-arrow-down" outlined @click="colsChoiceToggle" v-if="false" />
                    <Popover ref="colsChoice" v-if="false">
                      <div v-for="(v, k) in cols" :key="k" class="m-2">
                        <Checkbox v-model="cols[k]" :binary="true" :inputId="'rech' + k" />
                        <label :for="'rech' + k" class="ml-2">{{ k }}</label>
                      </div>
                    </Popover>
                  </div>

                </template>

              </Toolbar>
            </template>

            <Column selectionMode="multiple"></Column>

            <Column :class="cols.type ? '' : 'hidden'" field="type" header="Type" sortable>
              <template #body="p">
                <MyTableType :data="p.data" />
              </template>
            </Column>

            <Column :class="cols.title ? '' : 'hidden'" field="title" header="Titre" sortable
              style="min-width: 15rem; max-width: 20rem;">
              <template #body="p">
                <MyTableTitle :data="p.data" />
              </template>
            </Column>

            <Column v-if="userStore.isTeacher" :class="cols.evaluation ? '' : 'hidden'" field="whoami"
              header="Évaluation" style="max-width: 12rem">
              <template #body="p">
                <MyTableEvaluation :data="p.data" :isTeacher="userStore.isTeacher" />
              </template>
            </Column>
            <Column v-else :class="cols.evaluation ? '' : 'hidden'" field="evaluation" header="Évaluation"
              style="max-width:20rem">
              <template #body="p">
                <MyTableEvaluation :data="p.data" />
              </template>
            </Column>

            <Column :class="cols.changed ? '' : 'hidden'" field="changed" header="Dernier accès" sortable>
              <template #body="p">
                <MyTableChanged :data="p.data" />
              </template>
            </Column>

            <Column :class="cols.code ? '' : 'hidden'" field="code" header="Partage" style="min-width: 13rem">
              <template #body="p">
                <MyTableShare :data="p.data" :isTeacher="userStore.isTeacher" />
              </template>
            </Column>

            <Column v-if="userStore.isTeacher" :class="cols.bib ? '' : 'hidden'" field="bib" header="Bib."
              style="min-width: 5rem">
              <template #body="p">
                <MyTableBib :data="p.data" @click="bibFormActivity = p.data" />
              </template>
            </Column>

            <Column :class="cols.tags ? '' : 'hidden'" field="tags" header="Étiquettes" style="">
              <template #body="p">
                <MyTableTags :tmp="tmpTags.find(o => o.nid === p.data.nid)" :data="p.data" />
              </template>
            </Column>

            <Column v-if="cols.more" field="more" header="">
              <template #body="p">
                <MyTableMore :data="p.data" :isTeacher="userStore.isTeacher" />
              </template>
            </Column>

          </DataTable>
        </template>
      </template>
    </template>
  </Card>
</template>

<style scoped>
/* Additionnal CSS in default.vue */
.titlecol {
  width: 20rem;
}

.mydatatable {
  display: flex;
  flex-direction: column;

}

.mydatatable>*:nth-child(1) {
  order: 1;
}

.mydatatable>*:nth-child(2) {
  order: 3;
}

.mydatatable>*:nth-child(3) {
  order: 2;

  &>* {
    border-radius: 0;
    background-color: var(--p-surface-100);

    .dark & {
      background-color: var(--p-surface-800);
      border-bottom: 1px solid var(--p-surface-700);
    }
  }
}

.jesuis li {
  padding-left: 0px;
}
</style>
