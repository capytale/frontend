<script setup>
import { useMyStore } from '@/stores/my'
import { useBibStore } from '@/stores/bib'
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
import Tag from 'primevue/tag';
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
const typeIcon = (id) => {
  const obj = my.types.find(o => o.id === id)
  return obj ? obj.icon.path : ''
}

const decodeHtml = ((html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  abstract: { value: null, matchMode: FilterMatchMode.CONTAINS },
  auteur: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const playerUrl = function (nid) {
  return `/web/c-act/n/${nid}/play/view`
}
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
      <div class="card">
        <DataTable :value="products" paginator :rows="20" v-model:filters="filters" sortField="changed" :sortOrder="-1"
          :globalFilterFields="['title', 'abstract', 'auteur']" :rowsPerPageOptions="[10, 20, 50]"
          tableStyle="min-width: 50rem">

          <template #header>
            <Toolbar>
              <template #end>

                <div class="flex justify-content-end">
                  <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id"
                    placeholder="Filter par type" class="w-full md:w-14rem" showClear>
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex align-items-center">
                        <img :src="getType(slotProps.value).icon.path" class="w-8 mr-3" />
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
                      v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 300, hideDelay: 0 }" />
                  </IconField>
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
              <Skeleton width="30rem" class="mb-2"></Skeleton>
            </template>
          </Column>
          <Column field="abstract" header="Description">
            <template #body>
              <Skeleton width="70rem" height="4rem"></Skeleton>
            </template>
          </Column>
          <Column field="nid" header="">
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
      </div>
    </template>
    <template v-else>
      <DataTable :value="bib.bib.data" paginator :rows="20" v-model:filters="filters" sortField="changed" :sortOrder="-1"
        :globalFilterFields="['title', 'abstract', 'auteur']" :rowsPerPageOptions="[10, 20, 50]"
        tableStyle="min-width: 50rem">

        <template #header>
          <Toolbar>
            <template #end>

              <div class="flex justify-content-end">
                <Select v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id"
                  placeholder="Filter par type" class="w-full md:w-14rem" showClear>
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <img :src="getType(slotProps.value).icon.path" class="w-8 mr-3" />
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
                    v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 300, hideDelay: 0 }" />
                </IconField>
              </div>
            </template>

          </Toolbar>
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
            <!-- <a :href="playerUrl(p.data.nid)" class="font-bold">{{ p.data.title }}</a> -->
            <!-- <BibComments :data="p.data" /> -->

          </template>
        </Column>

        <Column field="abstract" header="Description">
          <template #body="p">
            {{ decodeHtml(p.data.abstract) }}
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
        </Column>



      </DataTable>
    </template>
  </template>
</template>
