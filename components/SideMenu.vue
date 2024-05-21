<script setup>
import { useSideMenuStore } from '@/stores/ui'
const sideMenu = useSideMenuStore()
const code = useCodeStore()
const { data: tags, pending: pnd, error: err, status: sts } = await fetchTags()


const menu = ref();
const items = ref([
  {
    label: "Pour cette étiquette",
    items: [

      {
        label: 'Couleur',
        icon: 'pi pi-circle-fill'
      },
      {
        label: 'Modifier',
        icon: 'pi pi-cog'
      },
      {
        label: 'Ajouter une sous-étiquette',
        icon: 'pi pi-plus'
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash'
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div :class="sideMenu.visible ? 'sidemenu sidemenu-active' : 'sidemenu'"
    class="flex flex-col duration-300 shadow gap-4">
    <div class="space-y-3 p-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold ">Dashboard</h2>
      </div>
      <div class="flex-1">
        <ul class="pt-2 pb-4 space-y-1">
          <li>
            <a href="/" class="flex items-center p-2 space-x-3 rounded-md">
              <i class="pi pi-home"></i>
              <span class="">Accueil</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 space-x-3 rounded-md">
              <i class="pi pi-play"></i>
              <span @click="code.toggle">Jouer une activité</span>
            </a>
            <div v-if="code.visible" class="relative mt-2 rounded-md shadow-sm">
              <input type="text" name="code" id="code"
                class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="a12b-345678">
            </div>
          </li>
          <li>
            <a href="#" class="flex items-center p-2 space-x-3 rounded-md">
              <i class="pi pi-plus"></i>
              <span class="">Créer une activité</span>
            </a>
          </li>
          <li>
            <a href="/ActiList" class="flex items-center p-2 space-x-3 rounded-md">
              <i class="pi pi-folder-open"></i>
              <span class="">Mes activités</span>
            </a>
          </li>
          <Tree id="folders" :value="tags" class="w-full md:w-30rem">
            <template #default="slotProps">
              <div class="primary-nav">
                <div class="left">
                  <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
                </div>
                <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" class="right" aria-haspopup="true"
                  aria-controls="overlay_menu" />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
              </div>
            </template>
          </Tree>
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
  top: 6rem;
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

.primary-nav {
  display: -webkit-flex;
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: flex-end;
  width: 150px;
}

.left {
  margin-right: auto;
}

.primary-nav:hover .right {
  visibility: visible;
}

.right {
  visibility: hidden;
}
</style>
