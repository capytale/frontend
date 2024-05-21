<script setup>
document.title = "Capytale"

const { data: user, pending, error, status } = await fetchCurrentUser()

</script>

<template>
  <template v-if="user">
    <div class="flex gap-4 mt-4">
      <MyActivityPlay />
      <MyActivityAdd />
    </div>
    <div class="flex gap-4 mt-4">
      <MyList />
    </div>
  </template>
  <template v-else>
    <div class="flex-1 gap-4 mt-4">
        <p>Accès interdit aux utilisateurs non connectés.</p>
    </div>
  </template>
</template>
