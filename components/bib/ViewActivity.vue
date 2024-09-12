<script setup lang="ts">
import { decode } from 'html-entities';
const toast = useToast();
const activites = useActivitiesStore()

const clone = ref<{ nid: number | string, title: string } | null>();
const patience = ref(false);

const goToClone = () => {
  if (!clone.value) return
  window.location.assign(`/web/c-act/n/${clone.value.nid}/play/create`)
  patience.value = true
}

let lockClone = false

const doClone = async (nid: number | string) => {
  if (lockClone) return
  if (clone.value) {
    toast.add({ severity: 'error', summary: 'Activité déjà clonée', life: 2000 });
    return
  }
  lockClone = true
  try {
    const c = await activites.cloneActivity(nid)
    clone.value = c
    toast.add({ severity: 'success', summary: 'Clonage réussi', life: 4000, detail: `Titre du clone : "${c.title}"` });
  }
  catch (e) {
    lockClone = false
    toast.add({ severity: 'error', summary: 'Échec du clonage'});
  }
}

const props = defineProps({
  data: Object,
})
const visible = ref(false);

const url = computed(() => {
  return `/web/c-act/n/${props.data.nid}/play/view`
})

const copy = (nid) => {
  const url = window.location.origin + `/web/b/${nid}`
  navigator.clipboard.writeText(url);
  toast.add({ severity: 'success', summary: 'Copié !', detail: url, life: 3000 });
}

const close = () => {
  visible.value = false
}

watch(visible, (v) => {
  if (v) {
    drupal.setCloseHandler(close)
  } else {
    drupal.removeCloseHandler(close)
  }
})

onBeforeUnmount(() => {
  drupal.removeCloseHandler(close)
})

</script>

<template>
  <a @click="visible = true" class="tablelink">{{ decode(props.data.title) }}</a>

  <DialogIframe v-model="visible" :url="url">
    <template #header>
      <div style="width: 100%">
        <div class="flex justify-between">
          <div>
            <h2>{{ decode(props.data.title) }}</h2>
          </div>
          <div>
            <Button v-if="clone" @click="goToClone" label="Voir le clone"
              :icon="patience ? 'pi pi-spin pi-spinner' : 'pi pi-external-link'" class="mx-2"
              v-tooltip.bottom="{ value: `Ouvrir l'activité\n'${clone.title}'`, showDelay: 300, hideDelay: 100 }" />
            <Button v-else @click="doClone(props.data.nid)" label="Cloner" icon="pi pi-clone" class="mx-2"
              v-tooltip.bottom="{ value: 'Cloner cette ressource', showDelay: 300, hideDelay: 100 }" />

            <Button @click="copy(props.data.nid)" label="Copier le lien" icon="pi pi-link" class="mx-2 mr-2"
              v-tooltip.bottom="{ value: 'Cliquez pour copier le lien permettant de consulter cette ressource', showDelay: 300, hideDelay: 100 }" />
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
  color: var(--p-primary-color);
  text-decoration: underline;
}

.tablelink {
  color: var(--p-primary-color);
  cursor: pointer;
}

.tablelink:hover {
  color: var(--p-primary-color-hover);
}
</style>
