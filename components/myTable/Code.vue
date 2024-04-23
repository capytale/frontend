<script setup>
const props = defineProps({
  code: String,
  required: true
})

import { useToast } from "primevue/usetoast";
const toast = useToast();

const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};
const items = computed(() =>
  [
    {
      items: [
        {
          label: 'Copier le code partgae avec la classe',
          icon: 'pi pi-copy',

          command: () => {
            toast.add({ severity: 'success', summary: 'Copié !', detail: '', life: 2000 });
          }
        },
        {
          label: 'Copier l\'URL de partgae avec la classe',
          icon: 'pi pi-link',

          command: () => {
            toast.add({ severity: 'success', summary: 'Copié !', detail: '', life: 2000 });
          }
        },
        {
          label: 'Afficher le QRCode de partage',
          icon: 'pi pi-qrcode',
          command: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
          }
        }
      ]
    },
  ])
</script>

<template>
  <div class="card flex justify-content-center mystyle">
    <Button type="button" :label="code" icon="pi pi-angle-down" @click="toggle" class="mystyle" aria-haspopup="true" aria-controls="overlay_menu" />
    <!-- <Menu :model="items" /> -->
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    <Toast />
  </div>
</template>

<style>
.mystyle {
  font-family: monospace;
  background-color: #c6eee1;
  border-radius: 5px;
  padding:3px;
}

.mystyle .p-submenu-list .p-menuitem-content {
  background-color: #fff;
  font-family: "Inter var", sans-serif;
}

.mystyle .p-menubar {
  padding: 0;
}
</style>
