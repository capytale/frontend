<script setup>
document.title = "Capytale"
useHead({
  htmlAttrs: {
    lang: 'fr',
    style: 'font-size: 13px'
  }
})
</script>


<template>
  <Header></Header>
  <div class="flex">
    <!-- <SideMenu></SideMenu> -->
    <div class="container mx-auto">
      <div>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style>
.container {
  margin: auto;
  max-width: 1320px;
  padding: 6px;
}
.p-component {
  font-size:1.3rem;
}
.p-badge {
  font-size:1rem;
}
.p-tag {
  font-size:1rem;
}
.p-button {
  /* font-size:125%; */
}

</style>
