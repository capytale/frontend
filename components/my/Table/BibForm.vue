<script setup>
import { _ } from 'vue-underscore'
import { useBibIndexingStore } from '@/stores/bibIndexing';

const props = defineProps({
  nid: String,
})

const resume = ref('')
const share = ref(false);
const web = ref(false);
const selectedKey = ref(null)

const idxEls = useBibIndexingStore();
idxEls.getIndexingElements()
// console.log(idxEls.data)


const unflatten = function (array, parent, tree) {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { id: 0 };
  var children = _.filter(array, function (child) { return child.parentid == parent.id; });
  if (!_.isEmpty(children)) {
    if (parent.id == 0) {
      tree = children;
    } else {
      parent['children'] = children
    }
    _.each(children, function (child) { unflatten(array, child) });
  }
  return tree;
}
// const themes.data = [
// { "key": "1799", "label": "Histoire", "id": "1799", "parentid": ""},
// { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
// { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
// ]
const nodes = unflatten(idxEls.data.themes)

// const nodes = [
//   { "key": "1799", "label": "Histoire", "id": "1799", "parentid": "",
//     "children": [
//       { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
//       { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
//     ]
//   }
// ]

const selectedModule = ref();
const filteredModules = ref();

const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredModules.value = [...idxEls.data.modules];
    } else {
      filteredModules.value = idxEls.data.modules.filter((module) => {
        return module.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}

const selectedEnseignements = ref([]);
const selectedNiveaux = ref([]);

</script>

<template>
  <span class="p-text-secondary block mb-5">Titre de la ressource {{ nid }}</span>
  <Checkbox v-model="share" id="share" :binary="true" />
  <label for="share" class="font-semibold w-6rem">Publier dans la bibliothèque ENTRE ENSEIGNANTS</label>
  <div class="details">
    En cochant cette case, vous partagez votre activité avec les enseignants possédant un compte sur Capytale.
  </div>
  <template v-if="share">
    <Checkbox v-model="web" id="web" :binary="true" />
    <label for="web" class="font-semibold w-6rem">Publier dans la bibliothèque POUR TOUS</label>
    <div class="details">
      En cochant cette case, vous partagez votre activité sans restriction de statut. Elle sera visible par tout
      utilisateur de Capytale, y compris les élèves.
    </div>
  </template>
  <label for="description" class="font-semibold w-6rem">Résumé</label>
  <Textarea id="resume" v-model="resume" autoResize rows="5" class="w-full" />

  <div class="grid my-form-grid">
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <span class="font-semibold w-6rem">Enseignement(s)</span>
      <div v-for="enseignement of idxEls.data.enseignements" :key="enseignement.key" class="flex align-items-center">
        <Checkbox v-model="selectedEnseignements" :inputId="enseignement.key" name="enseignement"
          :value="enseignement.value" class="mr-4" />
        <label :for="enseignement.key">{{ enseignement.value }}</label>
      </div>
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <span class="font-semibold w-6rem">Niveau(x)</span>
      <div v-for="niveau of idxEls.data.niveaux" :key="niveau.key" class="flex align-items-center">
        <Checkbox v-model="selectedNiveaux" :inputId="niveau.key" name="niveau" :value="niveau.value" class="mr-4"  />
        <label :for="niveau.key">{{ niveau.value }}</label>
      </div>
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <label for="modules" class="font-semibold w-6rem">Modules utilisés</label>
      <AutoComplete id="modules" v-model="selectedModule" multiple :suggestions="filteredModules" optionLabel="name"
        @complete="search" class="w-full md:w-14rem" />

      <label for="themes" class="font-semibold w-6rem">Thèmes abordés</label>
      <Tree id="themes" v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="checkbox" :filter="true"
        filterMode="lenient" class="w-full md:w-30rem with-padding"></Tree>
    </div>
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

.my-form-grid {
  grid-template-columns: 1.5fr 1.5fr 2fr;
  column-gap: 0.5em;
}

ul.p-tree-container {
  padding-left: 0 !important;
}

.with-padding ul {
  padding-left: 1em;
}</style>
