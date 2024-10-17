<script setup>
import { richContentToPlainText } from '~/utils/sanitization';
import { getScoreStyle } from '~/utils/evaluation';
import { useToast } from "primevue/usetoast";
const toast = useToast();

const my = useMyStore()

const props = defineProps({
  data: Object,
  required: true
})

const value = ref(richContentToPlainText(props.data.evaluation))

const save = () => {
  const appr = divRef.value.innerText
  my.saveEval(props.data.sa_nid, appr)

  // TODO : faire en fonction du retour de la requête
  const response = { ok: true }
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Évaluation enregistrée', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec enregistrelent de l\'évaluation : ', detail: "nid = " });
  }
}

const st = ref()
if (my.mathalea) st.value = my.mathalea.students.find(s => s.uid == props.data.sa_uid).evaluations

const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}

const divRef = ref()
</script>

<template>
  <div class="flex flex-row gap-2">
    <div contenteditable="true" @blur="save" ref="divRef" class="editable"
      v-tooltip.top="{ value: 'Cliquer pour modifier. Quitter pour enregistrer.', showDelay: 300, hideDelay: 0 }">
      {{ value }}
    </div>
    <Button v-if="my.mathalea" @click="toggle" label="Détails" class="self-center" />
  </div>
  <Popover ref="op" v-if="my.mathalea">
    <DataTable :value="my.mathalea.evaluations.map((el, idx) => ({ ...el, score: st[idx].score }))">
      <Column field="label" header="Exercice">
        <template #body="slotProps">
          {{ slotProps.data.label }}: {{ slotProps.data.title }}
        </template>
      </Column>
      <Column field="score" header="Note">
        <template #body="slotProps">
          <Tag :style="getScoreStyle(slotProps.data.score, slotProps.data.scoreMax)" outlined>
            <span>{{ slotProps.data.score !== null ? slotProps.data.score : "-" }} / {{ slotProps.data.scoreMax
              }}</span>
          </Tag>
        </template>
      </Column>
    </DataTable>
  </Popover>
</template>

<style scoped>
.editable {
  border: 1px solid #ccc;
  padding: 5px;
  min-height: 50px;
  min-width: 10rem;
  border-radius: 5px;
}
</style>
