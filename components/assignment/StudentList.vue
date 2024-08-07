<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useMyStore } from '@/stores/my'
const my = useMyStore()

const props = defineProps({
  nid: String,
  viewsTotal: Number,
  required: true
})

my.getAssignments(props.nid)

const selectedNid = ref();
const showToolbar = ref(false);

const onRowSelect = function () {
  showToolbar.value = true
}
const onRowSelectAll = function () {
  showToolbar.value = true
}
const onRowUnselectAll = function () {
  showToolbar.value = false
}
const onRowUnselect = function () {
  showToolbar.value = selectedNid.value.length > 0
}

const handleChangeWf = ((wf) => {
  my.changeSaWf(selectedNid.value, wf)
  const response = { ok: true } // TODO
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Changement(s) effectué(s) : ', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec : ', detail: "nid = " });
  }
  selectedNid.value = []
  showToolbar.value = false
})

const wficon = ((wf) => {
  if (wf == 100) return { icon: "pi pi-pencil", color: "blue", tt: "En cours" }
  if (wf == 200) return { icon: "pi pi-envelope", color: "Orange", tt: "Rendu" }
  if (wf == 300) return { icon: "pi pi-check-square", color: "green", tt: "Corrigé" }
})
const nextOne = ((wf) => {
  if (wf == 300) return { icon: "pi pi-pencil", color: "blue", wf: 100, tt: "En cours" }
  if (wf == 100) return { icon: "pi pi-envelope", color: "Orange", wf: 200, tt: "Rendu" }
  if (wf == 200) return { icon: "pi pi-check-square", color: "green", wf: 300, tt: "Corrigé" }
})
const nextTwo = ((wf) => {
  if (wf == 200) return { icon: "pi pi-pencil", color: "blue", wf: 100, tt: "En cours" }
  if (wf == 300) return { icon: "pi pi-envelope", color: "Orange", wf: 200, tt: "Rendu" }
  if (wf == 100) return { icon: "pi pi-check-square", color: "green", wf: 300, tt: "Corrigé" }
})
const chWf = ((sa_nid, wf) => {
  my.changeSaWf(sa_nid, wf)
})

const nbFake = ref(new Array(props.viewsTotal));
</script>


<template>
  <div v-if="my.loadingAssignments">
    <Card class="flex-2 my-10">
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
    <div class="myflex my-10">
      <span><img :src="my.assignments.icon" alt="icon" class="w-16 h-16" /> </span>
      <span class="activity-title">{{ my.assignments.title }}</span>

    </div>

    <DataTable :value="my.assignments.tab" tableStyle="min-width: 50rem" v-model:selection="selectedNid"
      selectionMode="multiple" @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()"
      @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()">

      <template #header>
        <Toolbar>
          <template #start v-if="showToolbar">
            <Button v-tooltip.bottom="'En cours'" @click="handleChangeWf(100)" icon="pi pi-pencil" class="mr-2 blue" />
            <Button v-tooltip.bottom="'Rendu'" @click="handleChangeWf(200)" icon="pi pi-envelope" class="mr-2 orange" />
            <Button v-tooltip.bottom="'Corrigé'" @click="handleChangeWf(300)" icon="pi pi-check-square"
              class="mr-2 green" />

            <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2" severity="secondary" />
            <Button v-tooltip.bottom="'CSV'" icon="pi pi-file-excel" class="mr-2" severity="secondary" />
          </template>

        </Toolbar>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
        <template #body="p">
          <MyTableChanged :data="p.data" />
        </template>
      </Column>

      <Column field="nom" header="Élève" style="max-width:10rem" sortable>
        <template #body="p">
          <AssignmentStudent :data="p.data" />
        </template>
      </Column>

      <Column field="classe" header="Classe" sortable></Column>

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

      <Column field="appr" header="Appréciation">
        <template #body="p">
          <AssignmentAppreciation :data="p.data" />
        </template>
      </Column>

      <Column field="eval" header="Évaluation">
        <template #body="p">
          <AssignmentEvaluation :data="p.data" />
        </template>
      </Column>

    </DataTable>
  </template>
</template>

<style scoped>
.blue {
  background-color: blue;
}

.orange {
  background-color: orange;
}

.green {
  background-color: green;
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
