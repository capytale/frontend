
<script setup>
const props = defineProps({
  nid: String,
})
const share = ref(false);
const web = ref(false);
</script>



<template>
  <span class="p-text-secondary block mb-5">Titre de la ressource {{ nid }}</span>
  <Checkbox v-model="share" id="share" :binary="true" />
  <label for="share" class="font-semibold w-6rem">Publier dans la bibliothèque ENTRE ENSEIGNANTS</label>
  <div class="details">
    En cochant cette case, vous partagez votre activité avec les enseignants possédant un compte sur Capytale.
  </div>
  <template v-if="share">
    <Checkbox v-model="web" id="web" :binary="true" />
    <label for="web" class="font-semibold w-6rem">Publier dans la bibliothèque POUR TOUS</label>
    <div class="details">
      En cochant cette case, vous partagez votre activité sans restriction de statut. Elle sera visible par tout
      utilisateur de Capytale, y compris les élèves.
    </div>
  </template>
  <label for="description" class="font-semibold w-6rem">Résumé</label>
  <Textarea id="resume" v-model="resume" autoResize rows="3" cols="30" />
</template>
