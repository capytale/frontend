<script setup>
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import { useLocalStore } from '@/stores/local';
const local = useLocalStore();

// Charge les données locales ou distantes
local.getAsyncData()


const clear = function () {
  local.clear().then(() => {
    local.getAsyncData()
  })
}
// const saveStorage = function () {
//   local.saveStorage()
// }

</script>

<template>
  <div class="flex gap-4 mb-8">
    <Card class="flex-2">
      <template #title>Jouer une activité</template>
      <template #content>
        <p class="m-0">
        <div class="relative mt-2 rounded-md shadow-sm">
          <input type="text" name="code" id="code"
            class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="a12b-345678">
        </div>
        </p>
      </template>
    </Card>
    <Card class="flex-1">
      <template #title>Créer une activité
        <i class="p-2 pi pi-window-maximize"></i>
      </template>
      <template #content>
        <p class="m-0">
          Ici on fait apparaître les types favoris.
        </p>
      </template>
    </Card>
  </div>
  <div class="flex gap-4 ">
    <Card class="flex-1">
      <template #title>
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            Mes activités
            <a href="/actiList" class="p-2">
              <i class="pi pi-window-maximize"></i>
            </a>
          </div>
          <div class="text-right">
            <Button @click="clear" icon="pi pi-refresh" rounded raised class="bg-green-400"  />
          </div>
        </div>
      </template>
      <template #content>
        <p class="m-0">
          <DataTable :value="local.data" removableSort stripedRows tableStyle="min-width: 50rem">
            <Column field="icon" header="">
              <template #body="slotProps">
                <img :src="slotProps.data.icon" class="w-10">
              </template>
            </Column>
            <Column field="title" header="Titre"></Column>
            <Column field="code" header="code" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.code" class="font-mono"></Tag>
              </template>
            </Column>
            <Column field="changed" header="Dernière modif." sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.changed" severity="secondary"></Tag>
              </template>
            </Column>
          </DataTable>
        </p>
      </template>
    </Card>
  </div>
</template>
