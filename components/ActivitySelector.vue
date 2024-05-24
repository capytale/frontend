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
  else return 0.5;
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

const itemRefs = ref([]);
const dispActivities = ref("desc");
const dispV = (v) => {
  if (dispActivities.value == v) return "solid";
  else return "ghost";
};

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
          <SelectButton :options="dispOptions" v-model="dispActivities" option-value="value">
            <template #option="slotProps">
              <i class="pi" :class="'pi-' + slotProps.option.icon" />
            </template>
          </SelectButton>
        </div>
      </div>
      <div class="w-full">
      <Button
        class="mx-2"
        v-for="el of ['web', 'python', 'robots', 'cartes', 'blocs']"
        :label="el"
      />
      </div>
      <InputText v-model="search" class="mt-4" placeholder="Recherche..." />
    </template>
    </Card>
    <div
      v-if="['desc', 'icons'].includes(dispActivities)"
      :class="
        dispActivities == 'desc'
          ? 'grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'
          : dispActivities == 'icons'
          ? 'grid lg:grid-cols-10 sm:grid-cols-6 grid-cols-3 gap-1'
          : ''
      "
    >
      <ActiCard
        v-for="(item, index) of chosenCats
          .filter((a) => a.score > seuil)
          .sort((a, b) => b.score - a.score)"
        :key="index"
        :activite="item"
        :disp="dispActivities"
      ></ActiCard>
    </div>

    <DataTable
      v-else
      :value="chosenCats.filter((a) => a.score > seuil).sort((a, b) => b.score - a.score)"
      @row-click="console.log($event)"
    >
    <Column header="">
      <template #body="slotProps">
        <img :src="`https://capytale2.ac-paris.fr${slotProps.data.icon.path}`" class="w-16" />
      </template>
    </Column>
    <Column field="name" header="name" />
    </DataTable>
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
