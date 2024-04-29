<script setup>
import Tooltip from 'primevue/tooltip';

const props = defineProps({
  icon: String,
  type: String,
  required: true
})

const menu = ref();
const items = ref([
  {
    label: 'Paramètres',
    icon: 'pi pi-cog'
  },
  {
    label: 'Cloner',
    icon: 'pi pi-clone'
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
    class: 'redImportant'
  }

]);

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
.redImportant .p-menuitem-text, .redImportant .p-menuitem-icon {
color: var(--danger-color) !important;
}
</style>
