<script setup>
import { useSideMenuStore } from '@/stores/ui'
const sideMenu = useSideMenuStore()
const activeTag = useActiveTagStore()
const code = useCodeStore()

import { useMyStore } from '@/stores/my'
const my = useMyStore()
const tags = useTagsStore()
tags.getTags()
tags.getFlatTags()

const selectedKey = ref(null);
const createTagVisible = ref(false);
const label = ref('');
const wantSubTag = ref([]);
const selectedTag = ref([])

const save = () => {
  tags.createTag(label.value, Object.keys(selectedTag.value)[0] || 0)
  createTagVisible.value = false;
}

const onNodeSelect = (node) => {
  activeTag.activate(node.key)
};
const onNodeUnselect = (node) => {
  activeTag.activate(null)
};
</script>

<template>
    <div class="space-y-3 p-3">
      <div class="flex-1">
        <span class="flex items-center px-2 py-4 space-x-3 rounded-md">
          <i v-if="sideMenu.visible" class="pi pi-lock"  @click="sideMenu.visible = false" v-tooltip.right="{ value: 'Des-épingler le menu', showDelay: 300, hideDelay: 0 }"></i>
          <i v-else class="pi pi-lock-open"  @click="sideMenu.visible = true" v-tooltip.right="{ value: 'Épingler le menu', showDelay: 300, hideDelay: 0 }"></i>
          <!-- <i class="pi pi-tags"></i> -->
          <span class="parent mr-1">
            <span class="">Étiquettes</span>
            <div class="novalorise">
              <Button icon="pi pi-plus" severity="secondary" outlined rounded  size="small"/>
            </div>
            <div class="valorise">
              <Button icon="pi pi-plus" severity="info" @click="createTagVisible = true" rounded />
            </div>
          </span>
        </span>
        <div v-if="tags.tags.pending">loading......</div>
        <Tree v-else id="folders" v-model:selectionKeys="selectedKey" selectionMode="single" :value="tags.tags.data"
          class="w-full md:w-30rem" @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect">
          <template #default="slotProps">
            <div class="primary-nav left centerize">

              <MyTagEdit :slotProps="slotProps" :tags="tags.tags.data" />
            </div>
          </template>
        </Tree>
      </div>
    </div>

  <Dialog v-model:visible="createTagVisible" modal header="Créer une nouvelle étiquette" :style="{ width: '55rem' }">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="label" class="font-semibold w-6rem">Nom de l'étiquette</label>
      <InputText v-model="label" id="label" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center">
      <Checkbox v-model="wantSubTag" inputId="checked" name="checked" value="subTag" @change="handleWant(event)" />
      <label for="checked" class="ml-2">Imbriquer l'étiquette sous : </label>
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <Tree id="folders" v-model:selectionKeys="selectedTag" :value="tags.tags.data" selectionMode="single"
        class="w-full md:w-30rem" @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect">
        <template #default="slotProps">
          <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
        </template>
      </Tree>
    </div>
    <div cl:ass="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createTagVisible = false"></Button>
      <Button type="button" label="Save" @click="save"></Button>

    </div>
  </Dialog>

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
  padding: .5rem;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  background: var(--surface-0);
}

.dark-theme .sidemenu {
  background: var(--surface-50);
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
  /* justify-content: flex-end; */
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

.centerize {
  align-items: center;
}


.novalorise {
  display: inline;
  position: absolute;
  left: 120%;
  bottom: -50%;
  z-index: 1;
}


.valorise {
  display: none;
  position: absolute;
  left: 120%;
  bottom: -50%;
  z-index: 1;
}

.parent {
  position: relative;
}

.parent:hover .novalorise {
  display: none;
}

.parent:hover .valorise {
  display: inline;
}
</style>
