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
      <div v-if="sideMenu.visible || sideMenu.hover" class="flex-1 gap-4 mt-4 mr-4 p-card p-component"   @mouseleave="sideMenu.toggleHover">
        <SideMenu></SideMenu>
      </div>
      <div v-else class="flex gap-4 mt-4 mr-4 p-card p-component h-20"  @mouseover="sideMenu.toggleHover">
        <div class="space-y-3 p-3">
          <div class="flex-1">
            <span class="flex items-center px-2 py-5 space-x-3 rounded-md">
              <i class="pi pi-tags" @click="sideMenu.toggle" ></i>
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

  <!-- 
  <div :class="sideMenu.visible ? 'sidemenu sidemenu-active' : 'sidemenu'"
    class="flex flex-col duration-300 shadow gap-4">
    <SideMenu></SideMenu>
    <div :class="sideMenu.visible ? 'container mx-auto' : 'container sidemenu-inactive'">

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
</div>
</div> -->

</template>

<style>
.sidemenu-inactive {
  margin-left: 200px;
  padding-left: 4rem;
}
</style>