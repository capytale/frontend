<template>
  <Dialog v-model:visible="visible" modal dismissableMask maximizable>
  <template #header>
    <h2>Évaluations
    <Button icon="pi pi-external-link" label="CSV" @click="exportCSV" text />
    </h2>
  </template>
  <DataTable ref="dt" :value="data">
  <Column field="name" header="Élève">
  </Column>
  <Column field="evalProf" header="Éval ens." bodyStyle="text-align: center;">
  </Column>
  <Column field="evalAuto" header="Éval auto" bodyStyle="text-align: center;"></Column>
  <Column v-for="(e, idx) in evals" :key="e.label" :header="e.label" :field="idx.toString()">
    <template #body="slotProps">
    <Tag :style="getStyle(slotProps.data[idx], e.scoreMax)" severity="secondary">
    <span>{{ slotProps.data[idx] ? slotProps.data[idx] : '-' }} / {{ e.scoreMax }}</span>
    </Tag>
  </template>
  </Column>
  </DataTable>
  </Dialog>
</template>

<script lang="ts" setup>
const my = useMyStore()
const visible = defineModel<boolean>()

const evals = my.mathalea.evaluations.map((e, i) => {
  return { label: e.label, scoreMax: e.scoreMax }
})

const data = my.mathalea.students.map((el, idx) => {
  const name = el.firstname + ' ' + el.lastname
  const evalProf = my.assignments.tab.find(s => s.sa_uid == el.uid).evaluation
  const evalAuto = el.totalScore
  const evals = my.mathalea.evaluations.map((e, i) => {
    return el.evaluations[i].score
  })
  // const evals = my.mathalea.evaluations.map((e, i) => {
  //   return { label: e.label,score: el.evaluations[i].score, scoreMax: e.scoreMax }
  // })
  return { name, evalProf, evalAuto, ...evals }
})

const getStyle = function (score, scoreMax) {
// Couleurs de  ff0000 -> ffff00 -> 00ff00
// pour Score/scoreMax de 
//              0      -> 0.5    -> 1
  const r = Math.min(255, 510 - parseInt(510*score/scoreMax));
  const g = Math.min(255, parseInt(510*score/scoreMax));
  const idle = ''
  if (score != null) return "background-color: #" + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + "00"
  return idle
}

const dt = ref()
const exportCSV = () => {
    dt.value.exportCSV();
};

</script>

<style>

</style>
