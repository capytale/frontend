<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useBibStore } from '@/stores/bib'
const confirm = useConfirm();
const activites = useActivitiesStore()

const bib = useBibStore()

const props = defineProps({
  nid: String,
})
activites.getMetadata(props.nid)

const emit = defineEmits(['closeBibForm'])

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

const share = ref();
const web = ref();
const resume = ref()
const selectedEnseignements = ref()
const selectedNiveaux = ref()
const selectedModules = ref()
const selectedThemes = ref();

const { data: idxEls, status } = await fetchBibIndexingElements()

watch(
  () => [idxEls.value, activites.activities.data[currentKey.value]], () => {
    share.value = activites.activities.data[currentKey.value].status_shared == 1
    web.value = activites.activities.data[currentKey.value].status_web == 1
    resume.value = activites.activities.data[currentKey.value].abstract
    selectedEnseignements.value = activites.activities.data[currentKey.value].enseignements.map((x) => x.value)
    selectedNiveaux.value = activites.activities.data[currentKey.value].niveaux.map((x) => x.value)
    if (activites.activities.data[currentKey.value].modules.length == 0 || activites.activities.data[currentKey.value].modules[0].target_id == 0) {
      selectedModules.value = []
    } else {
      selectedModules.value = activites.activities.data[currentKey.value].modules.map((x) => {
        return idxEls.value.modules.filter((item) => item.tid == x.target_id)[0]
      })
    }
    const fetchedThemes = activites.activities.data[currentKey.value].themes.map((x) => x.target_id)
    selectedThemes.value = generateKeysByIds(idxEls.value.themes, fetchedThemes);
  },
  { immediate: true }
)

const filteredModules = ref();


// cf. https://github.com/primefaces/primevue/issues/3837
function generateKeysByIds(data, ids) {
  const output = {};

  function traverse(items, prefix) {
    items.forEach((item) => {
      const key = item.key;

      const checked = ids.includes(item.id);
      const partialChecked = item.children && item.children.some((child) => ids.includes(child.id));

      if (checked || partialChecked) {
        output[key] = {
          checked: checked,
          partialChecked: partialChecked,
        };
      }

      if (item.children && item.children.length > 0) {
        traverse(item.children, key);
      }
    });
  }

  traverse(data, "");

  return output;
}




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
  if (share.value == 1 && (resume.value == null || resume.value.length < 20)) {
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

  if (share.value == 1 && selectedEnseignements.value.length == 0) {
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
  if (share.value == 1 && selectedNiveaux.value.length == 0) {
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
  // console.log('selectedModules : ', selectedModules.value)

  const selModules = selectedModules.value ? selectedModules.value.map((x) => x.tid) : "[]"

  let selThemes = []
  // console.log('selectedThemes : ', selectedThemes.value)
  if (selectedThemes.value) {
    const a = Object.entries(selectedThemes.value).filter(([k, v]) => v.checked)
    for (const x in a) {
      selThemes.push(a[x][0])
    }
  }

  activites.activities.data[currentKey.value].status_shared = share.value ? "1" : "0"
  activites.activities.data[currentKey.value].status_web = web.value ? "1" : "0"

  await activites.bibIndexActivity(props.nid,
    share.value,
    web.value,
    resume.value,
    selectedEnseignements.value,
    selectedNiveaux.value,
    selModules,
    selThemes
  )

  bib.bib.refresh() // TODO : on doit pouvoir faire plus léger en ne récupérant que ce qui a été ajouté ou supprimé
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

  <div v-if="status == 'pending'">
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
  <div class="flex justify-content-end gap-2 my-4" style="position: absolute; height:2em; bottom: 0;">
    <Button type="button" label="Annuler" severity="secondary" @click="$emit('closeBibForm')"></Button>
    <Button type="button" label="Enregistrer" @click="() => { postBibForm(); $emit('closeBibForm') }"></Button>
  </div>
</template>


<style scoped>
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
