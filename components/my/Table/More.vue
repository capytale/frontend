<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const activites = useActivitiesStore()
// activites.getActivities()

const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const visible = ref(false);

const confirm = useConfirm();
const toast = useToast();
const menu = ref();
const actItems = ref([
  {
    label: 'Paramètres',
    icon: 'pi pi-cog',
    command: () => {
      visible.value = true
    }
  },
  {
    label: 'Cloner',
    icon: 'pi pi-clone',
    command: async () => {
      try {
        const c = await activites.cloneActivity(props.data.nid)
        toast.add({ severity: 'success', summary: 'Clonage réussi', life: 4000, detail: `Titre du clone : "${c.title}"` });
      }
      catch (e) {
        toast.add({ severity: 'error', summary: 'Échec du clonage : ', detail: `nid = ${props.data.nid} - ${e}` });
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

const actClonableItem = computed(() => {
  if (!props.data.mode)
    return [{ label: 'OUPSSS', }]
  if (props.data.mode.includes('_X')) {
    return [{
      label: 'Débloquer la distribution',
      icon: 'pi pi-lock-open',
      command: async () => {
        try {
          const response = await activites.unlockMode(props.data)
          toast.add({ severity: 'success', summary: 'Distribution débloquée', life: 2000 });
        }
        catch (e) {
          toast.add({ severity: 'error', summary: 'Échec du débloquage de la distribution de l\'activité : ', detail: `nid = ${props.data.nid} - ${e}` });
        }
      }
    }]
  } else {
    return [{
      label: 'Bloquer la distribution',
      icon: 'pi pi-lock',
      command: async () => {
        try {
          const response = await activites.lockMode(props.data)
          toast.add({ severity: 'success', summary: 'Distribution bloquée', life: 2000 });
        }
        catch (e) {
          toast.add({ severity: 'error', summary: 'Échec du bloquage de la distribution de l\'activité : ', detail: `nid = ${props.data.nid} - ${e}` });
        }
      }
    }]
  }
})

const commonItems = ref([
  // {
  //   label: 'Télécharger',
  //   icon: 'pi pi-download',
  //   command: () => {
  //     toast.add({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
  //   }
  // },
  { separator: true },
  {
    label: 'Supprimer',
    icon: 'pi pi-times-circle',
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
            await activites.deleteActivity([props.data.nid])
            toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
          }
          catch (e) {
            toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: `nid = ${props.data.nid} - ${e}` });
          }
        },
      });
    }
  }
]);

// watch(() => props.data.mode, (now, before) => console.log("now, before : ", now, before))

const items = computed(() => {
  if (props.isTeacher) {
    if (props.data.whoami == 'ap') {
      return commonItems.value
    } else {
      return [...actItems.value, ...actMoodleItem.value, ...actClonableItem.value, ...commonItems.value]
    }
  } else {
    if (props.data.whoami == 'ap') {
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
      v-tooltip.top="{ value: 'Plus', showDelay: 300, hideDelay: 100 }" aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>

  <MyActivityEdit v-model="visible" :data="props.data" />
</template>

<style scoped>
.redImportant .p-menuitem-text,
.redImportant .p-menuitem-icon {
  color: var(--danger-color) !important;
}
</style>
