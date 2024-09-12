<script setup>
document.title = "Capytale"
const sideMenu = useSideMenuStore()
const activites = useActivitiesStore()
const tags = useTagsStore()
const user = useUserStore()

activites.getActivities()
tags.getAllTags()

// Possible interaction dynamique avec le viewport pour auto-hide du menu
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const bpsmAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const bplargerThanSm = breakpoints.greater('sm') // only larger than sm
const bplgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const bpsmallerThanLg = breakpoints.smaller('lg') // only smaller than lg

//TODO : à voir !
//fin du todo


const handleResize = (event) => {
  // console.log("Ces valeurs pourraient être intégrées dans les pref utilisateur et chargées au démarrage")
  // console.log(event.sizes)
  // TODO : sauvegarder la taille dans les prefs utilisateur
}

// TODO : récupérer la dernière size dans les prefs utilisateur
const size = [20,80]

const sideState = computed(() => {
  if(activites.activities.data?.length === 0) return "empty";
  if(bplgAndSmaller.value) return "collapsed";
  return "visible";
})

const gutter = computed(() => {
  return sideMenu.visible && sideState.value !== 'empty' ? 4 : 0
})

const isReady = computed(() => {
  return {
    acti : activites.activities.status === 'success',
    tags : tags.status === 'success',
    user : user.user.status === 'success',
    all : activites.activities.status === 'success' && tags.status === 'success' && user.user.status === 'success'
  }
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-4 my-4">
      <MyActivityPlay />
      <MyActivityAdd />
    </div>
    <Splitter @resizeend="handleResize" class="relative" :gutterSize="gutter">
    <SplitterPanel :size="size[0]" v-show="sideMenu.visible && sideState !== 'empty'">
      <SideMenu v-if="isReady.tags" />
    </SplitterPanel>
    <SplitterPanel :size="size[1]">
    <div class="flex flex-row overflow-scroll">
      <div>
      <div v-if="!sideMenu.visible && sideState !== 'empty'" class="mt-16 h-16 w-16 rounded-full border-2 flex justify-center items-center absolute top-0 -left-8 z-[99]" style="background-color: var(--p-card-background)" @mouseover="sideMenu.hover = true">
      <i class="pi pi-tags" style="font-size: 1.5rem;"></i>
      </div>
      <div v-if="sideMenu.hover && !sideMenu.visible" class="absolute top-24 left-6 z-[100] p-card" @mouseleave="sideMenu.hover = false">
      <SideMenu v-if="isReady.tags" />
      </div>
      </div>
      <MyListSkeleton v-if="!isReady.all" />
      <MyList v-else />
    </div>
    </SplitterPanel>
    </Splitter>
  </div>

</template>

<style scoped>
/* Additionnal CSS in default.vue */
</style>
