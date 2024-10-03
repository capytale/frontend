<script setup>
import { useMyStore } from '@/stores/my'
import { useBibStore } from '@/stores/bib'
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
import httpClient from '@capytale/activity.js/backend/capytale/http'
// import Dialog from 'primevue/dialog';

const bib = useBibStore()

const products = ref(new Array(20));

const route = useRoute()
// console.log("location", route.query)
// TODO: faire en sorte que les recherces avancées génèrent une url copiable.

if (bib.bib == null || bib.bib.status != 'pending') {
  bib.getBib()
}
const abstractObj = ((html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  if (txt.value.includes('+…+')) return { abstract: txt.value.replace('+…+', ''), truncated: true }
  return { abstract: txt.value, truncated: false }
})

const advancedSearch = ref(false)
const xunion = (a, b) => [...new Set([...a, ...b])];
const list_niveaux = (() => {
  let set = []
  for (let item in bib.bib.data) {
    let a = String(bib.bib.data[item].niveau).split(', ')
    if (a[0] != "null") set = xunion(set, a)
  }
  // console.log("set", set)
  return set
})
const list_enseignements = (() => {
  let set = []
  for (let item in bib.bib.data) {
    let a = String(bib.bib.data[item].enseignement).split(', ')
    if (a[0] != "null") set = xunion(set, a)
  }
  // console.log("set", set)
  return set
})


const spacing = ((str) => {
  return str.split(',').join(', ')
})

const filters = ref()

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    abstract: { value: null, matchMode: FilterMatchMode.CONTAINS },
    niveau: { value: null, matchMode: FilterMatchMode.CONTAINS },
    enseignement: { value: null, matchMode: FilterMatchMode.CONTAINS },
    auteur: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.IN },
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}
const displayFull = async (nid) => {
  const full = await httpClient.getJsonAsync("/web/c-hdls/api/bib/full-descr/" + nid)
  // console.log("displayFull", full)
  let item = bib.bib.data.find(item => item.nid === nid)
  item.abstractFull = full.abstract
}




// const playerUrl = function (nid) {
//   return `/web/c-act/n/${nid}/play/view`
// }
</script>

