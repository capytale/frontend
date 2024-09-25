<script lang="ts">
const defaultNbFake = 5;
const maxNbFake = 10;
</script>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from '@primevue/core/api';
import { useMyStore } from '@/stores/my'

const toast = useToast();
const my = useMyStore()
const activites = useActivitiesStore()

const props = defineProps<{
  nid: string,
  viewsVisible?: number
}>()

my.getAssignments(props.nid)

const selectedNid = ref();
const hasSelected = ref(false);

const onRowSelect = function () {
  hasSelected.value = true
}
const onRowSelectAll = function () {
  hasSelected.value = true
}
const onRowUnselectAll = function () {
  hasSelected.value = false
}
const onRowUnselect = function () {
  hasSelected.value = selectedNid.value.length > 0
}

const handleChangeWf = ((wf) => {
  my.changeSaWf(selectedNid.value, wf)
  activites.changeMyVueCount(props.nid, countWf(100), countWf(200), countWf(300), countWf(0))
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  hasSelected.value = false
})


const tags = useTagsStore()
const corbeilleTid = () => {
  if (!tags.tags.find(o => o.label === 'Corbeille')) return null
  return tags.tags.find(o => o.label === 'Corbeille').id
}

// compte le nombre de copies avec le workflow n
const countWf = (n) => {
  if (n == 0) return my.assignments.tab.filter((o) => o.tags.length == 0).length
  if (my.assignments.tab == null) return 0
  return my.assignments.tab.filter((o) => o.workflow == n && o.tags.length == 0).length
}

const handleArchive = (() => {
  if (corbeilleTid() == null) {
    toast.add({ severity: 'error', summary: 'Archivage impossible', detail: `L'étiquette spéciale nommée "Corbeille" doit être présente mais n'a pas été trouvée.` });
    return
  }
  if (selectedNid.value.length == 0) {
    toast.add({ severity: 'error', summary: 'Archivage impossible', detail: `Vous devez sélectionner au moins une copie à archiver.` });
    return
  }
  my.archive([...selectedNid.value.map((o) => o.sa_nid)], corbeilleTid())
  activites.changeMyVueCount(props.nid, countWf(100), countWf(200), countWf(300), countWf(0))
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  hasSelected.value = false
  toggle()
})

const handleUnArchive = (() => {
  my.unArchive([...selectedNid.value.map((o) => o.sa_nid)], corbeilleTid())
  activites.changeMyVueCount(props.nid, countWf(100), countWf(200), countWf(300), countWf(0))
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  hasSelected.value = false
  toggle()
})

const wficon = ((wf) => {
  if (wf == 100) return { icon: "pi pi-pencil", color: "var(--p-button-outlined-info-color)", tt: "En cours" }
  if (wf == 200) return { icon: "pi pi-envelope", color: "var(--p-button-outlined-warn-color)", tt: "Rendu" }
  if (wf == 300) return { icon: "pi pi-check-square", color: "var(--p-button-outlined-success-color)", tt: "Corrigé" }
})
const nextOne = ((wf) => {
  if (wf == 300) return { icon: "pi pi-pencil", color: "var(--p-button-outlined-info-color)", wf: 100, tt: "Basculer → En cours" }
  if (wf == 100) return { icon: "pi pi-envelope", color: "var(--p-button-outlined-warn-color)", wf: 200, tt: "Basculer → Rendu" }
  if (wf == 200) return { icon: "pi pi-check-square", color: "var(--p-button-outlined-success-color)", wf: 300, tt: "Basculer → Corrigé" }
})
const nextTwo = ((wf) => {
  if (wf == 200) return { icon: "pi pi-pencil", color: "var(--p-button-outlined-info-color)", wf: 100, tt: "Basculer → En cours" }
  if (wf == 300) return { icon: "pi pi-envelope", color: "var(--p-button-outlined-warn-color)", wf: 200, tt: "Basculer → Rendu" }
  if (wf == 100) return { icon: "pi pi-check-square", color: "var(--p-button-outlined-success-color)", wf: 300, tt: "Basculer → Corrigé" }
})
const chWf = ((sa_nid, wf) => {
  my.changeSaWf(sa_nid, wf)
  activites.changeMyVueCount(props.nid, countWf(100), countWf(200), countWf(300), countWf(0))
})

