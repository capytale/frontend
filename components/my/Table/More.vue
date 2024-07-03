<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const activites = useActivitiesStore()
activites.getActivities()

const props = defineProps({
  nid: String,
  mode: String,
  whoami: String,
  isTeacher: Boolean,
  required: true
})

const confirm = useConfirm();
const toast = useToast();
const menu = ref();
const actItems = ref([
  {
    label: 'Paramètres',
    icon: 'pi pi-cog'
  },
  {
    label: 'Cloner',
    icon: 'pi pi-clone',
    command: async () => {
      try {
        const response = await activites.cloneActivity(props.nid)
        toast.add({ severity: 'success', summary: 'Clonage réussi ', life: 2000 });
      }
      catch (e) {
        toast.add({ severity: 'error', summary: 'Échec du clonage : ', detail: `nid = ${props.nid} - ${e}` });
      }
    }
  }
])
const actMoodleItem = ref([
  {
    label: 'Copier l\'URL d\'intégration dans Moodle',
    icon: 'pi pi-link'
  },
])

// const actClonableItem = ref([])
const actClonableItem = computed(() => {
  if (props.mode.includes('_X')) {
    return [{
      label: 'Débloquer la distribution',
      icon: 'pi pi-lock-open',
      command: async () => {
        try {
          const response = await activites.unlockMode(props.nid)
          toast.add({ severity: 'success', summary: 'Distribution débloquée', life: 2000 });
        }
        catch (e) {
          toast.add({ severity: 'error', summary: 'Échec du débloquage de la distribution de l\'activité : ', detail: `nid = ${props.nid} - ${e}` });
        }
      }
    }]
  } else {
    return [{
      label: 'Bloquer la distribution',
      icon: 'pi pi-lock',
      command: async () => {
        try {
          const response = await activites.lockMode(props.nid)
          toast.add({ severity: 'success', summary: 'Distribution bloquée', life: 2000 });
        }
        catch (e) {
          toast.add({ severity: 'error', summary: 'Échec du bloquage de la distribution de l\'activité : ', detail: `nid = ${props.nid} - ${e}` });
        }
      }
    }]
  }
})

const commonItems = ref([
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
        accept: async () => {
          try {
            await activites.deleteActivity([props.nid])
            toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
          }
          catch (e) {
            toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: `nid = ${props.nid} - ${e}` });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Annulation', life: 3000 });
        }
      });
    }
  }
]);


watch(() => props.mode, (now, before) => console.log("now, before : ", now, before))


const items = computed(() => {
  if (props.isTeacher) {
    if (props.whoami == 'ap') {
      return commonItems.value
    } else {
      return [...actItems.value, ...actMoodleItem.value, ...actClonableItem.value, ...commonItems.value]
    }
  } else {
    if (props.whoami == 'ap') {
      return commonItems.value
    } else {
      return [...actItems.value, ...commonItems.value]
    }
  }
})

const toggle = (event) => {
  menu.value.toggle(event);
}
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
