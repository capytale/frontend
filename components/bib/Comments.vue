<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'

const props = defineProps({
  nid: Number,
  required: true
})
const visible = ref(false);

const { data: xxx, pending, error, refresh, clear } = await useAsyncData('xxx' + props.nid, async () => {
  const a = await httpClient.getJsonAsync("/web/c-hdls/api/comments/" + props.nid)
  // console.log("2. useAsyncData", a)
  return a
})

const comments = await httpClient.getJsonAsync("/web/c-hdls/api/comments/" + props.nid)
// console.log("comments", comments)

// calcule le score sur 5
const score = computed(() => {
  if (comments.length == 0) return 0
  let s = comments.reduce((acc, val) => acc
    + parseInt(val.eth)
    + parseInt(val.app)
    + parseInt(val.clr)
    + parseInt(val.fon)
    + parseInt(val.per)
    + parseInt(val.uti), 0) / comments.length
  return (5 * s / 11)
})

// avec 1 chiffre après la virgule
const scoreFixed = computed(() => {
  return score.value.toFixed(1)
})
// calcule le nb d'étoiles à afficher
const nbstars = computed(() => {
  if (comments.length == 0) return 0
  let s = score.value
  if (s < 0) return 0
  return Math.round(s)
})

</script>

<template>

  <!-- Zone de Travaux .... -->
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <!-- <div v-else-if="xxx.length > 0" class="text-gray-300">Data: {{ xxx[0].cid }}</div> -->
  <!-- Fin de Zone de Travaux .... -->


  <div @click="visible = true" class="mt-6 text-gray-400 flex">
    <span v-if="score < 0" >
      <i class="pi pi-ban text-red-500 mx-2"></i>
    </span>
    <span v-else class="flex">
      {{ scoreFixed }}
      <Rating v-model="nbstars" :cancel="false" class="stars mx-2" />
    </span>
    ({{ comments.length }})
  </div>
  <Dialog v-model:visible="visible" maximizable modal :header="'Header ' + nid"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

    <DataView :value="comments">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="card">
              <div>Commentaire : {{ item.subject }}</div>
              <div>
                <span>Apparence : {{ item.app }}</span>
                <span>Clarté{{ item.clr }}</span>
                <span>Ethique{{ item.eth }}</span>
                <span>Fond{{ item.fon }}</span>
                <span>Pertinence{{ item.per }}</span>
                <span>Utilisabilité{{ item.uti }}</span>
              </div>
            </div>

          </div>
        </div>
      </template>
    </DataView>
  </Dialog>
</template>

<style>
.p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
  font-size: 1.5rem;
  color: #FFD700;
}
</style>