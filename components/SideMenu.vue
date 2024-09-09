<script setup>
const sideMenu = useSideMenuStore()
const activeTag = useActiveTagStore()

const tags = useTagsStore()
await tags.getTags()
await tags.getFlatTags()

const selectedKey = ref(null);
const createTagVisible = ref(false);

const onNodeSelect = (node) => {
  activeTag.activate(node.key)
};
const onNodeUnselect = (node) => {
  activeTag.activate(null)
};

const expandedKeys = ref({});

const expandNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true;

    for (let child of node.children) {
      expandNode(child);
    }
  }
};

const visible = ref(false);
const checked = ref(false);
const strictSearch = ref(false);
</script>

<template>
  <div class="space-y-3 p-3">
    <div class="flex flex-col">
      <span class="flex items-center px-2 py-4 space-x-3 rounded-md">
        <i v-if="sideMenu.visible" class="pi pi-thumbtack highlight" @click="sideMenu.visible = false"
          v-tooltip.right="{ value: 'Des-épingler le menu', showDelay: 300, hideDelay: 0 }"></i>
        <i v-else class="pi pi-thumbtack unpinned highlight" @click="sideMenu.visible = true"
          v-tooltip.right="{ value: 'Épingler le menu', showDelay: 300, hideDelay: 0 }"></i>
        <span class="parent mr-1">
          <span class="font-bold">Étiquettes</span>
          <Button type="button" icon="pi pi-info-circle" aria-label="Info sur les étiquettes" text @click="visible = true"
            v-tooltip.right="{ value: 'Info sur les étiquettes', showDelay: 300, hideDelay: 0 }" />
        </span>
      </span>
      <Button label="Ajouter une étiquette" severity="secondary" size="small" class="self-center" icon="pi pi-plus" @click="createTagVisible = true" />
      <Divider />
      <div v-if="tags.tags.pending">loading......</div>
      <template v-else>
        <Tree id="folders" v-model:expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" selectionMode="single"
          :value="tags.tags.data" class="w-full md:w-30rem" @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect"
          :filter="checked" :filterMode="strictSearch ? 'strict' : 'lenient'" :dt="{ 'padding': '0' }">
          <template #default="slotProps">
            <div class="primary-nav left centerize">

              <MyTagEdit :slotProps="slotProps" :tags="tags.tags.data" />
            </div>
          </template>
        </Tree>
      </template>
    </div>
  </div>

  <SideMenuDialog v-model:visible="createTagVisible" />

  <DialogIframe v-model="visible" header="Aide" url="https://capytale2.ac-paris.fr/wiki/doku.php?id=etiquettes_vue" />
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
  background: var(--p-surface0);
}

.dark .sidemenu {
  background: var(--p-surface50);
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
  /* bottom: -50%; */
  z-index: 1;
}


.valorise {
  display: none;
  position: absolute;
  left: 120%;
  /* bottom: -50%; */
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

.unpinned {
  color: #ccc;
}

.highlight {
  cursor: pointer;
  padding: 0.7em;
  border-radius: 2em;
  border: 1px solid #ccc;
}

.highlight:hover {
  cursor: pointer;
  padding: 0.7em;
  border: 1px solid #aaa;
}

.rech-avancee {
  padding-left: 0.5em;
  width: 20rem;
}
</style>
