<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import { useLocalStore } from '@/stores/local';
import { useUserStore } from '@/stores/user';

// Charge les données locales ou distantes
const local = useLocalStore();
local.getAsyncData()
const user = useUserStore();
user.getAsyncUser()

const clear = function () {
  local.clear().then(() => {
    local.getAsyncData()
  })
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
      <template #title>
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            Mes activités
            <a href="/actiList" class="p-2"> <i class="pi pi-window-maximize"></i> </a>
          </div>
          <div class="text-right">
            <Button @click="clear" icon="pi pi-refresh" rounded raised class="bg-green-400" />
          </div>
        </div>
      </template>
      <template #content>
        <p class="m-0">
          <DataTable :value="local.data" removableSort stripedRows tableStyle="min-width: 50rem" sortField="changed"
            :sortOrder="-1" paginator :rows="20" :rowsPerPageOptions="[10, 20, 50, 100]">

            <Column field="icon" header="" sortable>
              <template #body="p">
                <MyTableIcon :icon="p.data.icon" :type="p.data.type" />
              </template>
            </Column>

            <Column field="title" header="Titre" sortable>
              <template #body="p">
                <MyTableTitle :title="p.data.title" :nid="p.data.nid" :whoami="p.data.whoami" />
              </template>
            </Column>

            <Column field="appr" header="Évaluations Appréciations">
              <template #body="p">
                <MyTableEvalApprViews :views_total="p.data.views_total" :boss="p.data.boss" :whoami="p.data.whoami"
                  :evalu="p.data.evaluation" :appre="p.data.appreciation" />
              </template>
            </Column>

            <Column field="changed" header="Dernière modif." sortable>
              <template #body="p">
                <MyTableChanged :changed="p.data.changed" />
              </template>
            </Column>

            <Column field="mode" header="Partage">
              <template #body="p">
                <MyTableCodeMode :code="p.data.code" :mode="p.data.mode" :tr_beg="p.data.tr_beg"
                  :tr_end="p.data.tr_end" />
              </template>
            </Column>

            <Column field="plus" header="">
              <template #body="p">
                <MyTableMore :type="p.data.type" :icon="p.data.icon" />
              </template>
            </Column>

          </DataTable>
        </p>
      </template>
    </Card>
  </div>
</template>
