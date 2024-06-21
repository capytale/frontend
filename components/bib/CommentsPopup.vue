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

const apprComite = computed(() => {
  let sum = cla.value + fon.value + uti.value + per.value + app.value
  if (sum < 0) return { sum, avis: "À dépublier de la bibliothèque", icon: "ban", class: "text-red-600" }
  else if (sum < 10) return { sum, avis: "", icon: "pi" }
  else return { sum, avis: "Mérite le Label de Grande Qualité", icon: "medal", class: "text-orange-600" }
})

const initials = (nom, prenom) => {
  return nom.charAt(0) + prenom.charAt(0)
}

const info = ref(false);
const toggle = (event) => {
  op.value.toggle(event);
}

const detailIconSize = "font-size: 1.5rem"
</script>

<template>
  <Badge :value="initials(user.user.data.firstname, user.user.data.lastname)" size="xlarge" severity="success"></Badge>

  {{ user.user.data.firstname }} {{ user.user.data.lastname }}

  <div v-if="!hasAlreadyCommented && !addComment">
    <Button label="Ajouter un commentaire" @click="addComment = true" class="my-6" />
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
        <label for="signaler" class="ml-2">Demander la dépublication </label>
        <i class="pi pi-info-circle" @click="info = true"></i>
        <Dialog v-model:visible="info" modal header="Demander la dépublication" :style="{ width: '45rem' }">
          <div class="my-6">
            <p>Pour cette activité, vous estimez que le contenu :</p>
            <ul>
              <li>- Est inapproprié ou offensant</li>
              <li>- Ne respecte des règles de la plateforme</li>
              <li>- Est objectivement sans intérêt</li>
            </ul>
            <p>Merci détailler votre demande dans le champ commentaires.</p>
            <p>Votre signalement sera étudié par le comité éditorial.</p>
          </div>
          <Button type="button" label="J'ai compris" severity="secondary" @click="info = false"></Button>
        </Dialog>
      </div>
    </div>

    <Fieldset legend="Détails (optionnel)" :toggleable="true" class="mt-6">
      <div class="flex">
        <div class="manual-rating"
          v-tooltip.top="{ value: 'Les consignes pour le public cible (élève, enseignant) sont claires.', showDelay: 300, hideDelay: 0 }">
          <div><font-awesome icon="glasses" /><span class="mx-2">Clarté </span></div>
          <span class="space-rating">
            <i :class="cla == -2 ? 'pi pi-thumbs-down mr-2 text-red-400' : 'pi pi-thumbs-down mr-2 text-gray-300q'"
              v-tooltip.bottom="{ value: 'Insuffisant', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="cla = cla == -2 ? 0 : -2"></i>
            <i :class="cla == 1 ? 'pi pi-check mr-2 text-green-600' : 'pi pi-check mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Bien', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="cla = cla == 1 ? 0 : 1"></i>
            <i :class="cla == 2 ? 'pi pi-thumbs-up mr-2 text-green-600' : 'pi pi-thumbs-up mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Très bien !', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="cla = cla == 2 ? 0 : 2"></i>
          </span>
        </div>
        <div class="manual-rating"
          v-tooltip.top="{ value: 'L’activité apporte des idées intéressantes pour traiter un thème ou elle permet de gagner du temps.', showDelay: 300, hideDelay: 0 }">
          <div><font-awesome icon="lightbulb" /><span class="mx-2">Fond </span></div>
          <span class="space-rating">
            <i :class="fon == -2 ? 'pi pi-thumbs-down mr-2 text-red-400' : 'pi pi-thumbs-down mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Insuffisant', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="fon = fon == -2 ? 0 : -2"></i>
            <i :class="fon == 1 ? 'pi pi-check mr-2 text-green-600' : 'pi pi-check mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Bien', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="fon = fon == 1 ? 0 : 1"></i>
            <i :class="fon == 2 ? 'pi pi-thumbs-up mr-2 text-green-600' : 'pi pi-thumbs-up mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Très bien !', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="fon = fon == 2 ? 0 : 2"></i>
          </span>
        </div>
        <div class="manual-rating"
          v-tooltip.top="{ value: 'L’activité est utilisable en l’état ou presque.', showDelay: 300, hideDelay: 0 }">
          <div><font-awesome icon="recycle" /><span class="mx-2">Utilisabilité </span></div>
          <span class="space-rating">
            <i :class="uti == -2 ? 'pi pi-thumbs-down mr-2 text-red-400' : 'pi pi-thumbs-down mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Insuffisant', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="uti = uti == -2 ? 0 : -2"></i>
            <i :class="uti == 1 ? 'pi pi-check mr-2 text-green-600' : 'pi pi-check mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Bien', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="uti = uti == 1 ? 0 : 1"></i>
            <i :class="uti == 2 ? 'pi pi-thumbs-up mr-2 text-green-600' : 'pi pi-thumbs-up mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Très bien !', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="uti = uti == 2 ? 0 : 2"></i>
          </span>
        </div>
        <div class="manual-rating"
          v-tooltip.top="{ value: 'Il y a adéquation entre le titre, les objectifs annoncés dans le descriptif de l’activité et le contenu de l’activité.', showDelay: 300, hideDelay: 0 }">
          <div><font-awesome icon="bullseye" /><span class="mx-2">Pertinence </span></div>
          <span class="space-rating">
            <i :class="per == -2 ? 'pi pi-thumbs-down mr-2 text-red-400' : 'pi pi-thumbs-down mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Insuffisant', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="per = per == -2 ? 0 : -2"></i>
            <i :class="per == 1 ? 'pi pi-check mr-2 text-green-600' : 'pi pi-check mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Bien', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="per = per == 1 ? 0 : 1"></i>
            <i :class="per == 2 ? 'pi pi-thumbs-up mr-2 text-green-600' : 'pi pi-thumbs-up mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Très bien !', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="per = per == 2 ? 0 : 2"></i>
          </span>
        </div>
        <div class="manual-rating"
          v-tooltip.top="{ value: 'L’orthographe, la grammaire et la typographie sont de bonne qualité.', showDelay: 300, hideDelay: 0 }">
          <div><font-awesome icon="spell-check" /><span class="mx-2">Apparence </span></div>
          <span class="space-rating">
            <i :class="app == -2 ? 'pi pi-thumbs-down mr-2 text-red-400' : 'pi pi-thumbs-down mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Insuffisant', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="app = app == -2 ? 0 : -2"></i>
            <i :class="app == 1 ? 'pi pi-check mr-2 text-green-600' : 'pi pi-check mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Bien', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="app = app == 1 ? 0 : 1"></i>
            <i :class="app == 2 ? 'pi pi-thumbs-up mr-2 text-green-600' : 'pi pi-thumbs-up mr-2 text-gray-300'"
              v-tooltip.bottom="{ value: 'Très bien !', showDelay: 300, hideDelay: 0 }" :style="detailIconSize"
              @click="app = app == 2 ? 0 : 2"></i>
          </span>
        </div>
      </div>
      <div>
        {{ apprComite.sum }} pts <font-awesome :icon="apprComite.icon" :class="apprComite.class" /> {{ apprComite.avis
        }}
      </div>
    </Fieldset>

    <Textarea v-model="value" rows="5" style="width: 100%;" class="my-6" placeholder="Votre commentaire" />

    <Button label="Poster" @click="addComment = false" :disabled="rating === null && !signalChecked" />

  </div>


  <div v-if="data.comments.length == 0">
    <div class="text-center text-gray-400">Aucun commentaire</div>
  </div>

  <DataView v-else :value="data.comments">
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
  width: 6em;
  padding-top: 10px;
  ;
}

.box {
  display: flex;
  justify-content: space-between;
}



.bordure {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 1em;
  margin-top: 1em
}
</style>