<template>
  <div v-if="bib.bib == null">
    <p>Chargement des actvités...</p>
  </div>
  <div v-else-if="bib.bib.status == 'error'">
    <p>Impossible de charger les activités.</p> {{ bib.bib.status }}
  </div>
  <template v-else>
    <template v-if="bib.bib.data == null">
      <!-- ################################################################# -->
      <!-- ######################## Skeleton BEGIN ######################### -->
      <!-- ################################################################# -->
      <DataTable :value="products" paginator :rows="10">
        <template #header>
          <Toolbar>
            <template #start>
              <div class="titre">Bibliothèque entre enseignants</div>
            </template>
            <template #end>
              <div class="flex justify-content-end">
                <Skeleton width="20rem" height="3rem"></Skeleton>
                <Skeleton width="20rem" height="3rem"></Skeleton>
                <div class="flex items-center rech-avancee">
                  <Skeleton width="20rem" height="3rem"></Skeleton>
                </div>
                <Button type="button" label="Annuler" class="invisible" />
              </div>
            </template>
          </Toolbar>
        </template>
        <Column header="" style="width:5rem">
          <template #body>
            <Skeleton width="3rem" height="3rem"></Skeleton>
          </template>
        </Column>
        <Column header="Titre">
          <template #body>
            <Skeleton width="10rem" class="mb-2"></Skeleton>
          </template>
        </Column>
        <Column header="Description">
          <template #body>
            <Skeleton width="40rem" height="4rem"></Skeleton>
          </template>
        </Column>
        <Column header="Niveau">
          <template #body>
            <Skeleton width="5rem"></Skeleton>
          </template>
        </Column>
        <Column header="Enseignement">
          <template #body>
            <Skeleton width="10rem"></Skeleton>
          </template>
        </Column>
        <Column header="Nb. clone">
          <template #body>
            <Skeleton width="4rem"></Skeleton>
          </template>
        </Column>
        <Column header="Dernière modif." style="max-width:10rem" sortable>
          <template #body>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
          </template>
        </Column>
        <Column header="Auteur">
          <template #body>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
            <Skeleton width="7rem" class="mb-2"></Skeleton>
          </template>
        </Column>
      </DataTable>
      <!-- ################################################################# -->
      <!-- ######################## Skeleton END ########################### -->
      <!-- ################################################################# -->
    </template>
    <template v-else>
      <div class="card">

        <DataTable v-model:filters="filters" :value="bib.bib.data" paginator :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" :filterDisplay='advancedSearch ? "row" : ""'
          sortField="changed" :sortOrder="-1" :globalFilterFields="['title', 'abstract', 'auteur']">
          <template #header>
            <div class="flex flex-col xl:flex-row items-start lg:items-center min-h-24 justify-between">
              <div class="titre self-start">Bibliothèque entre enseignants
                ({{ bib.bib.data.length }} activités)
              </div>
              <div class="flex flex-col md:flex-row gap-2 justify-content-end self-start">
                <TypeFilterSelect v-model="filters['type'].value" />
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText class="h-full" v-model="filters['global'].value" placeholder="Rechercher"
                    v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 100, hideDelay: 300 }" />
                </IconField>

                <div class="flex items-center rech-avdancee">
                  <Checkbox v-model="advancedSearch" inputId="advSearch" :binary="true" />
                  <label for="advSearch" class="ml-2 whitespace-nowrap">Rech. avancée</label>
                </div>

                <div class="grow flex items-center">
                  <Button
                    v-if="filters['type'].value || filters['global'].value || filters['title'].value || filters['abstract'].value || filters['niveau'].value || filters['enseignement'].value || filters['auteur'].value"
                    type="button" icon="pi pi-filter-slash" label="Annuler" outlined severity="danger"
                    @click="clearFilter()" />
                  <Button v-else type="button" icon="pi pi-filter-slash" label="Annuler" outlined severity="secondary"
                    class="invisible" />
                </div>
              </div>

            </div>
          </template>

          <Column field="icon" header="" style="min-width:5rem">
            <template #body="p">
              <MyTableType :data="p.data" />
            </template>
          </Column>

          <Column field="title" header="Titre">
            <template #body="p">
              <BibViewActivity :data="p.data" />
              <!--         <!-- <a :href="playerUrl(p.data.nid)" class="font-bold">{{ p.data.title }}</a> -->
              <!--         <!-- <BibComments :data="p.data" /> -->
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
            </template>
          </Column>

          <Column field="abstract" header="Description">
            <template #body="p">
              <template v-if="abstractObj(p.data.abstract).truncated">
                <Inplace @open="displayFull(p.data.nid)">
                  <template #display>
                    <div
                      v-tooltip.top="{ value: 'Cliquer pour afficher l\'intégralité de la description', showDelay: 100, hideDelay: 300 }">
                      {{ abstractObj(p.data.abstract).abstract }}
                      <span class="text-blue-500 font-bold">[...]</span>
                    </div>
                  </template>
                  <template #content>
                    <p class="m-0">
                      {{ p.data.abstractFull }}
                    </p>
                  </template>
                </Inplace>
              </template>
              <template v-else>
                <p>{{ p.data.abstract }}</p>
              </template>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
            </template>
          </Column>
          <Column field="niveau" header="Niveau" :showFilterMenu="false">
            <template #body="p">
              {{ p.data.niveau }}
              <!-- ** {{ spacing(p.data.niveau) }} -->
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="list_niveaux()"
                placeholder="Choisir" style="min-width: 8rem" :showClear="false">
                <template #option="slotProps">
                  {{ slotProps.option }}
                </template>
              </Select>
            </template>
          </Column>

          <Column field="enseignement" header="Enseignement" :showFilterMenu="false">
            <template #body="p">
              {{ p.data.enseignement }}
              <!-- ** {{ spacing(p.data.enseignement) }} -->
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="list_enseignements()"
                placeholder="Choisir" style="min-width: 8rem" :showClear="false">
                <template #option="slotProps">
                  {{ slotProps.option }}
                </template>
              </Select>
            </template>
          </Column>

          <Column field="nb_clone" header="Nb. clone" sortable>
            <template #body="p">
              {{ p.data.nb_clone }}
            </template>
          </Column>

          <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
            <template #body="p">
              <MyTableChanged :data="p.data" />
            </template>
          </Column>

          <Column field="auteur" header="Auteur">
            <template #body="p">
              {{ p.data.auteur }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher"
                class="smallsearch" />
            </template>
          </Column>
        </DataTable>

      </div>
    </template>
  </template>
</template>

<style scoped>
.titre {
  font-size: 1.5rem;
  font-weight: bold;
}

.clear {
  padding-top: 1em;
}

.smallsearch {
  max-width: 9rem;
}

.rech-avancee {
  padding-left: 2em;
  width: 20rem;
}

.invisible {
  visibility: hidden;
}
</style>
