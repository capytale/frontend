<script setup>
import { useSideMenuStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user';
const sideMenu = useSideMenuStore()
const user = useUserStore();

</script>
<template>
  <div class="header sticky top-0 z-50 w-full backdrop-blur flex-none border-b bg-gray-800 py-2">
    <!-- <span class="text-2xl text-gray-100 p-2"> -->
    <!--     <button @click="sideMenu.toggle"><i class="pi pi-bars"></i> </button> -->
    <!--   </span> -->
    <div class="center flex items-center gap-5 font-bold text-gray-100">
      <div>
        <span class="text-2xl tracking-wide uppercase myfont"> CAPYTALE </span>
      </div>
      <div class="w-full flex font-semibold justify-between">
        <div class="">
          <span class="px-2">Mes activités</span>
          <span class="px-2">La bibliothèque</span>
        </div>
        <div>
          <span class="px-2">{{ user.data.firstname }} {{ user.data.lastname }}</span>
          <span class="px-2">Déconnexion</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center {
  margin: auto;
  max-width: 1320px;
  padding: 6px 12px;
}

.myfont {
  font-family: "Ubuntu", Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 2px;
}
</style>
