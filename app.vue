<script setup>
const theme = useThemeStore()

const currentThemeClass = computed(() => {
  return theme.current + "-theme"
})


document.title = "Capytale"
useHead({
  htmlAttrs: {
    lang: 'fr',
    style: 'font-size: 13px'
  }
})
</script>


<template>
  <div :class="'appContainer ' + currentThemeClass">
    <Header></Header>
    <div class="flex">
      <!-- <SideMenu></SideMenu> -->
      <div class="container mx-auto">
        <div>
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
}

.appContainer {
  height: 100%;
  display: grid;
  grid-template-rows: 60px 1fr;
  overflow: hidden;

  &>*:nth-child(2) {
    overflow-y: auto;
  }
}

.dark-theme .p-card {
  border: 1px solid var(--gray-600);
}

.p-component {
  font-size: 1.3rem;
}

.p-badge {
  font-size: 1rem;
}

.p-tag {
  font-size: 1rem;
}

</style>
