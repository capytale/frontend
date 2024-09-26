<script setup>
import { FilterMatchMode } from '@primevue/core/api';

const props = defineProps({
  usersList: Object,
  authenticated: Boolean,
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  lastname: { value: null, matchMode: FilterMatchMode.CONTAINS },
  firstname: { value: null, matchMode: FilterMatchMode.CONTAINS },
  classe: { value: null, matchMode: FilterMatchMode.IN },
});

const classes = ref([
  { name: '3e2' },
  { name: 'classeA' },
  { name: 'Tle 3' }
])

console.log(props.usersList)
</script>

<template>
  <template v-if="!props.authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir la liste des codes Sésame valides.</div>
  </template>
  <template v-else>
    <p>
      Vous pouvez modifier les nom, prénom et classe de vos élèves dans le tableau ci-dessous.
      Vous pouvez aussi modifier le mot de passe pour les élèves qui n'ont pas saisi d'adresse
      email à la création de leur compte.

    </p>

    <DataTable v-model:filters="filters" :value="props.usersList" sortField="classe" :sortOrder="-1" filterDisplay="row"
      :globalFilterFields="['lastname', 'firstname', 'classe']" tableStyle="min-width: 50rem" stateStorage="local"
      stateKey="dt-state-demo-session">
      <template #header>
        <Toolbar>
          <template #end>
            <IconField>
              <InputIcon> <i class="pi pi-search" /> </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Filtre rapide" />
            </IconField>
          </template>
        </Toolbar>
      </template>
      <!-- <DataTable :value="props.usersList" tableStyle="min-width: 50rem"> -->
      <Column field="lastname" header="Nom">
        <template #body="p">
          <SesameUserForm :data="p.data" :field="'lastname'" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher"
            class="smallit" />
        </template>
      </Column>
      <Column field="firstname" header="Prenom">
        <template #body="p">
          <SesameUserForm :data="p.data" :field="'firstname'" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher"
            class="smallit" />
        </template>
      </Column>
      <Column field="classe" sortable header="Classe">
        <template #body="p">
          <SesameUserForm :data="p.data" :field="'classe'" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="classes" optionLabel="name"
            optionValue="name" placeholder="Choisir" style="min-width: 14rem" :maxSelectedLabels="1" class="smallit">
            <template #option="slotProps">
              <span>{{ slotProps.option.name }}</span>
            </template>
          </MultiSelect>
          <!-- <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" /> -->
        </template>
      </Column>
      <Column field="username" sortable header="Identifiant"></Column>
      <Column header="PWD">
        <template #body="p">
          <SesameUserForm :data="p.data" :field="'classe'" />
        </template>
      </Column>
      <Column field="uid">
        <template #body="p">
          <i @click="delCode(p.data.uid)" class="pi pi-trash text-red-500 cursor-pointer" />
        </template>
      </Column>
    </DataTable>
  </template>
</template>

<style>
.smallit {
  width: 8em;
}

.myclass {
  vertical-align: inherit !important;
}

.eleves .py-4 {
  padding-bottom: 0px;
  padding-top: 0px;
}
</style>
