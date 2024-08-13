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
// const typeIcon = (id) => {
//   const obj = my.types.find(o => o.id === id)
//   return obj ? obj.icon.path : ''
// }

const decodeHtml = ((html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
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
    </template>
  </template>
  <template v-else>
    <div class="card">

      <DataTable v-model:filters="filters" :value="bib.bib.data" paginator :rows="10" dataKey="id" filterDisplay="menu"
        sortField="changed" :sortOrder="-1" :globalFilterFields="['title', 'abstract', 'auteur']">
        <template #header>
          <Toolbar>
            <template #start>
              <div class="titre">Bibliothèque entre enseignants</div>
            </template>
            <template #end>

              <div class="flex justify-content-end">
                <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id"
                  placeholder="Filter par type" class="w-full md:w-14rem" showClear>
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
              </div>
            </template>

          </Toolbar>
          <div class="flex justify-end clear">
            <div v-if="filters['title'].value || filters['abstract'].value || filters['niveau'].value || filters['enseignement'].value || filters['auteur'].value">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            </div>
          </div>
        </template>
        <Column field="icon" header="" style="width:5rem">
          <template #body="p">
            <img :src=getType(p.data.type).icon.path
              v-tooltip.top="{ value: getType(p.data.type).name, showDelay: 300, hideDelay: 0 }" alt="icon"
              class="w-16 h-16" />
            <!-- <MyTableType :icon="p.data.icon" :type="p.data.type" /> -->
          </template>
        </Column>

        <Column field="title" header="Titre">
          <template #body="p">
            <BibViewActivity :data="p.data" />
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
        <Column field="niveau" header="Niveau(x)">
          <template #body="p">
            {{ p.data.niveau }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
          </template>
        </Column>

        <Column field="enseignement" header="Enseignement(s)">
          <template #body="p">
            {{ p.data.enseignement }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
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
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher" />
          </template>
        </Column>
        <!-- <Column field="name" header="Name" style="min-width: 12rem"> -->
        <!--   <template #body="{ data }"> -->
        <!--     {{ data.name }} -->
        <!--   </template> -->
        <!--   <template #filter="{ filterModel, filterCallback }"> -->
        <!--     <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" /> -->
        <!--   </template> -->
        <!-- </Column> -->
        <!-- <Column header="Country" filterField="country.name" style="min-width: 12rem"> -->
        <!--   <template #body="{ data }"> -->
        <!--     <div class="flex items-center gap-2"> -->
        <!--       <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" -->
        <!--         :class="`flag flag-${data.country.code}`" style="width: 24px" /> -->
        <!--       <span>{{ data.country.name }}</span> -->
        <!--     </div> -->
        <!--   </template> -->
        <!--   <template #filter="{ filterModel, filterCallback }"> -->
        <!--     <InputText v-model="filterModel.value" type="text" @input="filterCallback()" -->
        <!--       placeholder="Search by country" /> -->
        <!--   </template> -->
        <!-- </Column> -->
        <!-- <Column header="Agent" filterField="representative" :showFilterMenu="false" style="min-width: 14rem"> -->
        <!--   <template #body="{ data }"> -->
        <!--     <div class="flex items-center gap-2"> -->
        <!--       <img :alt="data.representative.name" -->
        <!--         :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" -->
        <!--         style="width: 32px" /> -->
        <!--       <span>{{ data.representative.name }}</span> -->
        <!--     </div> -->
        <!--   </template> -->
        <!--   <template #filter="{ filterModel, filterCallback }"> -->
        <!--     <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="representatives" -->
        <!--       optionLabel="name" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="1"> -->
        <!--       <template #option="slotProps"> -->
        <!--         <div class="flex items-center gap-2"> -->
        <!--           <img :alt="slotProps.option.name" -->
        <!--             :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" -->
        <!--             style="width: 32px" /> -->
        <!--           <span>{{ slotProps.option.name }}</span> -->
        <!--         </div> -->
        <!--       </template> -->
        <!--     </MultiSelect> -->
        <!--   </template> -->
        <!-- </Column> -->
        <!-- <Column field="status" header="Status" :showFilterMenu="false" style="min-width: 12rem"> -->
        <!--   <template #body="{ data }"> -->
        <!--     <Tag :value="data.status" :severity="getSeverity(data.status)" /> -->
        <!--   </template> -->
        <!--   <template #filter="{ filterModel, filterCallback }"> -->
        <!--     <Select v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" -->
        <!--       style="min-width: 12rem" :showClear="true"> -->
        <!--       <template #option="slotProps"> -->
        <!--         <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" /> -->
        <!--       </template> -->
        <!--     </Select> -->
        <!--   </template> -->
        <!-- </Column> -->
        <!-- <Column field="verified" header="Verified" dataType="boolean" style="min-width: 6rem"> -->
        <!--   <template #body="{ data }"> -->
        <!--     <i class="pi" -->
        <!--       :class="{ 'pi-check-circle text-green-500': data.verified, 'pi-times-circle text-red-400': !data.verified }"></i> -->
        <!--   </template> -->
        <!--   <template #filter="{ filterModel, filterCallback }"> -->
        <!--     <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary -->
        <!--       @change="filterCallback()" /> -->
        <!--   </template> -->
        <!-- </Column> -->
      </DataTable>

    </div>
  </template>
</template>




  <!--     <DataTable :value="products" paginator :rows="20" v-model:filters="filters" sortField="changed" :sortOrder="-1" -->
  <!--       filterDisplay="menu" :globalFilterFields="['title', 'abstract', 'niveau', 'enseignement', 'auteur']" -->
  <!--       :rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 50rem"> -->

  <!--       <template #header> -->
  <!--         <Toolbar> -->
  <!--           <template #start> -->
  <!--             <div class="titre">Bibliothèque entre enseignants</div> -->
  <!--           </template> -->
  <!--           <template #end> -->

  <!--             <div class="flex justify-content-end"> -->
  <!--               <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id" -->
  <!--                 placeholder="Filter par type" class="w-full md:w-14rem" showClear> -->
  <!--                 <template #value="slotProps"> -->
  <!--                   <div v-if="slotProps.value" class="flex align-items-center"> -->
  <!--                     <img :src="getType(slotProps.value).icon.path" class="w-8 mr-3" /> -->
  <!--                   </div> -->
  <!--                   <span v-else> -->
  <!--                     {{ slotProps.placeholder }} -->
  <!--                   </span> -->
  <!--                 </template> -->
  <!--                 <template #option="slotProps"> -->
  <!--                   <div class="flex align-items-center"> -->
  <!--                     <img :src="slotProps.option.icon.path" class="w-8 mr-3" /> -->
  <!--                     <div>{{ slotProps.option.name }}</div> -->
  <!--                   </div> -->
  <!--                 </template> -->
  <!--               </Select> -->


  <!--               <IconField iconPosition="left"> -->
  <!--                 <InputIcon> -->
  <!--                   <i class="pi pi-search" /> -->
  <!--                 </InputIcon> -->
  <!--                 <InputText v-model="filters['global'].value" placeholder="Rechercher" -->
  <!--                   v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 300, hideDelay: 0 }" /> -->
  <!--               </IconField> -->
  <!--             </div> -->
  <!--           </template> -->

  <!--         </Toolbar> -->
  <!--       </template> -->
  <!--       <Column field="icon" header="" style="width:5rem"> -->
  <!--         <template #body> -->
  <!--           <Skeleton width="3rem" height="3rem"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--       <Column field="title" header="Titre"> -->
  <!--         <template #body> -->
  <!--           <Skeleton width="30rem" class="mb-2"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--       <Column field="abstract" header="Description"> -->
  <!--         <template #body> -->
  <!--           <Skeleton width="70rem" height="4rem"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--       <Column field="nid" header=""> -->
  <!--         <template #body> -->
  <!--           <Skeleton width="4rem" height="2rem"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--       <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable> -->
  <!--         <template #body> -->
  <!--           <Skeleton width="5rem" class="mb-2"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--       <Column field="nb_clone" header="nb clone" sortable> -->
  <!--         <template #body> -->
  <!--           <Skeleton size="2rem" class="mr-2"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--       <Column field="auteur" header="Auteur"> -->
  <!--         <template #body> -->
  <!--           <Skeleton width="5rem" class="mb-2"></Skeleton> -->
  <!--         </template> -->
  <!--       </Column> -->
  <!--     </DataTable> -->
  <!--   </div> -->
  <!-- </template> -->
  <!-- <template v-else> -->
  <!--   <DataTable :value="bib.bib.data" paginator :rows="20" v-model:filters="filters" sortField="changed" :sortOrder="-1" -->
  <!--     :globalFilterFields="['title', 'abstract', 'auteur']" :rowsPerPageOptions="[10, 20, 50]" -->
  <!--     tableStyle="min-width: 50rem"> -->

  <!--     <template #header> -->
  <!--       <Toolbar> -->
  <!--         <template #start> -->
  <!--           <div class="titre">Bibliothèque entre enseignants -->
  <!--             {{ bib.bib.data.length }} activités -->
  <!--           </div> -->
  <!--         </template> -->
  <!--         <template #end> -->

  <!--           <div class="flex justify-content-end"> -->
  <!--             <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id" -->
  <!--               placeholder="Filter par type" class="w-full md:w-14rem" showClear> -->
  <!--               <template #value="slotProps"> -->
  <!--                 <div v-if="slotProps.value" class="flex align-items-center"> -->
  <!--                   <img :src="getType(slotProps.value).icon.path" class="w-8 mr-3" /> -->
  <!--                 </div> -->
  <!--                 <span v-else> -->
  <!--                   {{ slotProps.placeholder }} -->
  <!--                 </span> -->
  <!--               </template> -->
  <!--               <template #option="slotProps"> -->
  <!--                 <div class="flex align-items-center"> -->
  <!--                   <img :src="slotProps.option.icon.path" class="w-8 mr-3" /> -->
  <!--                   <div>{{ slotProps.option.name }}</div> -->
  <!--                 </div> -->
  <!--               </template> -->
  <!--             </Select> -->


  <!--             <IconField iconPosition="left"> -->
  <!--               <InputIcon> -->
  <!--                 <i class="pi pi-search" /> -->
  <!--               </InputIcon> -->
  <!--               <InputText v-model="filters['global'].value" placeholder="Rechercher" -->
  <!--                 v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 300, hideDelay: 0 }" /> -->
  <!--             </IconField> -->
  <!--           </div> -->
  <!--         </template> -->

  <!--       </Toolbar> -->
  <!--     </template> -->


  <!--     <Column field="icon" header="" style="width:5rem"> -->
  <!--       <template #body="p"> -->
  <!--         <img :src=getType(p.data.type).icon.path -->
  <!--           v-tooltip.top="{ value: getType(p.data.type).name, showDelay: 300, hideDelay: 0 }" alt="icon" -->
  <!--           class="w-16 h-16" /> -->
  <!--         <!-- <MyTableType :icon="p.data.icon" :type="p.data.type" /> --> -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="title" header="Titre"> -->
  <!--       <template #body="p"> -->
  <!--         <BibViewActivity :data="p.data" /> -->
  <!--         <!-- <a :href="playerUrl(p.data.nid)" class="font-bold">{{ p.data.title }}</a> --> -->
  <!--         <!-- <BibComments :data="p.data" /> --> -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="abstract" header="Description"> -->
  <!--       <template #body="p"> -->
  <!--         {{ decodeHtml(p.data.abstract) }} -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="abstract" header="Niveau(x)"> -->
  <!--       <template #body="p"> -->
  <!--         {{ p.data.niveau }} -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="abstract" header="Enseignement(s)"> -->
  <!--       <template #body="p"> -->
  <!--         {{ p.data.enseignement }} -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="nb_clone" header="nb clone" sortable> -->
  <!--       <template #body="p"> -->
  <!--         {{ p.data.nb_clone }} -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable> -->
  <!--       <template #body="p"> -->
  <!--         <MyTableChanged :data="p.data" /> -->
  <!--       </template> -->
  <!--     </Column> -->

  <!--     <Column field="auteur" header="Auteur"> -->
  <!--       <template #body="p"> -->
  <!--         {{ p.data.auteur }} -->
  <!--       </template> -->
  <!--     </Column> -->



  <!--   </DataTable> -->
  <!--   </template> -->
  <!-- </template> -->
  <!-- </template> -->

<style scoped>
.titre {
  font-size: 1.5rem;
  font-weight: bold;
}

.clear {
  padding-top: 1em;
}
</style>
