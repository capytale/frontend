<script setup>
import { richContentToPlainText } from '~/utils/sanitization';
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
  const response = { ok: true} // TODO 
  if (response.ok) {
    toast.add({ severity: 'success', summary: 'Évaluation enregistrée', life: 2000 });
  } else {
    toast.add({ severity: 'error', summary: 'Échec enregistrelent de l\'évaluation : ', detail: "nid = " });
  }
}

const st = ref()
if(my.mathalea) st.value = my.mathalea.students.find(s => s.uid == props.data.sa_uid).evaluations

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

const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}
</script>

<template>
  <div class="flex flex-row gap-2">
    <Textarea v-model="value" rows="2" cols="20" @blur="save" autoResize />
    <Button v-if="my.mathalea" @click="toggle" label="Détails" class="self-center" />
  </div>
    <Popover ref="op" v-if="my.mathalea">
    <DataTable :value="my.mathalea.evaluations.map((el, idx) => ({...el, score: st[idx].score }))">
    <Column field="label" header="Exercice"></Column>
    <Column field="score" header="Note">
    <template #body="slotProps">
      <Tag :style="getStyle(slotProps.data.score, slotProps.data.scoreMax)" severity="secondary">
      <span>{{ slotProps.data.score ?  slotProps.data.score : "-" }} / {{ slotProps.data.scoreMax }}</span>
      </Tag> 
    </template>
    </Column>
    </DataTable>
    </Popover>
</template>
