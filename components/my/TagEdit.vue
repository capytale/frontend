<script setup>
const my = useMyStore()
const tagstore = useTagsStore()

const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  slotProps: Object,
  tags: Object,
  required: true
})

const header = ref("Modifier l'étiquette");
const label = ref(props.slotProps.node.label);
const wantSubTag = ref([]);
const selectedTag = ref([])
const newTag = ref(false)
const editVisible = ref(false);
const colorVisible = ref(false);
const color = ref(props.slotProps.node.color);
const authSave = ref(true);

const menu = ref();
const items = ref([
  {
    label: "Pour cette étiquette: " + props.slotProps.node.label,
    items: [

      {
        label: 'Couleur',
        icon: 'pi pi-circle-fill',
        command: () => {
          colorVisible.value = true;
        }
      },
      {
        label: 'Modifier ',
        icon: 'pi pi-cog',
        command: () => {
          newTag.value = false;
          header.value = "Modifier l'étiquette";
          label.value = props.slotProps.node.label;
          selectedTag.value = props.slotProps.node.parentid != 0 ? { [props.slotProps.node.parentid]: true } : {}
          wantSubTag.value = props.slotProps.node.parentid != 0 ? ['subTag'] : []
          editVisible.value = true;
        }
      },
      {
        label: 'Ajouter une sous-étiquette',
        icon: 'pi pi-plus',
        command: () => {
          newTag.value = true
          header.value = "Ajouter une sous-étiquette"
          label.value = ""
          wantSubTag.value = ['subTag']
          selectedTag.value = { [props.slotProps.node.id]: true }
          editVisible.value = true;
        }
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: async () => {
          const hasChildren = await tagstore.hasChildren(props.slotProps.node.id)
          if (hasChildren) {
            confirm.require({
              message: 'La suppression de cette étiquette supprimera toutes les étiquettes enfants. Cette action est irréversible.',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Annuler',
              rejectClass: 'p-button-secondary p-button-outlined',
              acceptLabel: 'Supprimer',
              acceptClass: 'p-button-danger',
              accept: async () => {
                try {
                  await tagstore.destroyTag(props.slotProps.node.id)
                  toast.add({ severity: 'success', summary: 'Étiquettes supprimées', life: 2000 });
                }
                catch (e) {
                  toast.add({ severity: 'error', summary: 'Échec de suppression : ', detail: `nid = ${props.slotProps.node.nid} - ${e}` });
                }
              }
            })
          } else {
            try {
              await tagstore.destroyTag(props.slotProps.node.id)
              toast.add({ severity: 'success', summary: 'Étiquette supprimée', life: 2000 });
            }
            catch (e) {
              toast.add({ severity: 'error', summary: 'Échec de suppression : ', detail: `nid = ${props.slotProps.node.nid} - ${e}` });
            }
          }
        }
      },
    ]
  }
]
)
const toggle = (event) => {
  // console.log("event: ", event)
  // console.log("menu: ", menu)
  menu.value.toggle(event);
};

const save = async () => {
  if (newTag.value) {
    await tagstore.createTag(label.value, Object.keys(selectedTag.value)[0] || 0)
  } else {
    await tagstore.setTagLabel(props.slotProps.node.id, label.value)
    if (wantSubTag.value.length > 0 && Object.keys(selectedTag.value).length == 1) {
      await tagstore.setTagParent(props.slotProps.node.id, Object.keys(selectedTag.value)[0])
    } else {
      await tagstore.setTagParent(props.slotProps.node.id, 0)
    }
  }
  editVisible.value = false;
}
const saveColor = () => {
  tagstore.setTagColor(props.slotProps.node.id, "#" + color.value)
  colorVisible.value = false;
}

const isSuccessor = (id, notMe) => {
  if (id == notMe) {
    return true
  }
  const current = tagstore.flatTags.find(t => t.id == id)
  if (current.parentid == 0) {
    return current.id == notMe
  }
  const parent = tagstore.flatTags.find(t => t.id == current.parentid)
  return isSuccessor(parent.id, notMe)
}


const onNodeSelect = (event) => {
  wantSubTag.value = ['subTag']
  // console.log("authSave.value: ", authSave.value)

  if (isSuccessor(event.key, props.slotProps.node.id) && wantSubTag.value.length > 0) {
    authSave.value = false
    // console.log("authSave.value: ", authSave.value)
  } else {
    authSave.value = true
    // console.log("authSave.value: ", authSave.value)
  }
}
const onNodeUnselect = (event) => {
  wantSubTag.value = []
  authSave.value = true
}
const handleWant = (event) => {
  if (wantSubTag.value.length == 0) {
    // console.log("wantSubTag.value: ", wantSubTag.value)
    authSave.value = true
    selectedTag.value = []
  }
}
const corbeilleTid = () => {
  if (!props.tags.find(o => o.label === 'Corbeille')) return null
  return props.tags.find(o => o.label === 'Corbeille').id
}
// console.log("corbeille !!!", corbeilleTid())


</script>

<template>
  <div>
    <template v-if="slotProps.node.id == corbeilleTid()">
      <span v-tooltip.top="{ value: 'Voir/masquer les activités de la corbeille', showDelay: 500, hideDelay: 0 }"
        aria-controls="overlay_menu">
        <i class="pi pi-trash" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
      </span>

    </template>
    <template v-else>
      <span v-tooltip.top="{ value: '(Dés)activer le filtre sur cette étiquette', showDelay: 500, hideDelay: 0 }"
        aria-controls="overlay_menu">
        <i class="pi pi-tag" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
      </span>
      <i class="pi pi-cog surprise mx-2" @click.stop="toggle"></i>
    </template>
  </div>
  <Menu ref="menu" :model="items" :popup="true" />

  <Dialog v-model:visible="editVisible" modal :header="header" :style="{ width: '55rem' }" dismissableMask>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="label" class="font-semibold w-6rem">Nom de l'étiquette</label>
      <InputText v-model="label" id="label" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center">
      <Checkbox v-model="wantSubTag" inputId="checked" name="checked" value="subTag" @change="handleWant(event)" />
      <label for="checked" class="ml-2">Imbriquer l'étiquette sous : </label>
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <Tree id="folders" v-model:selectionKeys="selectedTag" :value="tags" selectionMode="single"
        class="w-full md:w-30rem" @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect">
        <template #default="slotProps">
          <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
        </template>
      </Tree>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Annuler" severity="secondary" @click="editVisible = false"></Button>
      <Button :disabled="!authSave" type="button" label="Enregistrer" @click="save"></Button>
      <div v-if="!authSave" class="info">Vous ne pouvez pas imbriquer une étiquette dans elle-même.</div>

    </div>
  </Dialog>
  <Dialog v-model:visible="colorVisible" modal :header="header" :style="{ width: '55rem' }" dismissableMask>
    <div class="flex align-items-center gap-3 mb-3">
      <ColorPicker v-model="color" inline />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="label" class="font-semibold w-6rem">Couleur </label>
      <InputText v-model="color" id="label" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Annuler" severity="secondary" @click="colorVisible = false"></Button>
      <Button type="button" label="Enregistrer" @click="saveColor"></Button>
    </div>
  </Dialog>
</template>

<style scoped>
/* Additionnal CSS in default.vue */

.surprise {
  display: none;
}

.info {
  color: gray;
  font-style: italic;
}
</style>
