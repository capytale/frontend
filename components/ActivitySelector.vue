<script setup>
import Fuse from "fuse.js";
import TypeApi from "@capytale/activity.js/backend/capytale/activityType";

const inputstyle = {
  base:
    "relative inline w-auto disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0",
};

const fav = useState("actiFav");
fav.value = await TypeApi.getFavorites();
console.log(fav);

const typeActivites = await useActivities();

console.log(typeActivites.value);

const fuse = ref(
  new Fuse(typeActivites.value, {
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
    return typeActivites.value.map((el) => {
      return {
        ...el,
        score: el.niveau[catChoice.value] * (el.sujet[matChoice.value] ?? 1),
      };
    });
});

watch(typeActivites, () => {
  //console.log(typeActivites)
  fuse.value = new Fuse(typeActivites.value, {
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
</script>

<template>
    <UCard class="mb-4 rounded-t-none">
      <div class="flex flex-row justify-between">
        <div class="text-lg font-bold">Créer une nouvelle activité</div>
        <div class="flex flex-row gap-4">
          <USelect v-model="catChoice" :options="cats" :ui="inputstyle" />
          <USelect v-model="matChoice" :options="mats" :ui="inputstyle" />
          <UButtonGroup class="self-center">
            <UButton
              :variant="dispV('icons')"
              icon="i-streamline-image-photo-four-photos-camera-picture-photography-pictures-four-photo"
              @click="dispActivities = 'icons'"
            />
            <UButton
              :variant="dispV('desc')"
              icon="i-streamline-image-photo-polaroid-four-photos-camera-polaroid-picture-photography-pictures-four-photo"
              @click="dispActivities = 'desc'"
            />
            <UButton
              :variant="dispV('list')"
              icon="i-streamline-bullet-list"
              @click="dispActivities = 'list'"
            />
          </UButtonGroup>
        </div>
      </div>
      <UButton
        variant="soft"
        class="mx-2"
        v-for="el of ['web', 'python', 'robots', 'cartes', 'blocs']"
        :label="el"
      />
      <UInput v-model="search" class="mt-4" placeholder="Recherche..." />
    </UCard>
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

    <UTable
      v-else
      :ui="{ tr: { base: 'cursor-pointer hover:bg-primary-50' } }"
      :rows="chosenCats.filter((a) => a.score > seuil).sort((a, b) => b.score - a.score)"
      :columns="cols"
    >
      <template #icon-data="{ row }">
        <div class="w-16">
          <img :src="'https://capytale2.ac-paris.fr'.concat(row.icon.path)" />
        </div>
      </template>
      <template #name-data="{ row }">
        <div>
          <div class="text-lg font-semibold">{{ row.name }}</div>
          <div class="text-sm">{{ row.description }}</div>
        </div>
      </template>
    </UTable>
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
</style>
