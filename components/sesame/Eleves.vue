<script setup>
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";
import { FilterMatchMode } from '@primevue/core/api';

const props = defineProps({
  usersList: Object,
  authenticated: Boolean,
  classes: Array,
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  lastname: { value: null, matchMode: FilterMatchMode.CONTAINS },
  firstname: { value: null, matchMode: FilterMatchMode.CONTAINS },
  classe: { value: null, matchMode: FilterMatchMode.IN },
});

const editingRows = ref([]);
const onRowEditSave = (event) => {
  let { newData, index } = event;
  let old = props.usersList[index]
  let uid = old.uid

  const fields = ['lastname', 'firstname', 'classe']
  for (const field of fields) {
    if (old[field] != newData[field]) {
      sesameApi.updateUser({ uid, [field]: newData[field] })
    }
  }
  props.usersList[index] = newData;
};

const classe = ref("")
const handleClasseEdit = () => {
  const uids = [...selectedUsers.value.map((o) => o.uid)]
  console.log("uids", uids)
  console.log("classe.value", classe.value)
  console.log("sesameApi.updateMultiUsers({ uids, classe: classe.value })")
  sesameApi.updateMultiUsers({ uids, classe: classe.value })
  classe.value = ""
  toggleClasseEdit()
}

const selectedUsers = ref([]);
const nbselected = () => {
  if (selectedUsers.value.length == 0) return null
  if (selectedUsers.value.length == 1) return "1 élément sélectionné "
  return selectedUsers.value.length + " éléments sélectionnés "
}

const ClassEditDialog = ref(false);
const toggleClasseEdit = () => {
  ClassEditDialog.value = !ClassEditDialog.value
};
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
      v-model:editingRows="editingRows" editMode="row" dataKey="uid" @row-edit-save="onRowEditSave" :pt="{
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
            <div v-if="nbselected()">
              <span class="mr-2">{{ nbselected() }}</span>
              <Button @click="toggleClasseEdit" label="Modifier la classe" icon="pi pi-pencil" class="mr-2"
                severity="primary" outlined v-tooltip.bottom="'Modifier tous les éléments sélectionnés'" />
            </div>
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
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="props.classes"
            optionLabel="name" optionValue="name" placeholder="Choisir" style="min-width: 14rem" :maxSelectedLabels="1"
            class="smallit">
            <template #option="slotProps">
              <span>{{ slotProps.option.name }}</span>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="username" sortable header="Identifiant"></Column>
      <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
    </DataTable>

  </template>

  <Dialog v-model:visible="ClassEditDialog" :style="{ width: '750px' }" header="Modifier" :modal="true">
    <Card class="my-4">
      <template #content>
        <div class="flex flex-col gap-2">
          <label for="classe">Nom de la classe à appliquer aux élèves séléctionnés</label>
          <InputText id="classe" v-model="classe" />
        </div>
        <div class="flex flex-row gap-2 my-4">
          <Button label="Valider" @click="handleClasseEdit" />
          <Button type="button" label="Annuler" severity="secondary" @click="toggleClasseEdit"></Button>
        </div>
      </template>
    </Card>
  </Dialog>
</template>

<style>
.smallit {
  width: 8em;
}
</style>
