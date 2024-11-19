<script setup>
document.title = "Capytale"
const sideMenu = useSideMenuStore()
const activites = useActivitiesStore()
const userStore = useCurrentUserStore()
activites.getActivities()

// const tags = useTagsStore()
// tags.getAllTags()
const tagsStore = useTagsStore()
const { status: tagsStatus } = await useLazyAsyncData('tags', () => tagsStore.getAllTags())


// Possible interaction dynamique avec le viewport pour auto-hide du menu
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const bpsmAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const bplargerThanSm = breakpoints.greater('sm') // only larger than sm
const bplgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const bpsmallerThanLg = breakpoints.smaller('lg') // only smaller than lg

//TODO : à voir !
//fin du todo

const handleResize = (event) => {
  // console.log("Ces valeurs pourraient être intégrées dans les pref utilisateur et chargées au démarrage")
  // console.log(event.sizes)
  // TODO : sauvegarder la taille dans les prefs utilisateur
}

// TODO : récupérer la dernière size dans les prefs utilisateur
const size = [20, 80]

const sideState = computed(() => {
  if (activites.activities.data?.length === 0) return "empty";
  if (bplgAndSmaller.value) return "collapsed";
  return "visible";
})

const gutter = computed(() => {
  return sideMenu.visible && sideState.value !== 'empty' ? 4 : 0
})

const isReady = computed(() => {
  const acti = activites.activities.status === 'success'
  const tagsReady = tagsStatus.value === 'success'
  // console.log("tagsReady: ", tagsStatus.value) ;
  
  const user = userStore.isLoaded
  return {
    acti,
    tags: tagsReady,
    user,
    all: acti && tagsReady && user,
  }
})

const tagsLogo = ref("pi pi-tags")

</script>

<template>
  <pre>{{ tagsStatus }}</pre>
  <pre>{{ isReady }}</pre>
  <div v-if="!userStore.isAuthenticated" class="mt-12 flex flex-col items-center gap-8">
Vous devez vous connecter pour accéder à vos activités.
<EntButton />
  </div>
  <div v-else class="flex flex-col">
    <div class="flex flex-col md:flex-row gap-4 my-4">
      <MyActivityPlay />
      <MyActivityAdd />
    </div>
    <MyListSkeleton v-if="!isReady.all" />
   <MyList v-else />

  </div>
</template>

<style scoped>
/* Additionnal CSS in default.vue */
.positionner {
  position: relative;
  left: -1.5rem;
  bottom: -1.5rem;
}

.rotate {
  transform: rotate(-45deg);
}

.surprise {
  display: none;
  position: relative;
  left: 1.5rem;
  bottom: 2.5rem;
  /* padding-left: 0; */
  /* z-index: 1; */
}

.parent {
  position: relative;
}

.parent:hover .surprise {
  display: inline;
}

.pointer {
  cursor: pointer;
}
</style>
