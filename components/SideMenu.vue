<script setup>
import { useSideMenuStore } from '@/stores/ui'
const sideMenu = useSideMenuStore()
const code = useCodeStore()
</script>

<template>
  <div :class="sideMenu.visible ? 'sidemenu sidemenu-active' : 'sidemenu'"
    class="flex flex-col duration-300 bg-gray-800 shadow">
    <div class="space-y-3 p-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Dashboard</h2>
      </div>
      <div class="flex-1">
        <ul class="pt-2 pb-4 space-y-1 text-sm">
          <li>
            <a href="/" class="flex items-center p-2 space-x-3 rounded-md text-gray-100">
              <i class="pi pi-home"></i>
              <span class="">Accueil</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 space-x-3 rounded-md text-gray-100">
              <i class="pi pi-play"></i>
              <span @click="code.toggle">Jouer une activité</span>
            </a>
            <div v-if="code.visible" class="relative mt-2 rounded-md shadow-sm">
              <input type="text" name="code" id="code"
                class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="a12b-345678">
            </div>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 space-x-3 rounded-md text-gray-100">
              <i class="pi pi-plus"></i>
              <span class="">Créer une activité</span>
            </a>
          </li>
          <li>
            <a href="/ActiList" class="flex items-center p-2 space-x-3 rounded-md text-gray-100">
              <i class="pi pi-folder-open"></i>
              <span class="">Mes activités</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>    

<style scoped>
.sidemenu {
  position: fixed;
  width: 300px;
  height: calc(100vh - 6rem);
  z-index: 999;
  overflow-y: auto;
  -webkit-user-select: none;
  user-select: none;
  top: 7.65rem;
  left: 2rem;
  transition: transform .2s, left .2s;
  border-radius: 12px;
  padding: .5rem 1.5rem;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.sidemenu-active {
  transform: translate(-100%);
  left: 0;
}
</style>
