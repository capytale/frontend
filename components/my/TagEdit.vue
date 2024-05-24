<script setup>
import Dialog from 'primevue/dialog';
import ColorPicker from 'primevue/colorpicker';

const props = defineProps({
  slotProps: Object,
  tags: Object,
  required: true
})



const header = ref("Modifier l'étiquette");
const label = ref(props.slotProps.node.label);
const wantSubTag = ref([]);
const selectedTag = ref([])
const editVisible = ref(false);
const colorVisible = ref(false);
const color = ref(props.slotProps.node.color);

const menu = ref();
const items = ref([
  {
    label: "Pour cette étiquette" + props.slotProps.node.label,
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
          header.value = "Modifier l'étiquette";
          label.value = props.slotProps.node.label;
          wantSubTag.value = []
          selectedTag.value = {}
          editVisible.value = true;
        }
      },
      {
        label: 'Ajouter une sous-étiquette',
        icon: 'pi pi-plus',
        command: () => {
          header.value = "Ajouter une sous-étiquette"
          label.value = ""
          wantSubTag.value = ['subTag']
          selectedTag.value = { [props.slotProps.node.id]: true }
          editVisible.value = true;
        }
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash'
      }
    ]
  }
]
)
const toggle = (event) => {
  console.log("event: ", event)
  console.log("menu: ", menu)
  menu.value.toggle(event);
};

const save = () => {
  console.log("label: ", label)
  console.log("wantSubTag: ", wantSubTag)
  console.log("selectedTag: ", Object.keys(selectedTag.value)[0])
  props.slotProps.node.label = label.value
  editVisible.value = false;
}
const saveColor = () => {
  console.log("color: ", color)
  props.slotProps.node.color = "#"+color.value
  colorVisible.value = false;
}

</script>

<template>
  <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" class="right" aria-haspopup="true"
    aria-controls="overlay_menu" />
  <Menu ref="menu" :model="items" :popup="true" />

  <Dialog v-model:visible="editVisible" modal :header="header" :style="{ width: '55rem' }">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="label" class="font-semibold w-6rem">Nom de l'étiquette</label>
      <InputText v-model="label" id="label" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center">
      <Checkbox v-model="wantSubTag" inputId="checked" name="checked" value="subTag" />
      <label for="checked" class="ml-2">Imbriquer l'étiquette sous : </label>
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <Tree id="folders" v-model:selectionKeys="selectedTag" :value="tags" selectionMode="single"
        class="w-full md:w-30rem">
        <template #default="slotProps">
          <i class="pi pi-folder" :style="'color:' + slotProps.node.color"></i> {{ slotProps.node.label }}
        </template>
      </Tree>
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="editVisible = false"></Button>
      <Button type="button" label="Save" @click="save"></Button>
    </div>
  </Dialog>
  <Dialog v-model:visible="colorVisible" modal :header="header" :style="{ width: '55rem' }">
    <div class="flex align-items-center gap-3 mb-3">
      <ColorPicker v-model="color" inline />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="label" class="font-semibold w-6rem">Couleur </label>
      <InputText v-model="color" id="label" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="colorVisible = false"></Button>
      <Button type="button" label="Save" @click="saveColor"></Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
