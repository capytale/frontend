<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'

const props = defineProps({
  nid: Number,
  required: true
})
const visible = ref(false);

const { data:xxx, pending, error, refresh, clear } = await useAsyncData('xxx'+props.nid, async () => {
  const a = await httpClient.getJsonAsync("/web/c-hdls/api/comments/" + props.nid)
  // console.log("2. useAsyncData", a)
  return a
})


const comments = await httpClient.getJsonAsync("/web/c-hdls/api/comments/" + props.nid)
// console.log("comments", comments)

const score = computed(() => {
  if (comments.length == 0) return 0
  return comments.reduce((acc, val) => acc
    + parseInt(val.app)
    + parseInt(val.clr)
    + parseInt(val.eth)
    + parseInt(val.fon)
    + parseInt(val.per)
    + parseInt(val.uti), 0) / comments.length
})

const starColor = ((score) => {
  if (score < 2) return ["text-gray-200", "text-gray-200", "text-gray-200", "text-gray-200", "text-gray-200"]
  if (score < 4) return ["text-yellow-500", "text-gray-200", "text-gray-200", "text-gray-200", "text-gray-200"]
  if (score < 6) return ["text-yellow-500", "text-yellow-500", "text-gray-200", "text-gray-200", "text-gray-200"]
  if (score < 8) return ["text-yellow-500", "text-yellow-500", "text-yellow-500", "text-gray-200", "text-gray-200"]
  if (score < 10) return ["text-yellow-500", "text-yellow-500", "text-yellow-500", "text-yellow-500", "text-gray-200"]
  return ["text-yellow-500", "text-yellow-500", "text-yellow-500", "text-yellow-500", "text-yellow-500"]
})

</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="xxx.length >0">Data: {{ xxx[0].cid }}</div>
  <div @click="visible = true" class="mt-6 text-gray-400">
      <span v-if="score < 0">
        <i class="pi pi-ban text-red-500"></i>
      </span>
      <span v-else style="width: 10rem;">
        {{ (5 * score / 11).toFixed(1) }}
        <i :class="'pi pi-star-fill ' + starColor(score)[0]"></i>
        <i :class="'pi pi-star-fill ' + starColor(score)[1]"></i>
        <i :class="'pi pi-star-fill ' + starColor(score)[2]"></i>
        <i :class="'pi pi-star-fill ' + starColor(score)[3]"></i>
        <i :class="'pi pi-star-fill ' + starColor(score)[4]"></i>
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
