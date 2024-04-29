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
  <Card class="flex-1">
    <template #title>
          <h1>
          Mes activités
          <a href="/actiList" class="p-2" aria-label="maximize"> <i class="pi pi-window-maximize" ></i> </a>
          </h1>
    </template>
    <template #content>
      <p class="m-0">
        <DataTable :value="local.data" removableSort stripedRows tableStyle="min-width: 50rem" sortField="changed"
          :sortOrder="-1" paginator :rows="20" :rowsPerPageOptions="[10, 20, 50, 100]">

          <Column field="icon" header="Type" sortable >
            <template #body="p">
              <MyTableIcon :icon="p.data.icon" :type="p.data.type" />
            </template>
          </Column>

          <Column field="title" header="Titre" sortable>
            <template #body="p">
              <MyTableTitle :title="p.data.title" :nid="p.data.nid" :whoami="p.data.whoami" />
            </template>
          </Column>

          <Column field="appr" header="Évaluat° Appréciat°">
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
              <MyTableCodeMode :code="p.data.code" :mode="p.data.mode" :tr_beg="p.data.tr_beg" :tr_end="p.data.tr_end" />
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
</template>
