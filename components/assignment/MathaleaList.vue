<template>
  <Dialog v-model:visible="visible" modal dismissableMask maximizable style="max-width: 90%">
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
          <Tag :style="getScoreStyle(slotProps.data[idx], e.scoreMax)"
            v-tooltip.top="{ value: e.title, showDelay: 400, hideDelay: 0 }" class="infott">
            <span>{{ slotProps.data[idx] !== null ? slotProps.data[idx] : '-' }} / {{ e.scoreMax }}</span>
          </Tag>
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script lang="ts" setup>
import { getScoreStyle } from '~/utils/evaluation';
const my = useMyStore()
const visible = defineModel<boolean>()

const evals = my.mathalea.evaluations.map((e, i) => {
  return { label: e.label, scoreMax: e.scoreMax, title: e.label + ": " + e.title }
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

const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV();
};

</script>

<style scoped>
.infott {
  cursor: help;
}

.limitSize {
  max-width: 10%;
}
</style>
