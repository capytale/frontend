<script setup>
import { useBibStore } from '@/stores/bib'
import { timeElapsed } from '~/utils/format';

const props = defineProps({
  data: Object,
  required: true
})
const visible = ref(false);
const addComment = ref(false);
const hasAlreadyCommented = ref(false);
hasAlreadyCommented.value = props.data.comments && props.data.comments.find(c => c.uid == 4343) != null


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
  return (5 * s / 11)
})

const initials = (nom, prenom) => {
  return nom.charAt(0) + prenom.charAt(0)
}

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
      <Rating v-model="nbstars" :cancel="false" class="stars mx-2" />
    </span>
    ({{ nbComms }})
  </div>
  <Dialog v-model:visible="visible" maximizable modal :header="'Header ' + data.nid"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :style="{ width: '50%' }">

    <DataView :value="data.comments">
      <template #list="slotProps">
        <div class="flex flex-col">

          <div v-if="addComment" class="flex flex-col">
            <FloatLabel class="my-8">
              <Textarea v-model="value" rows="5" style="width: 100%;" />
              <label>Votre commentaire</label>
            </FloatLabel>
            <div class="flex">
              <font-awesome icon="balance-scale" /> Éthique
              <font-awesome icon="glasses" /> Clarté
              <font-awesome icon="lightbulb" /> Fond
              <font-awesome icon="recycle" /> Utilisabilité
              <font-awesome icon="bullseye" /> Pertinence
              <font-awesome icon="spell-check" /> Apparence
            </div>
            <Button label="Poster" @click="addComment = false"/>
          </div>

          <div v-else-if="!hasAlreadyCommented">
            <Button label="Ajouter un commentaire" @click="addComment = true"/>
          </div>


          <div v-for="(item, index) in slotProps.items" :key="index">
            <hr class="my-4" />
            <div class="card">
              <Badge :value="initials(item.prenom, item.nom)" size="xlarge" severity="success"></Badge>
              {{ item.nom }} {{ item.prenom }}
              Il y a {{ timeElapsed(item.created * 1000) }}
              <div>
                <span>Ethique{{ item.eth }}</span>
                <span>Clarté{{ item.clr }}</span>
                <span>Fond{{ item.fon }}</span>
                <span>Utilisabilité{{ item.uti }}</span>
                <span>Pertinence{{ item.per }}</span>
                <span>Apparence : {{ item.app }}</span>
              </div>
              <div>Commentaire : {{ item.subject }}</div>
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
  color: #ffd90088;
}

.p-rating .p-rating-item .p-rating-icon {
  font-size: 1.5rem;
  color: #ccc;
}
</style>