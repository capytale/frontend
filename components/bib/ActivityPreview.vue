<script setup lang="ts">
const toast = useToast();
const activites = useActivitiesStore()

const model = defineModel<
  { nid: number, title: string } | undefined
>()

const visible = ref(false);

const cloneStage = ref<'none' | 'cloning' | 'cloned'>('none');
const cloneTitle = ref<string | undefined>();

/**
 * cloneRef n'est pas une ref au sens de vue. C'est un objet qui reçoit les
 * infos du clone lorsqu'il est créé.
 * À chaque prévisualisation, un nouvel objet est créé pour éviter les collisions.
 */
let cloneRef: { value?: { nid: number | string, title: string } } | undefined;

watch(model, (m) => {
  visible.value = m != null;
})

watch(visible, (v) => {
  if (v) {
    drupal.setCloseHandler(close);
    cloneRef = {};
    cloneStage.value = 'none';
    cloneTitle.value = undefined;
  } else {
    model.value = undefined;
    cloneRef = undefined;
    drupal.removeCloseHandler(close);
  }
})

onBeforeUnmount(() => {
  drupal.removeCloseHandler(close)
})

const url = computed<string | undefined>(() => {
  if (model.value == null) return undefined
  return `/web/c-act/n/${model.value.nid}/play/view`
})

const patience = ref(false);

const goToClone = () => {
  if (cloneRef == null) return
  if (cloneRef.value == null) return
  window.location.assign(`/web/c-act/n/${cloneRef.value.nid}/play/create`)
  patience.value = true
}

const doClone = async () => {
  if (model.value == null) return;
  if (cloneRef == null) return;
  const localCloneRef = cloneRef;
  if (cloneStage.value !== 'none') return
  cloneStage.value = 'cloning';
  try {
    const c = await activites.cloneActivity(model.value.nid)
    if (localCloneRef === cloneRef) {
      cloneRef.value = c
      cloneStage.value = 'cloned';
      cloneTitle.value = c.title;
      toast.add({ severity: 'success', summary: 'Clonage réussi', life: 4000, detail: `Titre du clone : "${c.title}"` });
    }
  }
  catch (e) {
    if (localCloneRef === cloneRef) {
      cloneStage.value = 'none';
      toast.add({ severity: 'error', summary: 'Échec du clonage' });
    }
  }
}

const copy = () => {
  if (model.value == null) return;
  const url = window.location.origin + `/web/b/${model.value.nid}`
  navigator.clipboard.writeText(url);
  toast.add({ severity: 'success', summary: 'Copié !', detail: url, life: 3000 });
}

const close = () => {
  visible.value = false
}

</script>

<template>
  <DialogIframe v-model="visible" :url="url">
    <template #header>
      <div class="flex flex-nowrap gap-3 w-full justify-between mr-6">
        <div>
          <h2>{{ model?.title }}</h2>
        </div>
        <div class="flex flex-nowrap gap-3 items-stretch">
          <Button v-if="cloneStage === 'cloned'" @click="goToClone" label="Voir le clone"
            :icon="patience ? 'pi pi-spin pi-spinner' : 'pi pi-external-link'"
            v-tooltip.bottom="{ value: `Ouvrir l'activité\n'${cloneTitle}'`, showDelay: 300, hideDelay: 100 }" />
          <Button v-else :disabled="cloneStage !== 'none'" @click="doClone()" label="Cloner" icon="pi pi-clone"
            v-tooltip.bottom="{ value: 'Cloner cette ressource', showDelay: 300, hideDelay: 100 }" />
          <Button @click="copy()" label="Copier le lien" icon="pi pi-link"
            v-tooltip.bottom="{ value: 'Cliquez pour copier le lien permettant de consulter cette ressource', showDelay: 300, hideDelay: 100 }" />
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
