<script setup>
</script>

<template>
  <div style="width: 100%">
    <div class="flex gap-6">
        <NuxtLink to="/mentions_legales" class="link">Mentions légales</NuxtLink>
        <NuxtLink to="/cgu" class="link">Conditions générales d'utilisation</NuxtLink>
        <NuxtLink to="/rgpd" class="link">Politique de protection des données personnelles</NuxtLink>
        <NuxtLink to="/contact" class="link">Contact</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.link {
  color: var(--p-primary-color);
}
</style>
