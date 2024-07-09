<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useMyStore } from '@/stores/my'
const my = useMyStore()
const nid = useRoute().params.id
my.getAssignments(nid)

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
const products = ref(new Array(8));
</script>


<template>
    <div v-if="my.loadingAssignments">
        <Card class="flex-2 my-10">
            <template #title>
                <Skeleton shape="circle" size="4rem" class="mr-2 my-2"></Skeleton> <Skeleton width="20rem" class="mb-2"></Skeleton>
            </template>
        </Card>
        <DataTable :value="products">
    <Column field="code" header="Code">
        <template #body>
            <Skeleton></Skeleton>
        </template>
    </Column>
    <Column field="name" header="Name">
        <template #body>
            <Skeleton></Skeleton>
        </template>
    </Column>
    <Column field="category" header="Category">
        <template #body>
            <Skeleton></Skeleton>
        </template>
    </Column>
    <Column field="quantity" header="Quantity">
        <template #body>
            <Skeleton></Skeleton>
        </template>
    </Column>
</DataTable>
    </div>
    <template v-else>
        <Card class="flex-2 my-10">
            <template #title>
                <img :src="my.assignments.icon" alt="icon" class="w-16 h-16" /> {{ my.assignments.title }}
            </template>
        </Card>

        <DataTable :value="my.assignments.tab" tableStyle="min-width: 50rem" v-model:selection="selectedNid"
            selectionMode="multiple" @rowSelect="onRowSelect()" @rowUnselect="onRowUnselect()"
            @rowUnselectAll="onRowUnselectAll()" @rowSelectAll="onRowSelectAll()">

            <template #header>
                <Toolbar>
                    <template #start v-if="!showToolbar">
                        <h2 style="margin:0px"> Copies des élèves</h2>
                    </template>
                    <template #start v-else>
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

</style>