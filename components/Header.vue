<script setup>
import { useSideMenuStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user';
const sideMenu = useSideMenuStore()
const user = useUserStore();

</script>
<template>
  <div class="header sticky top-0 z-50 w-full backdrop-blur flex-none border-b bg-gray-800 py-2">
    <span class="text-2xl text-gray-100 p-2">
        <button @click="sideMenu.toggle"><i class="pi pi-bars"></i> </button>
      </span>
    <span class="text-2xl text-gray-100"> CAPYTALE </span>
    <span class="text-gray-100">{{ user.data.firstname }} {{ user.data.lastname }}</span>
    <div class="menu">
    </div>
  </div>
</template>
