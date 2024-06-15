<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'

const props = defineProps({
  nid: Number,
  required: true
})
const visible = ref(false);

const comments = await httpClient.getJsonAsync("/web/c-hdls/api/comments/" + props.nid)
console.log("comments", comments)


const url = computed(() => {
  return `/web/c-act/n/${props.nid}/play/view`
})

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

const starColor =  (score) => {
  if (score < 0) return "text-red-500"
  return "text-yellow-500"
}


const nbstars = (score) => {
  if (score < 0) return 1
  return Math.round(3* score / 11)
}

</script>

<template>
  <Tag icon="pi pi-comments" :value="comments.length" severity="secondary" @click="visible = true"></Tag>
  
  <div v-if="comments.length >0">
    <div v-if="nbstars(score) == 1">
      <i :class="'pi pi-star-fill ' + starColor(score)"></i>
    </div>
    <div v-else-if="nbstars(score) == 0">
      <i :class="'pi pi-star ' + starColor(score)"></i>
    </div>

    <div v-else-if="nbstars(score) == 2">
      <i :class="'pi pi-star-fill ' + starColor(score)"></i>
      <i :class="'pi pi-star-fill ' + starColor(score)"></i>  
    </div>
    <div v-else-if="nbstars(score) == 3">
      <i :class="'pi pi-star-fill ' + starColor(score)"></i>
      <i :class="'pi pi-star-fill ' + starColor(score)"></i>
      <i :class="'pi pi-star-fill ' + starColor(score)"></i>
    </div>
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
