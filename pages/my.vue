<script setup>
document.title = "Capytale"
const sideMenu = useSideMenuStore()
const activites = useActivitiesStore()
const tags = useTagsStore()
const userStore = useCurrentUserStore()

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
  if (activites.activities?.length === 0) return "empty";
  if (bplgAndSmaller.value) return "collapsed";
  return "visible";
})

const gutter = computed(() => {
  return sideMenu.visible && sideState.value !== 'empty' ? 4 : 0
})

const isReady = computed(() => {
  const acti = activites.status === 'success'
  const tagsReady = tags.status === 'success'
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
  <div v-if="!userStore.isAuthenticated" class="mt-12 flex flex-col items-center gap-8">
Vous devez vous connecter pour accéder à vos activités.
<EntButton />
  </div>
  <div v-else class="flex flex-col">
    <NuxtPage />
    <div class="flex flex-col md:flex-row gap-4 my-4">
      <MyActivityPlay />
      <MyActivityAdd />
    </div>
    <MyListSkeleton v-if="!isReady.all" />
    <Splitter v-else @resizeend="handleResize" class="relative" :gutterSize="gutter">
      <SplitterPanel :size="size[0]" v-show="sideMenu.visible && sideState !== 'empty'">
        <SideMenu v-if="isReady.tags" />
      </SplitterPanel>
      <SplitterPanel :size="size[1]">
        <div class="flex flex-row overflow-scroll">
          <div>
            <div v-if="!sideMenu.visible && sideState !== 'empty'"
              class="mt-16 h-14 w-14 flex justify-center items-center absolute -top-10 left-4 z-[99]"
              @mouseover="tagsLogo = 'pi-thumbtack rotate'" @mouseleave="tagsLogo = 'pi-tags'">
              <div class="parent">
                <i :class="'parent pi ' + tagsLogo + ' p-4 rounded-full border-2 border-blue-500 pointer'"
                  style="font-size: 1.5rem; background-color: var(--p-card-background)" @click="sideMenu.visible = true"
                  v-tooltip.right="{ value: 'Épingler le menu des étiquettes', showDelay: 300, hideDelay: 0 }"></i>
                <div class="absolute z-[100] p-card zzz">
                  <div class="positionner">
                    <div class="tagWrapper p-card absolute surprise mx-20 my-40">
                      <SideMenu v-if="isReady.tags" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <MyListSkeleton v-if="!isReady.all" /> -->
          <MyList />
        </div>
      </SplitterPanel>
    </Splitter>
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
