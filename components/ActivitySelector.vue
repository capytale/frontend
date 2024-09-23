<script setup lang="ts">
import Fuse from "fuse.js";
import { useActivityTypesList } from "~/composables/activityTypes/list";
import { useActivityTypeFavorites } from "~/composables/activityTypes/favorites";
import { useActivityTypeWeights } from "~/composables/activityTypes/weights";

const inputstyle = {
  base:
    "relative inline w-auto disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0",
};

const atl = useActivityTypesList();
const atf = useActivityTypeFavorites();
const atw = useActivityTypeWeights();

const groupsWithFav = computed(() => {
  if (atf.showFavorites) {
    return [
      {
        title: "Mes Favoris",
        icon: "pi pi-star-fill text-yellow-400",
        activities: atf.favoriteTypes,
        isFavorites: true,
      },
      ...atw.groups,
    ];
  } else {
    return atw.groups;
  }
});

const fuse = new Fuse<{ type: string }>([], {
  keys: [
    {
      name: "name",
      weight: 200,
      getFn: (obj) => {
        if (obj == null) return "";
        const i = atl.getTypeInfo(obj.type);
        if (i == null) return "";
        return i.name
      }
    },
    {
      name: "description",
      weight: 50,
      getFn: (obj) => {
        if (obj == null) return "";
        const i = atl.getTypeInfo(obj.type);
        if (i == null) return "";
        return i.description
      }
    },
    {
      name: "tags",
      weight: 200,
      getFn: (obj) => {
        if (obj == null) return "";
        const i = atl.getTypeInfo(obj.type);
        if (i == null) return "";
        if (i.tags == null) return "";
        return i.tags
      }
    },
  ],
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  findAllMatches: true,
});

watchEffect(() => {
  const at = atl.availableTypes.map((type) => ({ type }));
  fuse.setCollection(at);
});

const seuil = computed(() => {
  if (catChoice.value == "all" && search.value.length == 0) return 0;
  else return 0.7;
});

const catChoice = ref("all");
const search = ref("");

const datatest = ref();

const chosenCats = computed(() => {
  if (search.value && search.value.length > 1) {
    const results = fuse.search(search.value);
    datatest.value = results;

    return datatest.value.map((el) => {
      return { ...el.item, ...el, score: 1 - el.score };
    });
  } else
    return [];
});

const dialogActi = ref(false);
const openedGroup = ref<{ title: string; activities: string[] }>();
const dispGroups = computed(() => {
  return search.value.length == 0 && catChoice.value == 'all';
});
</script>

<template>
  <Card class="mb-4 mt-2 rounded-t-none">
    <template #content>
      <div class="flex flex-row justify-between flex-wrap items-center">
        <!-- <h1 class="h1_comme_h2">Créer une nouvelle activité</h1> -->
        <IconField iconPosition="left">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="search" class="rech" placeholder="Rechercher parmi les types d'activité" size="100" />
        </IconField>
        <div class="flex flex-row gap-4">
          <!--Select v-model="catChoice" :options="cats" option-label="label" option-value="value" :ui="inputstyle" /-->
          <!--Select v-model="matChoice" :options="mats" option-label="label" option-value="value" :ui="inputstyle" /-->
        </div>
      </div>
    </template>
  </Card>
  <template v-if="dispGroups">
    <div class="grid lg:grid-cols-4 sm:grid-cols-3 gap-4 mb-4">
      <Card v-for="obj of groupsWithFav" class="hover:ring-capycolor-400 hover:ring-2 hover:cursor-pointer"
        @click="dialogActi = true; openedGroup = obj">
        <template #header>
          <div class="text-center font-bold pt-3">{{ obj.title }} <i v-if="obj.icon" :class="obj.icon"></i></div>
        </template>
        <template #content>
          <div class="flex flex-wrap">
            <template v-for="type in obj.activities">
              <img v-if="atl.typeIsAvailable(type)" :src="atl.getTypeInfo(type)?.icon.path" class="w-12 m-1" />
            </template>
            <template v-if="obj.isFavorites && obj.activities.length == 0">
              <p>Aucune activité favorite. </p>
              <p>Ajoutez-en en cliquant sur une des icônes <i class="pi pi-star" /> </p>
            </template>

          </div>
        </template>
      </Card>
    </div>
    <Dialog v-model:visible="dialogActi" modal class="md:w-5/6 xl:w-10/12" dismissableMask>
      <template #header>
        <div class="text-lg font-bold">Catégorie {{ openedGroup?.title }} : Choix des activités
        </div>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <template v-for="type in openedGroup?.activities">
          <ActiCard v-if="atl.typeIsAvailable(type)" :type="type" />
        </template>
      </div>
    </Dialog>
  </template>
  <template v-else>
    <div class="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
      <ActiCard v-for="(item, index) of chosenCats
        .filter((a) => a.score > seuil)
        .sort((a, b) => b.score - a.score)" :key="index" :type="item.item.type"></ActiCard>
    </div>
  </template>
</template>

<style>
.h1_comme_h2 {
  font-size: 1.5rem;
  line-height: 1.75rem;
}
</style>

<style scoped>
.rech {
  width: 25rem;
}
</style>
