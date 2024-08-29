<script setup>
import { decode } from 'html-entities';
const toast = useToast();

const props = defineProps({
  data: Object,
})
const visible = ref(false);

const url = computed(() => {
  return `/web/c-act/n/${props.data.nid}/play/view`
})

const copy = (nid) => {
  const url = `https://np.ac-capytale.fr/web/b/${nid}`
  navigator.clipboard.writeText(url);
  toast.add({ severity: 'success', summary: 'Copié !', detail: url, life: 3000 });
}
</script>

<template>
  <span @click="visible = true" class="clickable">{{ decode(props.data.title) }}</span>

  <DialogIframe v-model="visible" :url="url">
    <template #header>
      <div style="width: 100%">
        <div class="flex justify-between">
          <div>
            <h2>{{ decode(props.data.title) }}</h2>
          </div>
          <div>
            <Button @click="copy(props.data.nid)" label="Copier le lien" icon="pi pi-link" class="mx-2"
              v-tooltip.bottom="{ value: 'Ce lien permet d\'accéder directement à cette ressource partagée. Cliquez pour copier', showDelay: 300, hideDelay: 100 }" />
            <Button label="Cloner" icon="pi pi-clone" class="mx-2"
              v-tooltip.bottom="{ value: 'Cloner cette ressource partagée', showDelay: 300, hideDelay: 100 }" />
          </div>
        </div>
      </div>
    </template>
    <template #default>
    </template>
  </DialogIframe>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  color: var(--p-sky-900); /* TODO supp la couleur et passer le span en a ? */
  text-decoration: underline;
}
</style>
