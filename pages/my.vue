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

</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-4 mt-4">
      <MyActivityPlay />
      <MyActivityAdd />
    </div>
    <div class="flex">
      <div v-if="sideMenu.visible" class="flex-1 gap-4 mt-4 mr-4 p-card p-component">
        <SideMenu></SideMenu>
      </div>
      <div v-else-if="sideMenu.hover" class="flex gap-4 mt-4 mr-4 p-card p-component h-20">
        <div class="space-y-3 p-3"> <span class="py-5"><i class="pi pi-tags" @click="sideMenu.visible = false"></i></span> </div>
        <div class="fixed mr-4 p-card p-component" @mouseleave="sideMenu.hover = false">
          <SideMenu></SideMenu>
        </div>
      </div>
      <div v-else class="flex gap-4 mt-4 mr-4 p-card p-component h-20" @mouseover="sideMenu.hover = true">
        <div class="space-y-3 p-3">
          <div class="flex-1">
            <span class="flex items-center py-5 rounded-md">
              <i class="pi pi-tags" @click="sideMenu.visible = true"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex gap-4 mt-4">
          <MyList />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* Additionnal CSS in default.vue */
</style>
