<script setup>
import { useMyStore } from '@/stores/my'
import { FilterMatchMode } from 'primevue/api';
import { useRoute } from 'vue-router';
import Tag from 'primevue/tag';

const my = useMyStore()


const route = useRoute()
console.log("location", route.query)
// TODO: faire en sorte que les recherces avancées génèrent une url copiable.


my.getBib()
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

const sevLevel = ((lvl) => {
  if (lvl < 10) return "primary"
  if (lvl < 100) return "warning"
  if (lvl >= 100) return "danger"
})

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
</script>

<template>
  <div v-if="my.bib.pending">
    <p>Chargement des actvités...</p>
  </div>
  <div v-else-if="my.bib.status == 'error'">
    <p>Impossible de charger les activités.</p>
  </div>
  <template v-else>
    <h1>Bibliothèque</h1>

    <DataTable :value="my.bib.data" paginator :rows="20" v-model:filters="filters" sortField="changed" :sortOrder="-1"
      :globalFilterFields="['title', 'abstract']" :rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 50rem">



      <template #header>
        <Toolbar>
          <template #end>

            <div class="flex justify-content-end">
              <Dropdown v-model="filters['type'].value" :options="my.types" filter optionLabel="name" optionValue="id"
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
              </Dropdown>


              <IconField iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['title', 'abstract', 'auteur'].value"
                  placeholder="Rechercher" v-tooltip.top="{ value: 'Recherche dans titre, description et auteur', showDelay: 300, hideDelay: 0 }"/>
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
          <a :href="p.data.player_url">{{ p.data.title }}</a>
        </template>
      </Column>

      <Column field="abstract" header="Description">
        <template #body="p">
          {{ decodeHtml(p.data.abstract) }}
        </template>

      </Column>


      <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
        <template #body="p">
          <MyTableChanged :changed="p.data.changed" />
        </template>
      </Column>

      <Column field="nb_clone" header="nb clone" sortable>
        <template #body="p">
          <div v-if="p.data.nb_clone">
            <Tag :value="p.data.nb_clone" :severity="sevLevel(p.data.nb_clone)"/>
          </div>
          <div v-else>
            <Tag value="0" severity="secondary"/>
          </div>
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
