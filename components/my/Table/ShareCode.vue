<script setup>
const props = defineProps({
  code: String,
  required: true
})

import { useToast } from "primevue/usetoast";
const toast = useToast();

const visible = ref(false);
const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};
const url = `https://np.ac-capytale.fr/web/c/${props.code}`
const items = computed(() =>
  [
    {
      label: 'Copier le code partage avec la classe',
      icon: 'pi pi-copy',
      command: () => {
        navigator.clipboard.writeText(props.code);
        toast.add({ severity: 'success', summary: 'Copié !', detail: props.code, life: 2000 });
      }
    },
    {
      label: 'Copier l\'URL de partage avec la classe',
      icon: 'pi pi-link',
      command: () => {
        navigator.clipboard.writeText(url);
        toast.add({ severity: 'success', summary: 'Copié !', detail: url, life: 3000 });
      }
    },
    {
      label: 'Afficher le QRCode de partage',
      icon: 'pi pi-qrcode',
      command: () => {
        visible.value = true;
      }
    }
  ])
</script>

<template>
  <div class="card flex justify-content-center mystyle">
    <Button type="button" :label="code" icon="pi pi-angle-down" @click="toggle" class="mystyle" severity="primary"
      aria-haspopup="true" aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
  <Dialog v-model:visible="visible" header="Accès à l'activité" modal
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" :style="{ width: '75%' }">
    <MyTableQrcode :code="code" :url="url" />
  </Dialog>
</template>

<style scoped>
.mystyle {
  font-family: monospace;
}
</style>
