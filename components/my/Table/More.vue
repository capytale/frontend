<script setup>
import Tooltip from 'primevue/tooltip';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  nid: String,
  whoami: String,
  required: true
})

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
      // const response = await my.cloneActivity(props.nid)
      const response = {}
      if (response.ok) {
        toast.add({ severity: 'success', summary: 'Clonage réussi : ', life: 2000 });
      } else {
        toast.add({ severity: 'error', summary: 'Échec du clonage : ', detail: "nid = " + props.nid });
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
    icon: 'pi pi-download',
    command: () => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
    }
  },
  { separator: true },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    class: 'redImportant',
    command: async () => {
      confirm.require({
        message: 'Vous vous apprêtez à supprimer DÉFINITIVEMENT.',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Annuler',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptLabel: 'Supprimer',
        acceptClass: 'p-button-danger',
        accept: () => {
          // const response = await my.deleteActivity(props.nid)
          const response = {}
          if (response.ok) {
            toast.add({ severity: 'success', summary: 'Suppression effectuée : ', life: 2000 });
          } else {
            toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: "nid = " + props.nid });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Annulation', life: 3000 });
        }
      });
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
