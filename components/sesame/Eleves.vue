<script setup>
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";
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


const editingRows = ref([]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  let uid = props.usersList[index].uid

  if (props.usersList[index].lastname != newData.lastname) {
    sesameApi.updateUser({ uid, lastname: newData.lastname })
  }
  if (props.usersList[index].firstname != newData.firstname) {
    sesameApi.updateUser({ uid, firstname: newData.firstname })
  }
  if (props.usersList[index].classe != newData.classe) {
    sesameApi.updateUser({ uid, classe: newData.classe })
  }
  props.usersList[index] = newData;
};
console.log(props.usersList)

const selectedUsers = ref([]);

const nbselected = () => {
  if (selectedUsers.value.length == 0) return " "
  if (selectedUsers.value.length == 1) return "1 élément sélectionné "
  return selectedUsers.value.length + " éléments sélectionnés "
}
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


    <DataTable :value="props.usersList" v-model:selection="selectedUsers" v-model:filters="filters" sortField="classe"
      :sortOrder="-1" filterDisplay="menu" :globalFilterFields="['lastname', 'firstname', 'classe']"
      tableStyle="min-width: 50rem" stateStorage="local" stateKey="dt-state-demo-session"
      v-model:editingRows="editingRows" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem'
          })
        }
      }">
      <template #header>
        <Toolbar>
          <template #start>
            <span class="mr-2">{{ nbselected() }}</span>
          </template>
          <template #end>
            <IconField>
              <InputIcon> <i class="pi pi-search" /> </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Filtre rapide" />
            </IconField>
          </template>
        </Toolbar>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="lastname" header="Nom">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher"
            class="smallit" />
        </template>
      </Column>
      <Column field="firstname" header="Prénom">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher"
            class="smallit" />
        </template>
      </Column>
      <Column field="classe" sortable header="Classe">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
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
      <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
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
