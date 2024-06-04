<script setup>
import { useMyStore } from '@/stores/my'
const my = useMyStore()
const nid = useRoute().params.id
my.getAssignments(nid)


const wficon = ((wf) => {
    if (wf == 100) return { icon: "pi pi-pencil", color: "blue" }
    if (wf == 200) return { icon: "pi pi-envelope", color: "Orange" }
    if (wf == 300) return { icon: "pi pi-check-square", color: "green" }
})

</script>


<template>
    <div v-if="!my.assignments.data">
        <p>Chargement des actvités...</p>
    </div>
    <template v-else>
        <Card class="flex-2 my-10">
            <template #title>
                <img :src="my.assignments.data.icon" alt="icon" class="w-16 h-16" /> {{ my.assignments.data.title }}
            </template>
        </Card>

        <DataTable :value="my.assignments.data.tab" tableStyle="min-width: 50rem">

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
                    <template v-if="my.assignments.data.is_in_time_range">
                        <i :class="wficon(p.data.workflow).icon" :style="{ color: wficon(p.data.workflow).color }"></i>
                    </template>
                    <template v-else>
                        <i class="pi pi-lock pr-1" style="color: red"></i>
                        <i :class="wficon(p.data.workflow).icon"></i>
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
        <!-- 
-->
    </template>
</template>