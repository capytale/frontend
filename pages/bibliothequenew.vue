<script setup lang="ts">
import { useBibList } from '@/composables/bib/list';
import { useBibMetaData } from '@/composables/bib/metaData';
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
// import Dialog from 'primevue/dialog';

const bibStore = useBibList();
const metaDataStore = useBibMetaData();

const advancedSearch = ref(false)

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

const previewedActivity = ref<{ nid: number, title: string }>();

</script>

<template>
  <BibActivityPreview v-model="previewedActivity" />
  <div v-if="bibStore.status == 'error'">
    <p>Impossible de charger les activités.</p> {{ bibStore.error }}
  </div>
  <template v-else>
    <template v-if="bibStore.status == 'loading'">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />
    </template>
    <template v-else>
      <div class="card">

        <DataTable v-model:filters="filters" :value="bibStore.list as any[]" paginator :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="nid" :filterDisplay="advancedSearch ? 'row' : undefined"
          sortField="changed" :sortOrder="-1" :globalFilterFields="['title', 'abstract', 'auteur']">
          <template #header>
            <div class="flex flex-col xl:flex-row items-start lg:items-center min-h-24 justify-between">
              <div class="titre self-start">Bibliothèque entre enseignants
                ({{ bibStore.list.length }} activités)
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

          <Column field="title" header="Titre" class="overflow-hidden max-w-prose">
            <template #body="p">
              <a @click="() => { previewedActivity = p.data }" class="tablelink">{{ p.data.title }}</a>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
            </template>
          </Column>

          <Column field="abstract" header="Description" class="overflow-hidden max-w-prose">
            <template #body="p">
              <BibAbstract :data="p.data" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
            </template>
          </Column>
          <Column field="niveau" header="Niveau" :showFilterMenu="false">
            <template #body="p">
              <p v-for="n of p.data.niveau" :key="n">
                {{ metaDataStore.getNiveauLabel(n) }}
              </p>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()"
                :options="metaDataStore.niveauCodes as any[]" placeholder="Choisir" style="min-width: 8rem"
                :showClear="false">
                <template #value="p">
                  <template v-if="p.value">{{ metaDataStore.getNiveauLabel(p.value) }}</template>
                  <template v-else>{{ p.placeholder }}</template>
                </template>
                <template #option="p">{{ metaDataStore.getNiveauLabel(p.option) }}</template>
              </Select>
            </template>
          </Column>

          <Column field="enseignement" header="Enseignement" :showFilterMenu="false">
            <template #body="p">
              <p v-for="e of p.data.enseignement" :key="e">
                {{ metaDataStore.getEnseignementLabel(e) }}
              </p>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()"
                :options="metaDataStore.enseignementCodes as any[]" placeholder="Choisir" style="min-width: 8rem"
                :showClear="false">
                <template #value="p">
                  <template v-if="p.value">{{ metaDataStore.getEnseignementLabel(p.value) }}</template>
                  <template v-else>{{ p.placeholder }}</template>
                </template>
                <template #option="p">{{ metaDataStore.getEnseignementLabel(p.option) }}</template>
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

.tablelink {
  color: var(--p-primary-color);
  cursor: pointer;
}
</style>
