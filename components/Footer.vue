<script setup lang="ts">
const userStore = useCurrentUserStore()
const currentRoute = useRoute();

const backToLegacy = () => {
  let backUrl: string = '/web/my?legacy&force'
  if (currentRoute.name === 'bibliotheque') {
    backUrl = '/web/bibliotheque?legacy&force'
  } else if (currentRoute.name === 'assignments-nid') {
    backUrl = `/web/assignments/${currentRoute.params.nid}?legacy&force`
  }
  window.location.assign(backUrl)
}
</script>

<template>
  <div style="width: 100%">
    <div class="flex flex-col md:flex-row gap-6 flex-wrap">
      <NuxtLink to="https://capytale2.ac-paris.fr/wiki/" class="link">Documentation</NuxtLink>
      <NuxtLink to="/mentions_legales" class="link">Mentions légales</NuxtLink>
      <NuxtLink to="/cgu" class="link">Conditions générales d'utilisation</NuxtLink>
      <NuxtLink to="/rgpd" class="link">Politique de protection des données personnelles</NuxtLink>
      <NuxtLink to="/contact" class="link">Contact</NuxtLink>
      <span v-if="userStore.isAuthenticated" @click="backToLegacy" class="link cursor-pointer">Ancienne interface</span>
    </div>
  </div>
</template>

<style scoped>
.link {
  color: var(--p-primary-color);
  white-space: normal;
}
</style>
