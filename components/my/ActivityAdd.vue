<script lang="ts">
/**
 * Nombre de raccourcis de création d'activité à afficher
 * C'est à dire les favorites + celle que l'utilisateur à déjà utilisées
 */
const nbShortcuts = 8;
</script>

<script setup lang="ts">
import { useActivityTypesList } from "~/composables/activityTypes/list"
import { useActivityTypeFavorites } from "~/composables/activityTypes/favorites"
import { useActivityTypeWeights } from "~/composables/activityTypes/weights"

const atl = useActivityTypesList()
const atf = useActivityTypeFavorites()
const atw = useActivityTypeWeights(true)

const activites = useActivitiesStore()


const visible = ref(false);

// index des types déjà utilisés avec leur nombre d'occurences
type NbUsedIndex = { [key: string]: number }
const existingTypeIndex = computed<NbUsedIndex | null>(() => {
  if (!activites.activities) return null;
  if (atf.status !== "loaded") return null;
  if (nbShortcuts === atf.favoriteTypes.length) return null;
  const ti: NbUsedIndex = {};
  for (const act of activites.activities) {
    let t = act.type;
    const info = atl.getTypeInfo(t);
    if ((info.replacedBy != null) && atl.typeIsAvailable(info.replacedBy)) {
      t = info.replacedBy;
    } else {
      if (!atl.typeIsAvailable(t)) continue;
    }
    if (ti[t]) ti[t]++;
    else ti[t] = 1;
  }
  return ti;
});

// liste des favoris
const shortcutList1 = computed(() => {
  if (atf.status !== "loaded") return null;
  if (nbShortcuts === atf.favoriteTypes.length) return atf.favoriteTypes;
  if (atf.favoriteTypes.length > nbShortcuts) {
    if (existingTypeIndex.value == null) return null;
    return atf.favoriteTypes
      .toSorted((a, b) => ((existingTypeIndex.value![b] || 0) - (existingTypeIndex.value![a] || 0)))
      .slice(0, nbShortcuts);
  } else {
    return atf.favoriteTypes;
  }
});

// liste des favoris + les plus utilisés
const shortcutList2 = computed(() => {
  if (shortcutList1.value == null) return null;
  if (shortcutList1.value.length >= nbShortcuts) {
    return shortcutList1.value;
  } else {
    if (existingTypeIndex.value == null) return shortcutList1.value;
    const noFav = [];
    for (const t of Object.keys(existingTypeIndex.value)) {
      if (!atf.isFavorite(t)) noFav.push(t);
    }
    if ((noFav.length + shortcutList1.value.length) < nbShortcuts) atw.load();
    noFav.sort((a, b) => (existingTypeIndex.value![b] - existingTypeIndex.value![a]));
    return shortcutList1.value.concat(noFav.slice(0, nbShortcuts - shortcutList1.value.length));
  }
});

// liste des favoris + les plus utilisés + les promus
const shortcutList3 = computed(() => {
  if (shortcutList2.value == null) return null;
  if (shortcutList2.value.length >= nbShortcuts) {
    return shortcutList2.value;
  } else {
    if (atw.status !== "loaded") return shortcutList2.value;
    const promoted = [];
    for (const t in atw.all) {
      if (shortcutList2.value.includes(t)) continue;
      promoted.push(t);
    }
    promoted.sort((a, b) => (atw.all[b] - atw.all[a]));
    return shortcutList2.value.concat(promoted.slice(0, nbShortcuts - shortcutList2.value.length));
  }
});

// liste des favoris + les plus utilisés + les promus + des skelettes pour compléter
const shortcutList = computed(() => {
  if (shortcutList3.value == null) {
    return Array(nbShortcuts).fill(null);
  }
  if (shortcutList3.value.length >= nbShortcuts) {
    return shortcutList3.value;
  } else {
    return shortcutList3.value.concat(Array(nbShortcuts - shortcutList3.value.length).fill(null));
  }
});
</script>

<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
      </h2>
    </template>
    <template #content>
      <div class="overflow-x-auto myflex flex-wrap">
        <template v-for="type of shortcutList">
          <div class="aspect-square w-16 relative">
            <template v-if="type">
              <a :href="atl.getCreateUrl(type)" v-tooltip.bottom="atl.getTypeInfo(type).name"
                class="hover:shadow-md shrink-0">
                <img :src="atl.getTypeInfo(type).icon.path" class="w-full h-full" />
              </a>
              <span v-if="atf.isFavorite(type)" class="mystar">
                <i class="pi pi-star-fill text-yellow-400" style="font-size: 0.5rem"></i>
              </span>
            </template>
            <template v-else>
              <Skeleton height="100%" />
            </template>
          </div>
        </template>
        <Button class="w-full md:w-auto" label="Toutes les activités" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Créer une nouvelle activité" position="top" modal
          :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" class="w-11/12 md:w-3/4" maximizable dismissableMask>
          <ActivitySelector />
        </Dialog>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.myflex {
  display: flex;
  gap: 0.7rem;
  align-items: stretch;
}

.mystar {
  position: absolute;
  top: -0.65rem;
  left: 3.88rem;
}
</style>
