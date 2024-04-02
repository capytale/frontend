<script setup>
const props = defineProps({
  code: String,
  required: true
})

import { useToast } from "primevue/usetoast";
const toast = useToast();

const items = computed(() => 
[
  {
    label: props.code,
    class: 'myclass',
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
  <!-- <Tag :value="code" class="font-mono"></Tag> -->
  <div class="mystyle">
    <Menubar :model="items" />
    <Toast />
  </div>
</template>

<style>
.mystyle .p-menuitem-content {
  font-family: monospace;
  background-color: #c6eee1;
}

.mystyle .p-submenu-list .p-menuitem-content {
  background-color: #fff;
  font-family: "Inter var", sans-serif;
}

.mystyle .p-menubar {
  padding: 0;
}
</style>
