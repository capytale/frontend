<script setup>
import { useBibStore } from '@/stores/bib'

const props = defineProps({
  data: Object,
  required: true
})
const visible = ref(false);

const bib = useBibStore()
bib.getComments(props.data)
watch(() => props.data.nid, () => bib.getComments(props.data))

// calcule le score sur 5
const score = computed(() => {
  if (props.data.comments == null) return 0
  if (props.data.comments.length == 0) return 0
  let s = props.data.comments.reduce((acc, val) => acc
    + parseInt(val.eth)
    + parseInt(val.app)
    + parseInt(val.clr)
    + parseInt(val.fon)
    + parseInt(val.per)
    + parseInt(val.uti), 0) / props.data.comments.length
  if (s < 0) return s
  return Math.max(1, (5 * s / 11))
})

const nbComms = computed(() => {
  if (props.data.comments == null) return 0
  return props.data.comments.length
})
// avec 1 chiffre après la virgule
const scoreFixed = computed(() => {
  return score.value.toFixed(1)
})
// calcule le nb d'étoiles à afficher
const nbstars = computed(() => {
  if (props.data.comments == null) return 0
  if (props.data.comments.length == 0) return 0
  let s = score.value
  if (s < 0) return 0
  return Math.round(s)
})

</script>

<template>
  <div @click="visible = true" class="mt-6 text-gray-400 flex">
    <span v-if="score < 0">
      <i class="pi pi-ban text-red-500 mx-2"></i>
    </span>
    <span v-else class="flex">
      {{ scoreFixed }}
      <Rating v-model="nbstars" :cancel="false" readonly class="stars mx-2" />
    </span>
    ({{ nbComms }})
  </div>
  <Dialog v-model:visible="visible" maximizable modal :header="'Header ' + data.nid"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :style="{ width: '60%' }" dismissableMask>


    <BibCommentsPopup :data="data" />
    

  </Dialog>
</template>

<style scoped>
/* Additionnal CSS in default.vue */
</style>
