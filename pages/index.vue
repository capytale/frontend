<script setup>
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import { useLocalStore } from '@/stores/local';
const local = useLocalStore();

// console.log('data', local.getData)
local.getAsyncData().then((data) => { console.log('AsyncData', data) })


const clear = function () {
  local.clear()
}
const saveStorage = function () {
  local.saveStorage()
}

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
      <template #title>Mes activités
        <i @click="clear" class="p-2 pi pi-refresh"></i>
        <i @click="saveStorage" class="p-2 pi pi-save"></i>
        <a href="/actiList" class="p-2">
          <i class="pi pi-window-maximize"></i>
        </a>
      </template>
      <template #content>
        <p class="m-0">
          <DataTable :value="local.data" removableSort stripedRows tableStyle="min-width: 50rem">
            <Column field="icon" header=""></Column>
            <Column field="title" header="Titre"></Column>
            <Column field="code" header="code" sortable>
              <template #body="slotProps">
                <Badge :value="slotProps.data.code" class="font-mono"></Badge>
              </template>
            </Column>
            <Column field="update" header="Dernière modif." sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.update" severity="secondary"></Tag>
              </template>
            </Column>
          </DataTable>
        </p>
      <p>Données {{ local.dataSource }}</p>
      </template>
    </Card>
    <Card class="flex-1">
      <template #title>Bibliothèque
        <i class="p-2 pi pi-refresh"></i>
        <i class="p-2 pi pi-window-maximize"></i>
      </template>
      <template #content>
        <p class="m-0">
          Ici, on fait apparaître :
        <ul>
          <li>- Icône de type</li>
          <li>- Titre </li>
        </ul>
        Ces infos proviennent d'une requête sans jointure sur une unique table
        </p>
      </template>
    </Card>
  </div>
</template>
