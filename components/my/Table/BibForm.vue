<script setup>
import { _ } from 'vue-underscore'
import { useThemesStore } from '@/stores/themes';
import { useModulesStore } from '@/stores/modules';

const props = defineProps({
  nid: String,
})

const resume = ref('')
const share = ref(false);
const web = ref(false);
const selectedKey = ref(null)

const themes = useThemesStore();
themes.getThemes()
// console.log(themes.data)
// https://np.ac-capytale.fr/web/c-api/themes_rest?_format=json
// https://tidpen.io/Nicolas-Poulain/pen/oNOKOpp?editors=1010
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
const nodes = unflatten(themes.data);
// const nodes = [
//   { "key": "1799", "label": "Histoire", "id": "1799", "parentid": "",
//     "children": [
//       { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
//       { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
//     ]
//   }
// ]


const modules = useModulesStore();
modules.getModules()
// const modules = ref([
//   { name: 'csv', tid: '123' },
//   { name: 'cmath', tid: '234' },
//   { name: 'matplotlib', tid: '345' },
// ]);
const selectedModule = ref();
const filteredModules = ref();

const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredModules.value = [...modules.data];
    } else {
      filteredModules.value = modules.data.filter((module) => {
        return module.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}


const categories = ref([
  { name: "Accounting", key: "A" },
  { name: "Marketing", key: "M" },
  { name: "Production", key: "P" },
  { name: "Research", key: "R" }
]);
const selectedCategories = ref(['Marketing']);

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
      <div v-for="category of categories" :key="category.key" class="flex align-items-center">
        <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.name" />
        <label :for="category.key">{{ category.name }}</label>
      </div>
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <span class="font-semibold w-6rem">Niveau(x)</span>
      <div v-for="category of categories" :key="category.key" class="flex align-items-center">
        <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.name" />
        <label :for="category.key">{{ category.name }}</label>
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

.my-form-grid {
  grid-template-columns: 1.5fr 1.5fr 2fr;
}
ul.p-tree-container {
  padding-left: 0 !important;
}
.with-padding ul {
  padding-left: 1em;
}
  </style>
