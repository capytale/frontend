<script setup>
import Dialog from 'primevue/dialog'
import { PrimeIcons as PI } from '@primevue/core/api'
import { ref } from "vue";

const visible = ref(false);
const props = defineProps({
  data: Object,
})

const activites = useActivitiesStore()
activites.getAllDetails(props.data)

const shareClass = computed(() => shareClassGetter(props.data))

const shareClassGetter = ((obj) => {
  return obj.status_shared == "0" ? " unshared " : " shared "
})

</script>

<template>
  <div v-if="!props.data.extra">
    <i class="pi pi-spin pi-spinner"></i>
  </div>
  <div v-else class="bib">
    <div v-if="props.data.whoami != 'ap'">
      <button @click="visible = true">
        <div v-if="props.data.status_shared == '1' && props.data.status_web == '1'"
            v-tooltip.top="{ value: 'Partagé avec tous. Cliquez pour paramétrer', showDelay: 300, hideDelay: 100 }" >
          <i :class="PI.GLOBE + shareClass + ' globe'" />
          <i :class="PI.SHARE_ALT + shareClass" />
        </div>
        <div v-else-if="props.data.status_shared == '1' && props.data.status_web == '0'"
            v-tooltip.top="{ value: 'Partagé entre enseignants. Cliquez pour paramétrer', showDelay: 300, hideDelay: 100 }" >
          <i :class="PI.CLONE + shareClass + ' globe'" />
          <i :class="PI.SHARE_ALT + shareClass" />
        </div>
        <div v-else>
          <i :class="PI.SHARE_ALT + shareClass"
            v-tooltip.top="{ value: 'Cliquez pour partager', showDelay: 300, hideDelay: 100 }" />
        </div>
      </button>
    </div>


    <Dialog v-model:visible="visible" :header="props.title" modal :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }"
      :style="{ width: '75%' }">
      <MyTableBibForm :nid="props.data.nid" @closeBibForm="visible = false" />
    </Dialog>
  </div>
</template>

<style scoped>
.shared {
  color: green;
  font-weight: bold;
  font-size: 1.3rem
}

.unshared {
  color: var(--p-surface400);
}

.globe {
  /* font-size: 0.5em; */
  position: relative;
  bottom: 0.9em;
  left: 0.5em;
}

.bib {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .p-dialog .p-dialog-header { */
/*   background: var(--gray-200); */
/* } */
/* .p-dialog-content { */
/*   background: var(--gray-100); */
/* } */
</style>
