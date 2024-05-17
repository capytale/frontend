<script setup>
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

const props = defineProps({
  nid: String,
})

const resume = ref('')
const share = ref(false);
const web = ref(false);
const selectedThemes = ref(null)

const { data:idxEls, pending, error, status } = await fetchBibIndexingElements()

const selectedModules = ref();
const filteredModules = ref();

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

const selectedEnseignements = ref([]);
const selectedNiveaux = ref([]);

const postBibForm = () => {
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
  const selEnseignements = JSON.stringify(selectedEnseignements.value)
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
  const selNiveaux = JSON.stringify(selectedNiveaux.value)
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
  const selModules = JSON.stringify(selectedModules.value)
  // const selThemes = selectedThemes.value ? Object.entries(selectedThemes.value).filter(([k, v]) => v.checked) : []
  let selThemes = []
  if (selectedThemes.value) {
    const a = Object.entries(selectedThemes.value).filter(([k, v]) => v.checked)
    // console.log(a)
    for (const x in a) {
      selThemes.push(a[x][0])
    }
  }
  // for (const prop in selThemes) { console.log(`${prop}: ${selThemes[prop].checked}`) }

  console.log('Share', share.value);
  console.log('Web: ', web.value);
  console.log('Résumé: ', resume.value);
  console.log('Enseignements: ', selEnseignements);
  console.log('Niveaux:', selNiveaux);
  console.log('Modules: ', selModules);
  console.log('Themes: ', selThemes)

}

</script>

<template>
  <span class="p-text-secondary block mb-5">Titre de la ressource {{ nid }}</span>
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
  <label for="description" class="font-semibold w-6rem">Résumé</label>
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
