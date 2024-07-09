<script setup>
document.title = "Capytale"
const sideMenu = useSideMenuStore()


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

<style>
.sidemenu-inactive {
  margin-left: 200px;
  padding-left: 4rem;
}

.fixed {
  position: fixed;
  z-index: 1000;
}
</style>