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
  my.saveEval(props.data.sa_nid, value)
  const response = { ok: true } // TODO 
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
</script>

<template>
  <div class="flex flex-row gap-2">
    <Textarea v-model="value" rows="2" cols="20" @blur="save" autoResize class="w-full h-full" />
    <Button v-if="my.mathalea" @click="toggle" label="Détails" class="self-center" />
  </div>
  <Popover ref="op" v-if="my.mathalea">
    <DataTable :value="my.mathalea.evaluations.map((el, idx) => ({ ...el, score: st[idx].score }))">
      <Column field="label" header="Exercice"></Column>
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
