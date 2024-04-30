<script setup>
const theme = useThemeStore()
const sideMenu = useSideMenuStore()

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
    <div class="flex bggray">
      <SideMenu></SideMenu>
      <div :class="sideMenu.visible ? 'container mx-auto' : 'container sidemenu-inactive'">
        <div>
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
 .sidemenu-inactive {
    margin-left: 300px;
    padding-left: 4rem;
}
 .pousse {
    margin-left: 0;
  transition: margin-left .2s;
 }

html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
}

 .container {
   min-width:400px;
   max-width:80%;
 }
 .dark-theme .bggray {
 background: var(--gray-700);
 }

 .bggray {
 background: var(--gray-100);
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
