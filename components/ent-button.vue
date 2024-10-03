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

const op = ref()
const toggle2 = (event) => {
  op.value.toggle(event)
}

const items = ref([])
if (user.value != null) {
  items.value = [{
    label: user.value.firstname + " " + user.value.lastname, icon: "pi pi-user",
    items: [
      { label: "Déconnexion", icon: "pi pi-sign-out", url: "/web/user/logout" },
    ]
  }]
}
</script>

<template>
  <div v-if="user">
    <Avatar :label="user.firstname[0] + user.lastname[0]" class="mr-2 cursor-pointer"
      :dt="{ 'width': '2.5rem', 'height': '2.5rem' }" style="color: var(--p-content-color)" @click="toggle2" />
    <Popover ref="op" pt:content:style="padding: 0;">
      <Menu :model="items" />
    </Popover>
  </div>
  <div class="flex flex-row items-stretch" v-else>
    <Button @click="toggle" icon="pi pi-sign-in" label="Connexion" class="mr-2" />
    <Popover ref="popENT">
      <InputText v-model="searchENT" class="m-2 w-full" :autofocus="true" />
      <div class="grid grid-cols-1 sm:grid-cols-2 p-4 overflow-auto" style="max-height: 80vh">
        <a v-for="(link, index) of linksComp" :key="index" :href="link.link"
          class="flex flex-row p-1 items-center hover:bg-gray-100 rounded-lg" link>
          <Avatar :image="link.icon" class="mr-2" />
          <span>{{ link.name }} {{ link.region ? '(' + link.region + ')' : '' }}</span>
        </a>
      </div>
    </Popover>
  </div>
</template>
