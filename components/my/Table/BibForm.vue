<script setup>
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const activites = useActivitiesStore()

const props = defineProps({
  nid: String,
})
activites.getMetadata(props.nid)


// const current = activites.activities.data.filter((item) => item.nid == props.nid)
// console.log('abstr : ', current)

const currentKey = computed(() => {
  const iterator = activites.activities.data.keys();
  for (const key of iterator) {
    if (activites.activities.data[key].nid == props.nid) {
      return key
    }
  }
})

const resume = ref(activites.activities.data[currentKey.value].abstract)
const share = ref(activites.activities.data[currentKey.value].status_shared == 1);
const web = ref(activites.activities.data[currentKey.value].status_web == 1);

const selectedEnseignements = ref()
const selectedNiveaux = ref()
const selectedModules = ref()

const { data: idxEls, pending, error, status } = await fetchBibIndexingElements()
const filteredModules = ref();

watch(() => activites.activities.data[currentKey.value], () => {
  const c = activites.activities.data[currentKey.value]
  if (c) {
    selectedEnseignements.value = c.enseignements.map((x) => x.value)
    selectedNiveaux.value = c.niveaux.map((x) => x.value)
    if (c.modules[0].target_id == 0) {
      selectedModules.value = []
    } else {
      selectedModules.value = c.modules.map((x) => {
        return idxEls.value.modules.filter((item) => item.tid == x.target_id)[0]
      })
    }
    console.log('selectedModules : ', selectedModules.value)
  }
})

const selectedThemes = ref();




const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredModules.value = [...idxEls.value.modules];
    } else {
      filteredModules.value = idxEls.value.modules.filter((module) => {
        return module.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}


const postBibForm = async () => {
  // visible.value = false
  if (resume.value.length < 20) {
    confirm.require({
      message: 'Merci de saisir un résumé de 50 caractères au minimum.',
      header: 'Attention',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'invisible',
      rejectLabel: 'Cancel',
      acceptLabel: 'Ok',
    });
    return
  }

  if (selectedEnseignements.value.length == 0) {
    confirm.require({
      message: 'Merci d\'indiquer au moins un enseignement.',
      header: 'Attention',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'invisible',
      rejectLabel: 'Cancel',
      acceptLabel: 'Ok',
    });
    return
  }
  if (selectedNiveaux.value.length == 0) {
    confirm.require({
      message: 'Merci d\'indiquer au moins un niveau.',
      header: 'Attention',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'invisible',
      rejectLabel: 'Cancel',
      acceptLabel: 'Ok',
    });
    return
  }
  console.log('selectedModules : ', selectedModules.value)

  const selModules = selectedModules.value ? selectedModules.value.map((x) => x.tid) : "[]"

  let selThemes = []
  if (selectedThemes.value) {
    const a = Object.entries(selectedThemes.value).filter(([k, v]) => v.checked)
    for (const x in a) {
      selThemes.push(a[x][0])
    }
  }

  await activites.bibIndexActivity(props.nid,
    share.value,
    web.value,
    resume.value,
    selectedEnseignements.value,
    selectedNiveaux.value,
    selModules,
    selThemes
  )
}

</script>

<template>
  <!-- <span class="p-text-secondary block mb-5">{{title}} {{ nid }}</span> -->
  <Checkbox v-model="share" id="share" :binary="true" class="mr-4" @change="web = false" />
  <label for="share" class="font-semibold w-6rem">Publier dans la bibliothèque ENTRE ENSEIGNANTS</label>
  <div class="details">
    En cochant cette case, vous partagez votre activité avec les enseignants possédant un compte sur Capytale.
  </div>
  <div :class="share ? '' : 'faded'">
    <Checkbox v-if="share" v-model="web" id="web" :binary="true" class="mr-4" />
    <Checkbox v-else v-model="web" id="web" :binary="true" class="mr-4" disabled />
    <label for="web" class="font-semibold w-6rem">Publier dans la bibliothèque POUR TOUS</label>
    <div class="details">
      En cochant cette case, vous partagez votre activité sans restriction de statut. Elle sera visible par tout
      utilisateur de Capytale, y compris les élèves.
    </div>
  </div>
  <label for="description" class="font-semibold w-6rem">Résumé (50 caractères minimum))</label>
  <Textarea id="resume" v-model="resume" autoResize rows="5" class="w-full" />

  <div v-if="pending">
    <p>Chargement des actvités...</p>
  </div>
  <div v-else-if="status == 'error'">
    <p>Impossible de charger les activités.</p>
  </div>
  <div v-else class="grid my-form-grid">
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <span class="font-semibold w-6rem">Enseignement(s)</span>
      <div v-for="enseignement of idxEls.enseignements" :key="enseignement.key" class="flex align-items-center">
        <Checkbox v-model="selectedEnseignements" :inputId="enseignement.key" name="enseignement"
          :value="enseignement.key" class="mr-4" />
        <label :for="enseignement.key">{{ enseignement.value }}</label>
      </div>
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <span class="font-semibold w-6rem">Niveau(x)</span>
      <div v-for="niveau of idxEls.niveaux" :key="niveau.key" class="flex align-items-center">
        <Checkbox v-model="selectedNiveaux" :inputId="niveau.key" name="niveau" :value="niveau.key" class="mr-4" />
        <label :for="niveau.key">{{ niveau.value }}</label>
      </div>
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <label for="modules" class="font-semibold w-6rem">Modules utilisés</label>
      <AutoComplete id="modules" v-model="selectedModules" multiple :suggestions="filteredModules" optionLabel="name"
        @complete="search" class="w-full md:w-14rem" />

      <label for="themes" class="font-semibold w-6rem">Thèmes abordés</label>
      <Tree id="themes" v-model:selectionKeys="selectedThemes" :value="idxEls.themes" selectionMode="checkbox"
        :filter="true" filterMode="lenient" class="w-full md:w-30rem with-padding"></Tree>
    </div>
  </div>
  <div class="flex justify-content-end gap-2" style="position: absolute; height:2em; bottom: 0;">
    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
    <Button type="button" label="Save" @click="postBibForm"></Button>
  </div>
</template>


<style>
.with-padding {
  margin-left: -1.5em;
}

.with-padding .p-treenode-content {
  padding: 0;
}

.with-padding .p-treenode {
  padding: 0;
}

.faded {
  color: var(--gray-300);
}

.my-form-grid {
  grid-template-columns: 1.5fr 1.5fr 2fr;
  column-gap: 0.5em;
}

ul.p-tree-container {
  padding-left: 0 !important;
}

.with-padding ul {
  padding-left: 1em;
}
</style>
