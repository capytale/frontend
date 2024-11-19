<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { useArchiveBuilder } from "~/composables/archiveBuilder/builder";

const userStore = useCurrentUserStore()
const activites = useActivitiesStore()
const { data: tags } = useTagsStore()
const { status } = await useLazyAsyncData('tags', () => tagsStore.getAllTags())
// Mettre une condition sur le status par sécurité
type Activity = { tags?: string[] }; 


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
console.log(corbeilleTid());


const myactivities = computed(() => {
  const tid = getTidFromStore(activeTag.tid)
  if (tid) { // user has selected a tag
    return activites.activities.data.filter(o => {
      if (!o.tags) return false
      for (let tag of o.tags) {
        if (tag === tid) return true
      }
    })
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
