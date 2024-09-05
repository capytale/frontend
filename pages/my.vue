<script setup>
document.title = "Capytale"
const sideMenu = useSideMenuStore()

// Possible interaction dynamique avec le viewport pour auto-hide du menu
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const bpsmAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const bplargerThanSm = breakpoints.greater('sm') // only larger than sm
const bplgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const bpsmallerThanLg = breakpoints.smaller('lg') // only smaller than lg

//TODO : à voir !
//fin du todo

const { data: user, pending, error, status } = await fetchCurrentUser()

const handleResize = (event) => {
  console.log("Ces valeurs pourraient être intégrées dans les pref utilisateur et chargées au démarrage")
  console.log(event.sizes)
  // TODO : sauvegarder la taille dans les prefs utilisateur
}

// TODO : récupérer la dernière size dans les prefs utilisateur
const size = [25,75]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-4 my-4">
      <MyActivityPlay />
      <MyActivityAdd />
    </div>
    <Splitter @resizeend="handleResize">
    <SplitterPanel :size="size[0]">
      <SideMenu />
    </SplitterPanel>
    <SplitterPanel :size="size[1]">
      <MyList />
    </SplitterPanel>
    </Splitter>
  </div>

</template>

<style scoped>
/* Additionnal CSS in default.vue */
</style>
