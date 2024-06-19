<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()
user.getUser()
console.log("ussser", user.user)

const props = defineProps({
  data: Object,
  required: true
})

const addComment = ref(false);
const hasAlreadyCommented = ref(false);
hasAlreadyCommented.value = props.data.comments && props.data.comments.find(c => c.uid == 4343) != null


const initials = (nom, prenom) => {
  return nom.charAt(0) + prenom.charAt(0)
}

</script>

<template>
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

</template>