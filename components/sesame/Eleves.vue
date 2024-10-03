<script setup>
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";
import { FilterMatchMode } from '@primevue/core/api';
import { formatPrettyDateTime } from '~/utils/format';
const toast = useToast();

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
const onRowEditSave = async (event) => {
  let { newData, index } = event;
  let old = props.usersList[index]
  let uid = old.uid

  try {

    props.usersList[index] = newData;

    const data = { uid, }
    if (pwd.value != "") {
      data['pwd'] = pwd.value
      pwd.value = ""
    }
    const fields = ['lastname', 'firstname', 'classe']
    for (const field of fields) {
      if (old[field] != newData[field]) {
        data[field] = newData[field]
      }
    }
    // console.log("onRowEditSave", data)
    await sesameApi.updateUser(data)
  } catch (e) {
    console.log("onRowEditSave", e.payload)
    props.usersList[index] = old
    if (e.payload && e.payload.code == 3) {
      toast.add({ severity: 'error', summary: 'Échec', detail: "Le mot de passe doit contenir au moins 3 types de caractères parmi les types de caractères suivants : lettres minuscules, lettres majuscules, chiffres, caractères spéciaux. La longueur du mot de passe doit être d'au moins 12 caractères." });
    } else {
      toast.add({ severity: 'error', summary: 'Échec', detail: `uid = ${uid} - ${e}` });
    }
  }
};

const selectedUsers = ref([]);
const nbselected = () => {
  if (selectedUsers.value.length == 0) return null
  if (selectedUsers.value.length == 1) return "1 élément sélectionné "
  return selectedUsers.value.length + " éléments sélectionnés "
}

const classEditDialog = ref(false);
const toggleClasseEdit = () => {
  classEditDialog.value = !classEditDialog.value
};
const classe = ref("")
const handleClasseEdit = () => {
  const uids = [...selectedUsers.value.map((o) => o.uid)]
  try {
    sesameApi.updateMultiUsers({ uids, classe: classe.value })
    props.usersList.forEach((o) => {
      if (uids.includes(o.uid)) {
        o.classe = classe.value
      }
    })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Échec', detail: `nid = ${selectedNid.value} - ${e}` });
  }
  classe.value = ""
  toggleClasseEdit()
}

const pwd = ref("")

</script>

<template>
  <template v-if="!props.authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir la liste des codes Sésame valides.</div>
  </template>
  <template v-else>
    <ul>
      <li>
        Vous pouvez modifier les nom, prénom et classe de vos élèves dans le tableau ci-dessous.
      </li>
      <li>
        Vous pouvez aussi modifier le mot de passe pour les élèves qui n'ont pas saisi d'adresse
        email à la création de leur compte.
      </li>
    </ul>

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
              <!-- <Button @click="togglepwdEdit" label="Modifier le mot de passe" icon="pi pi-pencil" class="mr-2" -->
              <!--   severity="primary" outlined v-tooltip.bottom="'Modifier tous les éléments sélectionnés'" /> -->
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
      <Column field="lastname" sortable header="Nom">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher"
            class="smallit" />
        </template>
      </Column>
      <Column field="firstname" sortable header="Prénom">
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
      <Column field="username" sortable header="Nom d'utilisateur">
        <template #body="p">
          {{ p.data.has_mail ? '*email*' : p.data.username }}
        </template>
      </Column>
      <Column field="has_mail" header="Mot de passe">
        <template #body="p">
          {{ p.data.has_mail ? '🚫' : '••••••' }}
        </template>
        <template #editor="{ data, field }">
          <Password v-model="pwd" fluid :disabled="data[field]" />
        </template>
      </Column>
      <Column field="validity.grace" sortable header="Expiration">
        <template #body="p">
          {{ formatPrettyDateTime(p.data.validity.grace, false) }}
        </template>
      </Column>
      <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
    </DataTable>

  </template>

  <Dialog v-model:visible="classEditDialog" :style="{ width: '750px' }" header="Modifier" :modal="true">
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
