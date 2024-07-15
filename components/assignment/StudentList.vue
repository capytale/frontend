<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useMyStore } from '@/stores/my'
const my = useMyStore()

const props = defineProps({
  nid: String,
  views_total: Number,
  required: true
})

my.getAssignments(props.nid)

const selectedNid = ref();
const showToolbar = ref(false);

const onRowSelect = function () {
    showToolbar.value = true
}
const onRowSelectAll = function () {
    showToolbar.value = true
}
const onRowUnselectAll = function () {
    showToolbar.value = false
}
const onRowUnselect = function () {
    showToolbar.value = selectedNid.value.length > 0
}

const handleChangeWf = ((wf) => {
    my.changeSaWf(selectedNid.value, wf)
    const response = {}
    if (response.ok) {
        toast.add({ severity: 'success', summary: 'Suppression effectuée : ', life: 2000 });
    } else {
        toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: "nid = " });
    }
    selectedNid.value = []
    showToolbar.value = false
})

const handleCycleWf = ((sa_nid, wf) => {
    selectedNid.value = []
    showToolbar.value = false
    if (wf == 100) my.changeSaWf(sa_nid, 200)
    if (wf == 200) my.changeSaWf(sa_nid, 300)
    if (wf == 300) my.changeSaWf(sa_nid, 100)
    const response = {}
    if (response.ok) {
        toast.add({ severity: 'success', summary: 'Suppression effectuée : ', life: 2000 });
    } else {
        // toast.add({ severity: 'error', summary: 'Échec de la suppression : ', detail: "nid = " });
    }
    selectedNid.value = []
    showToolbar.value = false
})

const wficon = ((wf) => {
    if (wf == 100) return { icon: "pi pi-pencil", color: "blue" }
    if (wf == 200) return { icon: "pi pi-envelope", color: "Orange" }
    if (wf == 300) return { icon: "pi pi-check-square", color: "green" }
})
const nbFake = ref(new Array(props.views_total));
</script>


<template>
    <div v-if="my.loadingAssignments">
        <Card class="flex-2 my-10">
            <template #title>
                <Skeleton shape="circle" size="4rem" class="mr-2 my-2"></Skeleton> <Skeleton width="20rem" class="mb-2"></Skeleton>
            </template>
        </Card>
        <DataTable :value="nbFake">
    <Column field="code" header="Dernière modif.">
        <template #body>
            <Skeleton width="10rem" ></Skeleton>
        </template>
    </Column>
    <Column field="name" header="Élève">
        <template #body>
            <Skeleton width="10rem" ></Skeleton>
        </template>
    </Column>
    <Column field="category" header="Classe">
        <template #body>
            <Skeleton width="7rem" ></Skeleton>
        </template>
    </Column>
    <Column field="quantity" header="Mode">
        <template #body>
            <Skeleton width="4rem" ></Skeleton>
        </template>
    </Column>
    <Column field="quantity" header="Appréciation">
        <template #body>
            <Skeleton width="10rem" height="4rem"></Skeleton>
        </template>
    </Column>
    <Column field="quantity" header="Évaluation">
        <template #body>
            <Skeleton width="10rem" height="4rem"></Skeleton>
        </template>
    </Column>
</DataTable>
    </div>
    <template v-else>
        <!-- <Card class="flex-2 my-10">
            <template #title> -->
                <div class="myflex my-10">
                    <span><img :src="my.assignments.icon" alt="icon" class="w-16 h-16" /> </span>
                    <span class="activity-title">{{ my.assignments.title }}</span>

                </div>
            <!-- </template>
        </Card> -->

        <DataTable :value="my.assignments.tab" tableStyle="min-width: 50rem" v-model:selection="selectedNid"
            selectionMode="multiple" @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()"
            @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()">

            <template #header>
                <Toolbar>
                    <!-- <template #start v-if="!showToolbar">
                        <h2 style="margin:0px"> </h2>
                    </template> -->
                    <template #start v-if="showToolbar">
                        <Button v-tooltip.bottom="'En cours'" @click="handleChangeWf(100)" icon="pi pi-pencil"
                            class="mr-2 blue" />
                        <Button v-tooltip.bottom="'Rendu'" @click="handleChangeWf(200)" icon="pi pi-envelope"
                            class="mr-2 orange" />
                        <Button v-tooltip.bottom="'Corrigé'" @click="handleChangeWf(300)" icon="pi pi-check-square"
                            class="mr-2 green" />

                        <Button v-tooltip.bottom="'Télécharger'" icon="pi pi-download" class="mr-2"
                            severity="secondary" />
                        <Button v-tooltip.bottom="'CSV'" icon="pi pi-file-excel" class="mr-2" severity="secondary" />
                    </template>

                </Toolbar>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="changed" header="Dernière modif." style="max-width:10rem" sortable>
                <template #body="p">
                    <MyTableChanged :changed="p.data.changed" />
                </template>
            </Column>

            <Column field="nom" header="Élève" style="max-width:10rem" sortable>
                <template #body="p">
                    <AssignmentStudent :data="p.data" />
                </template>
            </Column>

            <Column field="classe" header="Classe" sortable></Column>

            <Column field="workflow" header="Mode" style="max-width:10rem" sortable>
                <template #body="p">
                    <template v-if="my.assignments.is_in_time_range">
                        <Button @click="handleCycleWf(p.data.sa_nid, p.data.workflow)" text>
                            <i :class="wficon(p.data.workflow).icon"
                                :style="{ color: wficon(p.data.workflow).color, 'font-size': '1.5rem' }"></i>
                        </Button>
                    </template>
                    <template v-else>
                        <Button @click="handleCycleWf(p.data.sa_nid, p.data.workflow)" text>
                            <i class="pi pi-lock pr-1" style="color: red; font-size: 1.5rem;"></i>
                            <i :class="wficon(p.data.workflow).icon + ' text-gray-400'" :style="{ 'font-size': '1.5rem' }"
                            @click="handleCycleWf(p.data.sa_nid, p.data.workflow)"></i>
                        </Button>
                    </template>
                </template>
            </Column>

            <Column field="appr" header="Appréciation">
                <template #body="p">
                    <AssignmentAppreciation :data="p.data" />
                </template>
            </Column>

            <Column field="eval" header="Évaluation">
                <template #body="p">
                    <AssignmentEvaluation :data="p.data" />
                </template>
            </Column>

        </DataTable>
    </template>
</template>

<style scoped>
.blue {
    background-color: blue;
}

.orange {
    background-color: orange;
}

.green {
    background-color: green;
}
.myflex {
    display: flex;
    align-items: center;
    gap: 1em;
}
.activity-title {
    font-size: 2rem;
    font-weight: bold;
}
</style>
