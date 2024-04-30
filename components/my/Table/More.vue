<script setup>
import Tooltip from 'primevue/tooltip';
import { useToast } from "primevue/usetoast";
import { useMyStore } from '@/stores/my';
const toast = useToast();

const props = defineProps({
  nid: String,
  whoami: String,
  required: true
})

const my = useMyStore();

const menu = ref();
const saItems = ref([
  {
    label: 'Télécharger',
    icon: 'pi pi-download'
  },
  { separator: true },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    class: 'redImportant'
  }
]);
const actItems = ref([
  {
    label: 'Paramètres',
    icon: 'pi pi-cog'
  },
  {
    label: 'Cloner',
    icon: 'pi pi-clone',
    command: async () => {
      const response = await my.cloneActivity(props.nid)
      console.log(response.ok)
      if (response.ok) {
        toast.add({ severity: 'success', summary: 'Clonage réussi : ', life: 2000 });
      } else {
        toast.add({ severity: 'warn', summary: 'Échec du clonage : ', detail: "nid = " + props.nid });
      }
    }
  },
  {
    label: 'Copier l\'URL d\'intégration dans Moodle',
    icon: 'pi pi-link'
  },
  {
    label: 'Bloquer la distribution',
    icon: 'pi pi-lock'
  },
  {
    label: 'Télécharger',
    icon: 'pi pi-download'
  },
  { separator: true },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    class: 'redImportant',
    command: async () => {
      const response = await my.deleteActivity(props.nid)
      console.log(response.ok)
      if (response.ok) {
        toast.add({ severity: 'success', summary: 'Suppression réussie : ', life: 2000 });
      } else {
        toast.add({ severity: 'warn', summary: 'Échec lors de la Suppression : ', detail: "nid = " + props.nid });
      }
    }
  }
]);
const items = computed(() => props.whoami == 'ap' ? saItems.value : actItems.value);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div class="card flex justify-content-center">
    <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" severity="secondary" link aria-haspopup="true"
      aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<style>
.redImportant .p-menuitem-text,
.redImportant .p-menuitem-icon {
  color: var(--danger-color) !important;
}
</style>
