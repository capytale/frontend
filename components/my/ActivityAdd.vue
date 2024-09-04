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

const atl = useActivityTypesList()
const atf = useActivityTypeFavorites()

const activites = useActivitiesStore()

// liste des raccourcis à afficher
const shortcutList = computed(() => {
  const missings = nbShortcuts - atf.favoriteTypes.length;
  if (missings <= 0) {
    return atf.favoriteTypes;
  }

  const nbUsed: { [key: string]: number } = {};
  if (activites.activities.data) {
    for (const act of activites.activities.data) {
      if (atl.typeExists(act.type) && atl.typeIsAvailable(act.type) && !atf.isFavorite(act.type)) {
        if (!nbUsed[act.type]) nbUsed[act.type] = 1;
        else nbUsed[act.type]++;
      }
    }
  }
  const used = Object.keys(nbUsed).sort((a, b) => nbUsed[b] - nbUsed[a]);
  const result = atf.favoriteTypes.slice();
  const toAdd = Math.min(missings, used.length);
  for (let i = 0; i < toAdd; i++) {
    result.push(used[i]);
  }
  return result;
});

</script>

<template>
  <Card class="flex-1">
    <template #title>
      <h2 style="margin:0px">Créer une nouvelle activité
      </h2>
    </template>
    <template #content>
      <div class="overscroll-x-auto myflex">
        <a v-for="type of shortcutList" :key="type" :href="atl.getCreateUrl(type)"
          v-tooltip.bottom="atl.getTypeInfo(type)!.name" class="hover:shadow-md">
          <img :src="atl.getTypeInfo(type)!.icon.path" class="w-16 inline" />
          <span v-if="atf.isFavorite(type)" class="mystar">
            <i class="pi pi-star-fill text-yellow-400" style="font-size: 0.5rem"></i>
          </span>
        </a>
        <NuxtLink to="/activites" class="hover:shadow-md acti-button">
          <Button type="submit" label="Toutes les activités" />
        </NuxtLink>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.myflex {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.mystar {
  display: inline-block;
  position: relative;
  top: -30px;
  left: -2px;
}

fieldset {
  border: 1px solid #000;
  padding: 0.5em 1em 1em 1em;
  border-radius: 5px;
  /* position: relative; */
  /* top: -10px; */
}

.acti-button {
  position: relative;
  top: 2px;
}
</style>