const nbFake = computed(() => {
  if (props.viewsVisible == null) return new Array(defaultNbFake)
  else return new Array(Math.min(props.viewsVisible, maxNbFake))
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  hasTags: { value: false, matchMode: FilterMatchMode.EQUALS },
  fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
  classe: { value: null, matchMode: FilterMatchMode.CONTAINS },
  workflow: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const etats = ref([{ value: 100, label: "En cours" }, { value: 200, label: "Rendu" }, { value: 300, label: "Corrigé" }])

const classList = computed(() => {
  if (my.assignments.tab == null) return []
  const classes = []
  my.assignments.tab.forEach((assignment) => {
    if (assignment.classe !== null && !classes.find(el => el.classe === assignment.classe)) {
      classes.push({ classe: assignment.classe })
    }
  })
  return classes
})


// Ajoute un champ à copy my.assignments.tab qui permet de savoir s'il y a des tags ou non
const richTab = computed(() => {
  if (my.assignments.tab == null) return []
  return my.assignments.tab.map((assignment) => {
    // TODO : reprendre le hsaTgas avec le bon critère
    return { ...assignment, hasTags: assignment.tags.length > 0, fullname: assignment.nom + " " + assignment.prenom }
  })
})

const ttMessage = ((wf) => {
  let prefix = "Basculer dans l'état : "
  if (!hasSelected.value) prefix = "Sélectionner une ou plusieurs copies à basculer dans l'état : "
  if (wf == 100) return prefix + "En cours"
  if (wf == 200) return prefix + "Rendu"
  if (wf == 300) return prefix + "Corrigé"
})
// console.log(classList.value)

const nbselected = () => {
  if (selectedNid.value === undefined) return "0 copie sélectionnée"
  if (selectedNid.value.length == 0) return "0 copie sélectionnée "
  if (selectedNid.value.length == 1) return "1 copie sélectionnée "
  return selectedNid.value.length + " copies sélectionnées "
}
const rowStyle = (data) => {
  if (data.hasTags) {
    return { fontWeight: 'lighter', fontStyle: 'italic', textDecoration: 'line-through' };
  }
};

const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
}

const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
}
const itemsA = ref([
  {
    label: 'Archiver',
    icon: 'pi pi-eye-slash',
    command: () => {
      if (corbeilleTid() == null) {
        toast.add({ severity: 'error', summary: 'Archivage impossible', detail: `L'étiquette spéciale nommée "Corbeille" doit être présente mais n'a pas été trouvée.` });
        return
      }
      handleArchive()
    }
  }
])


const archMessage = (a) => {
  if (a) return "Revenir aux copies non archivées"
  return "Consulter les archives"
}

const mathalea = ref(false)
</script>


