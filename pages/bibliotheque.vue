<script setup>
import { useMyStore } from '@/stores/my'
import { useBibStore } from '@/stores/bib'
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
// import Dialog from 'primevue/dialog';

const my = useMyStore()
const bib = useBibStore()

const products = ref(new Array(20));

const route = useRoute()
console.log("location", route.query)
// TODO: faire en sorte que les recherces avancées génèrent une url copiable.

if (bib.bib == null || bib.bib.status != 'pending') {
  bib.getBib()
}
my.types = await useActivities()

const getType = ((id) => {
  const a = my.types.filter(o => o.id == id)
  if (a.length == 0) return { name: "??", icon: { path: "" } }
  return a[0]
})
// affiche l'icône du type TODO : Déplacer dans utils

const decodeHtml = ((html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
})

const advancedSearch = ref(false)
const list_niveaux = ref(['2e', 'cycle3', 'cycle2'])
const list_enseignements = ref(['doc', 'snt', 'nsi'])
const filters = ref()

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    abstract: { value: null, matchMode: FilterMatchMode.CONTAINS },
    niveau: { value: null, matchMode: FilterMatchMode.CONTAINS },
    enseignement: { value: null, matchMode: FilterMatchMode.CONTAINS },
    auteur: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

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
                <Button type="button" label="Clear" class="invisible" />
              </div>
            </template>
          </Toolbar>
        </template>
        <Column field="icon" header="" style="width:5rem">
          <template #body>
            <Skeleton width="3rem" height="3rem"></Skeleton>
          </template>
        </Column>
        <Column field="title" header="Titre">
          <template #body>
            <Skeleton width="10rem" class="mb-2"></Skeleton>
          </template>
        </Column>
        <Column field="abstract" header="Description">
          <template #body>
            <Skeleton width="40rem" height="4rem"></Skeleton>
          </template>
        </Column>
        <Column field="abstract" header="Niveau">
          <template #body>
            <Skeleton width="10rem" height="5rem"></Skeleton>
          </template>
        </Column>
        <Column field="abstract" header="Enseignement">
          <template #body>
            <Skeleton width="10rem" height="4rem"></Skeleton>
          </template>
        </Column>
        <Column field="nid" header="nb clone">
          <template #body>
            <Skeleton width="4rem" height="2rem"></Skeleton>
          </template>
        </Column>
        <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
          <template #body>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
          </template>
        </Column>
        <Column field="nb_clone" header="nb clone" sortable>
          <template #body>
            <Skeleton size="2rem" class="mr-2"></Skeleton>
          </template>
        </Column>
        <Column field="auteur" header="Auteur">
          <template #body>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
          </template>
        </Column>
      </DataTable>
      <!-- ################################################################# -->
      <!-- ######################## Skeleton END ########################### -->
      <!-- ################################################################# -->
    </template>
    <template v-else>
      <div class="card">

        <DataTable v-model:filters="filters" :value="bib.bib.data" paginator :rows="10" dataKey="id"
          :filterDisplay='advancedSearch ? "row" : ""' sortField="changed" :sortOrder="-1"
          :globalFilterFields="['title', 'abstract', 'auteur']">
          <template #header>
            <Toolbar>
              <template #start>
                <div class="titre">Bibliothèque entre enseignants</div>
              </template>
              <template #end>

                <div class="flex justify-content-end">
                  <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id"
                    placeholder="Filtrer par type" class="w-full md:w-14rem max-w-64" showClear>
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex align-items-center">
                        <img :src="getType(slotProps.value).icon.path" class="w-8 mr-3" />
                        {{ slotProps.value }}
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                    <template #option="slotProps">
                      <div class="flex align-items-center">
                        <img :src="slotProps.option.icon.path" class="w-8 mr-3" />
                        <div>{{ slotProps.option.name }}</div>
                      </div>
                    </template>
                  </Select>


                  <IconField iconPosition="left">
                    <InputIcon>
                      <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Rechercher"
                      v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 100, hideDelay: 300 }" />
                  </IconField>

                  <div class="flex items-center rech-avancee">
                    <Checkbox v-model="advancedSearch" :binary="true" />
                    <label for="ingredient1" class="ml-2">Recherche avancée</label>
                  </div>

                  <Button
                    v-if="filters['title'].value || filters['abstract'].value || filters['niveau'].value || filters['enseignement'].value || filters['auteur'].value"
                    type="button" icon="pi pi-filter-slash" label="Clear" outlined severity="danger"
                    @click="clearFilter()" />
                  <Button v-else type="button" icon="pi pi-filter-slash" label="Clear" outlined severity="secondary"
                    class="invisible" />

                </div>
              </template>

            </Toolbar>
          </template>

          <Column field="icon" header="" style="width:5rem">
            <template #body="p">
              <MyTableType :data="p.data" />
            </template>
          </Column>

          <Column field="title" header="Titre">
            <template #body="p">
              <BibViewActivity :data="p.data" />
  <!--         <!-- <a :href="playerUrl(p.data.nid)" class="font-bold">{{ p.data.title }}</a> --> -->
  <!--         <!-- <BibComments :data="p.data" /> --> -->
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
            </template>
          </Column>

          <Column field="abstract" header="Description">
            <template #body="p">
              {{ decodeHtml(p.data.abstract) }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
            </template>
          </Column>
          <Column field="niveau" header="Niveau" :showFilterMenu="false">
            <template #body="p">
              {{ p.data.niveau }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="list_niveaux" placeholder="Choisir"
                style="min-width: 8rem" :showClear="true">
                <template #option="slotProps">
                  {{ slotProps.option }}
                </template>
              </Select>
            </template>
          </Column>

          <Column field="enseignement" header="Enseignement" :showFilterMenu="false">
            <template #body="p">
              {{ p.data.enseignement }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="list_enseignements"
                placeholder="Choisir" style="min-width: 8rem" :showClear="true">
                <template #option="slotProps">
                  {{ slotProps.option }}
                </template>
              </Select>
            </template>
          </Column>

          <Column field="nb_clone" header="nb clone" sortable>
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
  width: 9rem;
}

.rech-avancee {
  padding-left: 2em;
  width: 20rem;
}

.invisible {
  visibility: hidden;
}
</style>
