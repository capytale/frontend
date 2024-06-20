<script setup>
import { useUserStore } from '@/stores/user'
const user = useUserStore()
user.getUser()

const props = defineProps({
  data: Object,
  required: true
})

const addComment = ref(false);
const hasAlreadyCommented = ref(false);
hasAlreadyCommented.value = props.data.comments && user.user.data && props.data.comments.find(c => c.uid == user.user.data.uid) != null

const rating = ref(null);
const ratingComite = ref(null);
const signalChecked = ref(null);
// const eth = ref(1)
const cla = ref(0)
const fon = ref(0)
const uti = ref(0)
const per = ref(0)
const app = ref(0)

const icon = ((eth) => {
  if (eth == -1) {
    return ['pi pi-minus text-red-600', 'pi ']
  } else if (eth == 0) {
    return ['pi pi-circle text-gray-600', 'pi ']
  } else if (eth == 1) {
    return ['pi pi-plus text-green-600', 'pi']
  }
})

const sumComite = computed(() => {
  return cla.value + fon.value + uti.value + per.value + app.value
})

const nbStarsComite = computed(() => {
  return Math.max(0, sumComite.value)
})

const apprComite = computed(() => {
  let sum = sumComite
  if (sum < 0) return { sum, avis: "À dépublier de la bibliothèque", icon: "pi pi-ban text-red-600" }
  else if (sum < 5) return { sum, avis: "A sa place dans la bibliothèque", icon: "pi pi-check text-green-600" }
  else return { sum, avis: "Mérite le Label de Grande Qualité", icon: "pi pi-verified text-orange-600" }
})

const rotate = ((eth) => {
  if (eth == 0) {
    return 1
  } else if (eth == 1) {
    return -1
  } else if (eth == -1) {
    return 0
  }
})

const initials = (nom, prenom) => {
  return nom.charAt(0) + prenom.charAt(0)
}
</script>

<template>

  <div v-if="!hasAlreadyCommented && !addComment">
    <Button label="Ajouter un commentaire" @click="addComment = true" />
  </div>

  <div v-if="addComment" class="flex flex-col">
    <div class="box mt-5">
      <Rating v-model="rating" :disabled="signalChecked">
        <template #cancelicon>
          <i class="pi pi-times text-gray-400 mr-6" style="font-size: 1.5rem"></i>
        </template>
        <template #onicon>
          <i class="pi pi-star-fill text-yellow-400" style="font-size: 2.5rem"></i>
        </template>
        <template #officon>
          <i class="pi pi-star text-gray-400" style="font-size: 2.5rem"></i>
        </template>
      </Rating>
      <div>
        <Checkbox v-model="signalChecked" inputId="signaler" :binary="true" @change="rating = null" />
        <label for="signaler" class="ml-2"> Signaler </label>
      </div>
    </div>


    <FloatLabel class="my-8">
      <Textarea v-model="value" rows="5" style="width: 100%;" />
      <label>Votre commentaire</label>
    </FloatLabel>
    <div>
      <Rating v-model="nbStarsComite" :cancel="false">
        <template #cancelicon>
          <i class="pi pi-times text-gray-400 mr-6" style="font-size: 1.5rem"></i>
        </template>
        <template #onicon>
          <i class="pi pi-star-fill text-yellow-400" style="font-size: 2.5rem"></i>
        </template>
        <template #officon>
          <i class="pi pi-star text-gray-400" style="font-size: 2.5rem"></i>
        </template>
      </Rating>

      {{ apprComite.sum }} pts <i :class="apprComite.icon"></i> {{ apprComite.avis }}

    </div>
    <div class="flex">


      <!-- <div @click="eth = rotateShort(eth)" class="manual-rating"
        v-tooltip.top="{ value: 'L’activité n’est pas un simple clone.', showDelay: 300, hideDelay: 0 }">
        <div><font-awesome icon="balance-scale" /><span class="mx-2">Éthique </span></div>
        <span class="space-rating">
          <i :class="icon(eth)[0]"></i><i :class="icon(eth)[1]"></i>
        </span>
      </div> -->
      <div @click="cla = rotate(cla)" class="manual-rating"
        v-tooltip.top="{ value: 'Les consignes pour le public cible (élève, enseignant) sont claires.', showDelay: 300, hideDelay: 0 }">
        <div><font-awesome icon="glasses" /><span class="mx-2">Clarté </span></div>
        <span class="space-rating">
          <i :class="icon(cla)[0]"></i><i :class="icon(cla)[1]"></i>
        </span>
      </div>
      <div @click="fon = rotate(fon)" class="manual-rating"
        v-tooltip.top="{ value: 'Un vrai travail de fond a été réalisé sur l’activité, y compris sur un thème simple. L’activité permet aux autres utilisateurs de gagner du temps, ou elle apporte des idées intéressantes pour traiter un thème.', showDelay: 300, hideDelay: 0 }">
        <div><font-awesome icon="lightbulb" /><span class="mx-2">Fond </span></div>
        <span class="space-rating">
          <i :class="icon(fon)[0]"></i><i :class="icon(fon)[1]"></i>
        </span>
      </div>
      <div @click="uti = rotate(uti)" class="manual-rating"
        v-tooltip.top="{ value: 'L’activité est utilisable en l’état ou presque.', showDelay: 300, hideDelay: 0 }">
        <div><font-awesome icon="recycle" /><span class="mx-2">Utilisabilité </span></div>
        <span class="space-rating">
          <i :class="icon(uti)[0]"></i><i :class="icon(uti)[1]"></i>
        </span>
      </div>
      <div @click="per = rotate(per)" class="manual-rating"
        v-tooltip.top="{ value: 'Il y a adéquation entre le titre, les objectifs annoncés dans le descriptif de l’activité et le contenu de l’activité.', showDelay: 300, hideDelay: 0 }">
        <div><font-awesome icon="bullseye" /><span class="mx-2">Pertinence </span></div>
        <span class="space-rating">
          <i :class="icon(per)[0]"></i><i :class="icon(per)[1]"></i>
        </span>
      </div>
      <div @click="app = rotate(app)" class="manual-rating"
        v-tooltip.top="{ value: 'L’orthographe, la grammaire et la typographie sont de bonne qualité.', showDelay: 300, hideDelay: 0 }">
        <div><font-awesome icon="spell-check" /><span class="mx-2">Apparence </span></div>
        <span class="space-rating">
          <i :class="icon(app)[0]"></i><i :class="icon(app)[1]"></i>
        </span>
      </div>
    </div>
    <Button label="Poster" @click="addComment = false" :disabled="rating === null && !signalChecked && sumComite != 1" />
  </div>
  <DataView :value="data.comments">
    <template #list="slotProps">
      <div class="flex flex-col">




        <div v-for="(item, index) in slotProps.items" :key="index">
          <hr class="my-4" />
          <div class="card">
            <Badge :value="initials(item.prenom, item.nom)" size="xlarge" severity="success"></Badge>
            {{ item.nom }} {{ item.prenom }}
            Il y a {{ timeElapsed(item.created * 1000) }}
            <div>
              <!-- <span>Ethique{{ item.eth }}</span> -->
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

</template>


<style scoped>
.manual-rating {
  cursor: pointer;
  display: inline-grid;
  width: 8em;
}

.space-rating {
  width: 2em;
}

.box {
  display: flex;
  justify-content: space-between;
}
</style>