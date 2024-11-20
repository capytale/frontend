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
      <Column field="evalProf" bodyStyle="text-align: center;">
        <template #header>
          <span v-tooltip.top="{ value: 'Évaluation manuelle de l\'enseignant', showDelay: tooltipDelay, hideDelay: 0 }"
            class="cursor-help">Éval ens.</span>
        </template><
      </Column>
      <Column field="evalAuto" bodyStyle="text-align: center;">
        <template #header>
          <span
            v-tooltip.top="{ value: 'Évaluation totale automatique remontée par MathALÉA', showDelay: tooltipDelay, hideDelay: 0 }"
            class="cursor-help">Éval auto</span>
        </template>
      </Column>
      <Column v-for="(e, idx) in evals" :key="e.label" :field="idx.toString()">
        <template #header>
          <span v-tooltip.top="{ value: e.title, showDelay: tooltipDelay, hideDelay: 0 }" class="cursor-help">{{ e.label
            }}</span>
        </template>
        <template #body="slotProps">
          <Tag :style="getScoreStyle(slotProps.data[idx], e.scoreMax)"
            v-tooltip.top="{ value: e.title, showDelay: tooltipDelay, hideDelay: 0 }" class="cursor-help">
            <span>{{ slotProps.data[idx] !== null ? slotProps.data[idx] : '-' }}&nbsp;/&nbsp;{{ e.scoreMax }}</span>
          </Tag>
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script lang="ts" setup>
const tooltipDelay = 400
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