<template>
  <div v-if="my.loadingAssignments">
    <Card class="flex-2 my-10" v-if="false">
      <template #title>
        <Skeleton shape="circle" size="4rem" class="mr-2 my-2"></Skeleton>
        <Skeleton width="20rem" class="mb-2"></Skeleton>
      </template>
    </Card>
    <DataTable :value="nbFake">
      <Column field="code" header="Dernière modif.">
        <template #body>
          <Skeleton width="10rem"></Skeleton>
        </template>
      </Column>
      <Column field="name" header="Élève">
        <template #body>
          <Skeleton width="10rem"></Skeleton>
        </template>
      </Column>
      <Column field="category" header="Classe">
        <template #body>
          <Skeleton width="7rem"></Skeleton>
        </template>
      </Column>
      <Column field="quantity" header="État">
        <template #body>
          <Skeleton width="4rem"></Skeleton>
        </template>
      </Column>
      <Column field="quantity" header="Appréciation">
        <template #body>
          <Skeleton width="10rem" height="4rem"></Skeleton>
        </template>
      </Column>
      <Column field="quantity" header="Évaluation">
        <template #body>
          <Skeleton width="10rem" height="4rem"></Skeleton>
        </template>
      </Column>
    </DataTable>
  </div>
  <template v-else>
    <DataTable :value="richTab" tableStyle="min-width: 50rem" v-model:selection="selectedNid" v-model:filters="filters"
      :globalFilterFields="['hasTags', 'fullname', 'classe', 'workflow']" selectionMode="multiple"
      @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()" @rowUnselectAll="onRowUnselectAll()" paginator
      :rows="40" :rowsPerPageOptions="[10, 40, 60]" sortField="fullname" :sortOrder="1"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate='{first} à {last} sur {totalRecords} &nbsp; &nbsp;' @rowSelectAll="onRowSelectAll()"
      :rowStyle="rowStyle" ref="dt">

      <Toolbar>
        <template #start>
          <template v-if="hasSelected">
            <span class="mr-2">{{ nbselected() }}</span>
            <template v-if="filters['hasTags'].value">
              <Button label="Désarchiver" @click="handleUnArchive()" icon="pi pi-check-square" class="mr-2"
                severity="secondary" outlined :disabled="!hasSelected" />
            </template>
            <template v-else>
              <Button v-tooltip.bottom="ttMessage(100)" @click="handleChangeWf(100)" label="En cours"
                icon="pi pi-pencil" class="mr-2" severity="info" outlined :disabled="!hasSelected" />
              <Button v-tooltip.bottom="ttMessage(200)" @click="handleChangeWf(200)" label="Rendu" icon="pi pi-envelope"
                class="mr-2" severity="warn" outlined :disabled="!hasSelected" />
              <Button v-tooltip.bottom="ttMessage(300)" @click="handleChangeWf(300)" label="Corrigé"
                icon="pi pi-check-square" class="mr-2" severity="success" outlined :disabled="!hasSelected" />
              <Button type="button" icon="pi pi-eye-slash" severity="secondary" outlined aria-haspopup="true"
                v-tooltip.top="{ value: 'Déplacer dans les archives', showDelay: 300, hideDelay: 100 }"
                aria-controls="overlay_menu" @click="handleArchive" class="mr-10" />
              <!-- <Menu ref="menu" id="overlay_menu" :model="itemsA" :popup="true" /> -->
            </template>
          </template>

          <IconField iconPosition="left" class="mr-2">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['fullname'].value" placeholder="Rechercher parmi les élèves" />
          </IconField>

          <Select v-model="filters['classe'].value" :options="classList" optionLabel="classe" optionValue="classe"
            class="mr-2" placeholder="Filtrer par classe" style="min-width: 12rem" :showClear="true" />
          <Select v-model="filters['workflow'].value" :options="etats" optionLabel="label" optionValue="value"
            class="mr-2" placeholder="Filtrer par état" style="min-width: 12rem" :showClear="true" />

          <!-- <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2" severity="secondary" /> -->

        </template>
        <template #end>
          <Button v-if="my.mathalea" v-tooltip="'Détails des résultats'" @click="mathalea = true" text>
            <img :src="my.assignments.icon" class="h-10" />
          </Button>
          <Button icon="pi pi-download" class="mr-2" severity="secondary" disabled
            v-tooltip.bottom="'Télécharger les copies\n(bientôt disponible)'" />
          <Button icon="pi pi-file-excel" @click="exportCSV($event)" outlined class="mr-2"
            v-tooltip.bottom="'Télécharger au format csv'" />
          <ToggleButton v-model="filters['hasTags'].value" v-tooltip.bottom="archMessage(filters['hasTags'].value)"
            onLabel="Quitter les archives" offLabel="Archives" offIcon="pi pi-eye-slash" class="mr-2" />
        </template>

      </Toolbar>

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <Column field="changed" header="Dernière modif." style="width:10rem" sortable>
        <template #body="p">
          <MyTableChanged :data="p.data" />
        </template>
      </Column>

      <Column field="fullname" header="Élève" style="width:16rem" sortable>
        <template #body="p">
          <AssignmentStudent :data="p.data" :nid="nid" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" style="width: 100%" @input="filterCallback()"
            placeholder="Rechercher" />
        </template>
      </Column>

      <Column field="classe" header="Classe" style="max-width:10rem" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <!-- <template v-if="classList.length > 0"> -->
          <!--   <Select v-model="filterModel.value" @change="filterCallback()" :options="classList" optionLabel="classe" -->
          <!--     placeholder="Rechercher"> -->
          <!--   </Select> -->
          <!-- </template> -->
          <!-- <template v-else> -->
          <InputText v-model="filterModel.value" type="text" style="width: 100%" @input="filterCallback()"
            placeholder="Rechercher" />
          <!-- </template> -->
        </template>

      </Column>

      <Column field="workflow" header="État" style="max-width:10rem" sortable>
        <template #body="p">
          <span class="parent mr-1">
            <Button text v-tooltip.top="{ value: wficon(p.data.workflow).tt, showDelay: 300, hideDelay: 0 }">
              <i v-if="!my.assignments.is_in_time_range" class="pi pi-lock pr-1"
                style="color: red; font-size: 1.1rem;"></i>
              <i :class="wficon(p.data.workflow).icon"
                :style="{ color: wficon(p.data.workflow).color, 'font-size': '1.1rem' }"></i>
            </Button>
            <div class="surprise">
              <Button :icon="nextOne(p.data.workflow).icon" :style="{ color: nextOne(p.data.workflow).color }"
                v-tooltip.top="{ value: nextOne(p.data.workflow).tt, showDelay: 300, hideDelay: 0 }" severity="danger"
                @click.stop="chWf(p.data.sa_nid, nextOne(p.data.workflow).wf)" outlined rounded />
              <Button :icon="nextTwo(p.data.workflow).icon" :style="{ color: nextTwo(p.data.workflow).color }"
                v-tooltip.top="{ value: nextTwo(p.data.workflow).tt, showDelay: 300, hideDelay: 0 }" severity="danger"
                @click.stop="chWf(p.data.sa_nid, nextTwo(p.data.workflow).wf)" outlined rounded />
            </div>
          </span>
        </template>
      </Column>

      <Column field="appreciation" header="Appréciation">
        <template #body="p">
          <AssignmentAppreciation :key="p.data.sa_nid" :data="p.data" />
        </template>
      </Column>

      <Column field="evaluation" header="Évaluation">
        <template #body="p">
          <AssignmentEvaluation :key="p.data.sa_nid" :data="p.data" />
        </template>
      </Column>

    </DataTable>
    <AssignmentMathaleaList v-model="mathalea" v-if="my.mathalea" />
  </template>
</template>

<style scoped>
.myInvisible {
  display: none;
}

.myflex {
  display: flex;
  align-items: center;
  gap: 1em;
}

.activity-title {
  font-size: 2rem;
  font-weight: bold;
}

.surprise {
  display: none;
  position: absolute;
  left: 100%;
  bottom: -133%;
  padding-left: 0;
  z-index: 1;
}

.parent {
  position: relative;
}

.parent:hover .surprise {
  display: inline;
}
</style>
