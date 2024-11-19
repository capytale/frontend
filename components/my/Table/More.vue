<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import meApi from "@capytale/activity.js/backend/capytale/me";

const activites = useActivitiesStore()

const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const paramVisible = ref(false);
const cloningVisible = ref(false);

const confirm = useConfirm();
const toast = useToast();
const menu = ref();
const actItems = ref([
  {
    label: 'Paramètres',
    icon: 'pi pi-cog',
    command: () => {
      paramVisible.value = true
    }
  },
  {
    label: 'Cloner',
    icon: 'pi pi-clone',
    command: () => {
      cloningVisible.value = true
    }
  }
])
const actMoodleItem = ref([
  {
    label: 'Copier l\'URL d\'intégration dans Moodle',
    icon: 'pi pi-link',
    command: async () => {
      const me = await meApi.getMeAsync()
      let provider = '';
      if ((me.provider !== 'mail') && (me.provider !== 'sesame')) {
        provider = '/' + me.provider;
      }
      navigator.clipboard.writeText(`${window.location.origin}/web/c/${props.data.code}${provider}`);
      toast.add({ severity: 'info', summary: 'URL copiée', life: 2000 });
    }
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
    icon: 'pi pi-times-circle text-red-500',
    class: "text-red-500",
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
            const notDeleted = await activites.deleteActivity([props.data.nid])
            console.log("notDeleted: ", notDeleted)
            if (notDeleted.length == 0) {
              toast.add({ severity: 'success', summary: 'Suppression effectuée', life: 2000 });
            } else {
              toast.add({ severity: 'warn', summary: 'Échec de la suppression', detail: `Vous n'avez pas le droit de supprimer cet élément` });
            }
          }
          catch (e) {
            toast.add({ severity: 'error', summary: 'Échec de la suppression', detail: `nid = ${selectedNid.value} - ${e}` });
          }
        },
      });
    }
  }
]);

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
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span :class="item.class">{{ item.label }}</span>
        </a>
      </template>
    </Menu>

  </div>

  <MyActivityEdit v-model="paramVisible" :data="props.data" />
  <Dialog v-model:visible="cloningVisible" :style="{ width: '750px' }" header="Choisissez le titre du clone"
    :modal="true">
    <MyCloningForm :data="props.data" @closeCloningForm="cloningVisible = false" />
  </Dialog>
</template>

<style scoped>
.redImportant .p-menuitem-text,
.redImportant .p-menuitem-icon {
  color: var(--danger-color) !important;
}
</style>
