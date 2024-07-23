<script setup>
import Fuse from "fuse.js";

const inputstyle = {
  base:
    "relative inline w-auto disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0",
};

const myStore = useMyStore();

await myStore.getTypes();
await myStore.getGroups();
await myStore.getFavorites();

const fuse = ref(
  new Fuse(myStore.types, {
    keys: ["name", "description", "tags"],
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    findAllMatches: true,
  })
);

const seuil = computed(() => {
  if (catChoice.value == "all" && matChoice.value == "all" && search.value.length == 0) return 0;
  else return 0.7;
});

const cats = useCats();
const mats = useMats();

const catChoice = ref("all");
const matChoice = ref("all");
const search = ref("");

const searchComp = computed(() => {
  if (search.value) return search.value.split(" ");
});

const datatest = ref();

const chosenCats = computed(() => {
  if (search.value && search.value.length > 1) {
    datatest.value = fuse.value.search(search.value);

    return datatest.value.map((el) => {
      return { ...el.item, ...el, score: 1 - el.score };
    });
  } else
    return myStore.types.map((el) => {
      return {
        ...el,
        score: el.niveau[catChoice.value] * (el.sujet[matChoice.value] ?? 1),
      };
    });
});

watch(myStore.types, () => {
  //console.log(myStore.types)
  fuse.value = new Fuse(myStore.types, {
    keys: ["name", "description", "tags"],
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    findAllMatches: true,
  });
});

const itemRefs = ref([]);;

const cols = [
  {
    key: "icon",
    label: "icon",
  },
  {
    key: "name",
    label: "name",
  },
];

const dispOptions = [{
  icon: 'th-large',
  value: 'icons'
}, {
  icon: 'bars',
  value: 'desc'
}, {
  icon: 'list',
  value: 'list'
}]

const dialogActi = ref(false);
const dialogGroup = ref("blocs");
const dispGroups = computed(() => {
  return myStore.actiSelView == 'groups' && 
          search.value.length == 0 && 
          catChoice.value == 'all' && 
          matChoice.value == 'all';
});
const test = ref('')
</script>

<template>
    <Card class="mb-4 rounded-t-none">
    <template #content>
      <div class="flex flex-row justify-between flex-wrap activites-header">
        <div class="text-xl font-bold">Créer une nouvelle activité</div>
          <InputText v-model="search" class="" placeholder="Recherche..." />
        <div class="flex flex-row gap-4">
          <Select v-model="catChoice" :options="cats" option-label="label" option-value="value" :ui="inputstyle" />
          <!-- <Select v-model="matChoice" :options="mats" option-label="label" option-value="value" :ui="inputstyle" /> -->
        </div>
      </div>
    </template>
    </Card>
    <div class="grid lg:grid-cols-4 sm:grid-cols-3 gap-4 mb-4" v-if="dispGroups">
      <Card>
        <template #header><div class="text-center font-bold pt-3">Favoris</div></template>
        <template #content>
          <div class="flex flex-wrap">
          <a v-for="acti in myStore.favorites" :key="acti" :href="'/web/node/add/activity?type=' + acti" @mouseover="test = acti" @mouseleave="test = ''">
            <img
              :src="myStore.types.find(el => el.id == acti).icon.path" v-tooltip.bottom="acti" 
              class="w-12 transition-opacity duration-[400ms]" :class="test != '' && test != acti ? 'opacity-20' : ''"
            />
          </a>
          </div>
        </template>
      </Card>
      <Card v-for="(obj, cat, index) in myStore.groupsAvecFav" class="hover:ring-capycolor-400 hover:ring-2 hover:cursor-pointer" @click="dialogActi = true; dialogGroup=cat">
      <template #header><div class="text-center font-bold pt-3">{{ obj.title }}</div></template>
      <template #content>
      <div class="flex flex-wrap">
        <img
          :src="myStore.types.find(el => el.id == acti).icon.path" v-for="acti in obj.activities"
          class="w-12"
        />
      </div>
      </template>
      </Card>
    </div>
    <Dialog v-model:visible="dialogActi" modal dismissableMask class="md:w-4/6">
      <template #header>
        <div class="text-lg font-bold">Catégorie {{ myStore.groupsAvecFav[dialogGroup].title }} : Choix des activités </div>
      </template>
      <div class="grid grid-cols-2 gap-4">
        <ActiCard v-for="acti in myStore.types.filter(el => myStore.groupsAvecFav[dialogGroup].activities.includes(el.id))" :activite="acti" />
      </div>
    </Dialog>
    <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4" v-if="!dispGroups">
      <ActiCard
        v-for="(item, index) of chosenCats
          .filter((a) => a.score > seuil)
          .sort((a, b) => b.score - a.score)"
        :key="index"
        :activite="item"
      ></ActiCard>
    </div>
</template>

<style>
.v-enter-active {
  transition: all 0.75s ease-out;
  max-height: 1000px;
}

.v-leave-active {
  transition: all 0.4s ease-out;
  max-height: 1000px;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
}

.p-row-even, .p-row-odd {
  cursor: pointer;
}

.p-row-even:hover, .p-row-odd:hover {
  background-color: #f5f5f5;
}

.activites-header {
  align-items: center;
}
</style>
