<script setup>
const searchENT = ref("");
const links = useEnts();
import Fuse from "fuse.js";

const { data: user, pending, error, status } = await fetchCurrentUser()


const fuse = ref(
  new Fuse(links.value, {
    keys: ["region", "name", "code"],
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 1,
    findAllMatches: true,
  })
);

watch(links, () => {
  //console.log(typeActivites)
  fuse.value = new Fuse(links.value, {
    keys: ["region", "name", "code"],
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 1,
    findAllMatches: true,
  });
});

const linksComp = computed(() => {
  if (searchENT.value) return fuse.value.search(searchENT.value).map((el) => el.item);
  else return links.value;
});

const popENT = ref()
const toggle = (event) => {
  popENT.value.toggle(event)
}
</script>

<template>
  <div v-if="user" class="text-white">
    <span>{{ user.firstname }} {{ user.lastname }}</span>
    <a href="/web/user/logout"><span class="px-2"><i class="pi pi-sign-out"></i></span></a>
  </div>
  <div class="flex flex-row items-stretch" v-else>
    <Button @click="toggle" icon="pi pi-sign-in" label="Connexion" class="mr-2" />
    <OverlayPanel ref="popENT">
      <InputText v-model="searchENT" class="m-2 w-full" :autofocus="true" />
        <div
          class="grid grid-cols-1 sm:grid-cols-2 p-4 overflow-auto"
          style="max-height: 80vh"
        >
          <a
            v-for="(link, index) of linksComp"
            :key="index"
            :href="link.link"
            class="flex flex-row p-1 items-center hover:bg-gray-100 rounded-lg"
            link
          >
              <Avatar :image="link.icon" class="mr-2" />
              <span>{{ link.name }} {{ link.region ? '('+link.region+')' : '' }}</span>
          </a>
        </div>
    </OverlayPanel>
  </div>
</template>
