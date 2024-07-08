<script setup>
import Fuse from "fuse.js";
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";

const inputstyle = {
  base:
    "relative inline w-auto disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0",
};

const myStore = useMyStore();
myStore.favorites = await TypeApi.getFavorites();

myStore.types = await useActivities();
myStore.groups = await TypeApi.getGroups();
console.log(myStore.groups);

console.log(myStore.types);

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
  if (catChoice.value == "all" && matChoice.value == "all") return 0;
  else return 0.7;
});

const cats = useCats();
const mats = useMats();

const catChoice = ref("all");
const matChoice = ref("all");
const search = ref();

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

</script>

<template>
    <Card class="mb-4 rounded-t-none">
    <template #content>
      <div class="flex flex-row justify-between">
        <div class="text-lg font-bold">Créer une nouvelle activité</div>
        <div class="flex flex-row gap-4">
          <Dropdown v-model="catChoice" :options="cats" option-label="label" option-value="value" :ui="inputstyle" />
          <Dropdown v-model="matChoice" :options="mats" option-label="label" option-value="value" :ui="inputstyle" />
        </div>
      </div>
      <InputText v-model="search" class="mt-4" placeholder="Recherche..." />
    </template>
    </Card>
    <div class="grid grid-cols-4 gap-4 mb-4">
      <Card v-for="(obj, cat, index) in myStore.groups" class="hover:ring-capycolor-400 hover:ring-2 hover:cursor-pointer">
      <template #header><div class="text-center font-bold">{{ obj.title }}</div></template>
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
    <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4" v-if="false">
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
</style>
