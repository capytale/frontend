<script setup>
const searchENT = ref("");
const links = useEnts();
import Fuse from "fuse.js";

import { useCookies } from "@vueuse/integrations/useCookies";
const cookies = useCookies().getAll();

console.log("all cookies : ");
console.log(cookies);
const preshot = ref(cookies["c-auth-pvd"] ? true : false);

const linkCookie = computed(() => {
  if (preshot.value && links.value)
    return links.value.find((el) => el.code == cookies["c-auth-pvd"]);
  else return null;
});

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
</script>

<template>
  <div v-if="auth" class="text-white">
    {{ auth.lastname }}
    <UButton color="white" label="Déconnexion" to="/web/user/logout" variant="solid" />
  </div>
  <div class="flex flex-row items-stretch" v-else>
    <ULink
      v-if="preshot == true && linkCookie !== null"
      :to="linkCookie.link"
      class="bg-primary-50 hover:bg-primary-100 p-1 flex flex-row items-center rounded rounded-r-none"
    >
      <slot name="avatar" :link="linkCookie">
        <UAvatar :src="linkCookie.icon" class="mr-2" size="xs" />
      </slot>
      <slot :link="linkCookie">
        <span>{{ linkCookie.name }} ({{ linkCookie.region }})</span>
      </slot>
    </ULink>
    <UPopover :ui="{ background: 'bg-white', trigger: 'h-full' }">
      <ULink
        class="bg-primary-50 hover:bg-primary-100 p-1 rounded rounded-l-none"
        v-if="preshot == true && linkCookie !== null"
        ><UIcon name="i-heroicons-chevron-down-20-solid"
      /></ULink>
      <UButton
        v-else
        label="Connexion"
        color="white"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
      <template #panel>
        <UInput v-model="searchENT" class="m-2" :autofocus="true" />
        <div
          class="grid grid-cols-1 sm:grid-cols-2 p-4 overflow-auto"
          style="max-height: 80vh"
        >
          <ULink
            v-for="(link, index) of linksComp"
            :key="index"
            :to="link.link"
            class="flex flex-row p-1 items-center hover:bg-primary-100 rounded"
          >
            <slot name="avatar" :link="link">
              <UAvatar :src="link.icon" class="mr-2" />
            </slot>
            <slot :link="link">
              <span>{{ link.name }} ({{ link.region }})</span>
            </slot>
          </ULink>
        </div>
      </template>
    </UPopover>
  </div>
</template>
