<script lang="ts">
const defaultNbFake = 4;
</script>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from '@primevue/core/api';
import { useMyStore } from '@/stores/my'

const toast = useToast();
const my = useMyStore()

const props = defineProps<{
  nid: string,
  viewsTotal?: number
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
  // my.changeSaWf(selectedNid.value, wf)
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  hasSelected.value = false
})

const handleBulkUnArchive = (() => {
  // my.bulkUnHide(selectedNid.value, wf)
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  hasSelected.value = false
})

const handleBulkArchive = (() => {
  my.bulkHide(selectedNid.value, wf)
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  hasSelected.value = false
})

const wficon = ((wf) => {
  if (wf == 100) return { icon: "pi pi-pencil", color: "var(--p-button-outlined-info-color)", tt: "En cours" }
  if (wf == 200) return { icon: "pi pi-envelope", color: "var(--p-button-outlined-warn-color)", tt: "Rendu" }
  if (wf == 300) return { icon: "pi pi-check-square", color: "var(--p-button-outlined-success-color)", tt: "Corrigé" }
})
const nextOne = ((wf) => {
  if (wf == 300) return { icon: "pi pi-pencil", color: "var(--p-button-outlined-info-color)", wf: 100, tt: "En cours" }
  if (wf == 100) return { icon: "pi pi-envelope", color: "var(--p-button-outlined-warn-color)", wf: 200, tt: "Rendu" }
  if (wf == 200) return { icon: "pi pi-check-square", color: "var(--p-button-outlined-success-color)", wf: 300, tt: "Corrigé" }
})
const nextTwo = ((wf) => {
  if (wf == 200) return { icon: "pi pi-pencil", color: "var(--p-button-outlined-info-color)", wf: 100, tt: "En cours" }
  if (wf == 300) return { icon: "pi pi-envelope", color: "var(--p-button-outlined-warn-color)", wf: 200, tt: "Rendu" }
  if (wf == 100) return { icon: "pi pi-check-square", color: "var(--p-button-outlined-success-color)", wf: 300, tt: "Corrigé" }
})
const chWf = ((sa_nid, wf) => {
  my.changeSaWf(sa_nid, wf)
})

const nbFake = computed(() => {
  if (props.viewsTotal == null) return new Array(defaultNbFake)
  return new Array(props.viewsTotal)
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  hasTags: { value: false, matchMode: FilterMatchMode.EQUALS },
  nom: { value: null, matchMode: FilterMatchMode.CONTAINS },
  classe: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const classList = computed(() => {
  if (my.assignments.tab == null) return []
  const classes = []
  my.assignments.tab.forEach((assignment) => {
    if (assignment.classe !== null && !classes.includes(assignment.classe)) {
      classes.push({ classe: assignment.classe })
    }
  })
  return classes
})


// Ajoute un champ à copy my.assignments.tab qui permet de savoir s'il y a des tags ou non
const richTab = computed(() => {
  if (my.assignments.tab == null) return []
  return my.assignments.tab.map((assignment) => {
    return { ...assignment, hasTags: assignment.tags.length > 0 }
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
};
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
      <Column field="quantity" header="Mode">
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
    <div class="myflex my-10" v-if="false">
      <span><img :src="my.assignments.icon" alt="icon" class="w-16 h-16" /> </span>
      <span class="activity-title">{{ my.assignments.title }}</span>
    </div>

    <DataTable :value="richTab" tableStyle="min-width: 50rem" v-model:selection="selectedNid" v-model:filters="filters"
      :globalFilterFields="['hasTags', 'nom', 'classe']" selectionMode="multiple" filterDisplay="row"
      @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()" @rowUnselectAll="onRowUnselectAll()"
      @rowSelectAll="onRowSelectAll()" :rowStyle="rowStyle" ref="dt">

      <Toolbar>
        <template #start>
          <span class="mr-2">{{ nbselected() }}</span>
          <Button v-tooltip.bottom="ttMessage(100)" @click="handleChangeWf(100)" label="En cours" icon="pi pi-pencil"
            class="mr-2" severity="info" outlined :disabled="!hasSelected" />
          <Button v-tooltip.bottom="ttMessage(200)" @click="handleChangeWf(200)" label="Rendu" icon="pi pi-envelope"
            class="mr-2" severity="warn" outlined :disabled="!hasSelected" />
          <Button v-tooltip.bottom="ttMessage(300)" @click="handleChangeWf(300)" label="Corrigé"
            icon="pi pi-check-square" class="mr-2" severity="success" outlined :disabled="!hasSelected" />


          <!-- <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2" severity="secondary" /> -->
          <!-- <Button v-tooltip.bottom="'CSV'" icon="pi pi-file-excel" class="mr-2" severity="secondary" /> -->

        </template>
        <template #end>
          <Button icon="pi pi-external-link" label="Export CSV" @click="exportCSV($event)" outlined class="mr-2" />
          <Button v-if="filters['hasTags'].value" v-tooltip.bottom="Désarchiver" label="Désarchiver"
            @click="handleBulkUnArchive()" icon="pi pi-check-square" class="mr-2" severity="secondary" outlined
            :disabled="!hasSelected" />
          <Button v-else v-tooltip.bottom="Archiver" label="Archiver" @click="handleBulkArchive()"
            icon="pi pi-check-square" class="mr-2" severity="secondary" outlined :disabled="!hasSelected" />
          <ToggleButton v-model="filters['hasTags'].value" onLabel="Quitter les archives"
            offLabel="Consulter les archives" offIcon="pi pi-eye-slash" class="mr-2" />
        </template>

      </Toolbar>
      <!-- <Button v-tooltip.bottom="'Sélectionner une ou plusieurs copies à basculer dans l\'état : En cours'" icon="pi pi-pencil" class="mr-2" severity="info" outlined disabled /> -->

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <Column field="changed" header="Dernière modif." style="width:10rem" sortable>
        <template #body="p">
          <MyTableChanged :data="p.data" />
        </template>
      </Column>

      <Column field="nom" header="Élève" style="width:16rem" sortable>
        <template #body="p">
          <AssignmentStudent :data="p.data" />
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

      <Column field="workflow" header="Mode" style="max-width:10rem" sortable>
        <template #body="p">
          <span class="parent mr-1">
            <Button text v-tooltip.top="{ value: wficon(p.data.workflow).tt, showDelay: 300, hideDelay: 0 }">
              <i v-if="!my.assignments.is_in_time_range" class="pi pi-lock pr-1"
                style="color: red; font-size: 1.5rem;"></i>
              <i :class="wficon(p.data.workflow).icon"
                :style="{ color: wficon(p.data.workflow).color, 'font-size': '1.5rem' }"></i>
            </Button>
            <div class="surprise">
              <Button :icon="nextOne(p.data.workflow).icon" :style="{ color: nextOne(p.data.workflow).color }"
                v-tooltip.top="{ value: nextOne(p.data.workflow).tt, showDelay: 300, hideDelay: 0 }" severity="danger"
                @click="chWf(p.data.sa_nid, nextOne(p.data.workflow).wf)" outlined rounded />
              <Button :icon="nextTwo(p.data.workflow).icon" :style="{ color: nextTwo(p.data.workflow).color }"
                v-tooltip.top="{ value: nextTwo(p.data.workflow).tt, showDelay: 300, hideDelay: 0 }" severity="danger"
                @click="chWf(p.data.sa_nid, nextTwo(p.data.workflow).wf)" outlined rounded />
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
