<script setup>
const tags = useTagsStore()

const label = ref('');
const wantSubTag = ref(false);
const selectedTag = ref(null);

const save = () => {

  if (wantSubTag.value.length == 0) {
    tags.createTag(label.value, 0)
  } else {
    const parentId = selectedTag.value ? Object.keys(selectedTag.value).shift() : 0
    tags.createTag(label.value, parentId)
  }
  visible.value = false;
}

const onNodeSelect = (node) => {
  selectedTag.value = node.key
  wantSubTag.value = ['subTag']
};
const onNodeUnselect = (node) => {
  selectedTag.value = null
  wantSubTag.value = []
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
const handleWant = (event) => {
  if (wantSubTag.value) {
    // console.log("wantSubTag.value: ", wantSubTag.value)
    selectedTag.value = []
  }
}

const visible = defineModel('visible')

</script>

<template>
  <Dialog v-model:visible="visible" modal header="Créer une nouvelle étiquette" :style="{ width: '55rem' }"
    dismissableMask>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="label" class="font-semibold w-6rem">Nom de l'étiquette</label>
      <InputText v-model="label" id="label" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center">
      <!-- <Checkbox v-model="wantSubTag" inputId="checked" name="checked" binary /> -->
      <Checkbox v-model="wantSubTag" inputId="checked" name="checked" value="subTag" @change="handleWant(event)" />
      <label for="checked" class="ml-2">Imbriquer l'étiquette sous : </label>
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <Tree id="folders" v-model:selectionKeys="selectedTag" :value="tags.tags" selectionMode="single"
        class="w-full md:w-30rem" @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect">
        <template #default="slotProps">
          <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
        </template>
      </Tree>
    </div>
    <div class="flex justify-center gap-2">
      <Button type="button" label="Annuler" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Enregistrer" @click="save"></Button>

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
