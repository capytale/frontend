<script setup>
const props = defineProps({
  isTeacher: Boolean,
})

</script>

<template>
  <template v-if="props.isTeacher">
    <h1>Bienvenue sur Capytale</h1>

    <p class="mt-8 mb-10">
      Vous n'avez encore aucune activité. Voici les trois étapes pour travailler le codage ou les sciences en général
      avec vos élèves.
    </p>

    <CapyTimeline />

  </template>
  <template v-else>
    <h1>Bienvenue sur Capytale</h1>

    <p class="mt-8 mb-10">
      Vous n'avez encore aucune activité. Si votre enseignant vous a donné un code, saisissez-le et cliquez sur le
      bouton "Go !".
    </p>

  </template>
</template>


<style scoped>
.image {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
</style>
