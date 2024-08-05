<script setup>
import Dialog from 'primevue/dialog'
import { PrimeIcons as PI } from '@primevue/core/api'
import { ref } from "vue";

const visible = ref(false);
const props = defineProps({
  data: Object,
})

const shareClass = ref()

const activites = useActivitiesStore()
const curr = computed(() => {
  const obj = activites.activities.data.find(o => o.nid === props.data.nid)
  if (!obj.code) {
    activites.getAllDetails(props.data.nid).then(obj => {
      return obj
    })
  }
  shareClass.value = shareClassGetter(obj)
  return obj
})

const shareClassGetter = ((obj) => {
  return obj.status_shared == "0" ? " unshared " : " shared "
})

</script>

<template>
  <div v-if="!curr.code">
    <i class="pi pi-spin pi-spinner"></i>
  </div>
  <div v-else>
    <div v-if="curr.whoami != 'ap'">
      <button @click="visible = true">
        <i v-if="curr.status_shared == '1' && curr.status_web == '1'" :class="PI.GLOBE + shareClass + ' globe'" />
        <i v-else-if="curr.status_shared == '1' && curr.status_web == '0'" :class="PI.CLONE + shareClass + ' globe'" />
        <i :class="PI.SHARE_ALT + shareClass" />
      </button>
    </div>


    <Dialog v-model:visible="visible" :header="props.title" modal :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }"
      :style="{ width: '75%' }">
      <MyTableBibForm :nid="curr.nid" @closeBibForm="visible = false" />
    </Dialog>
  </div>
</template>

<style>
.shared {
  color: green;
  font-weight: bold;
  font-size: 1.3rem
}

.p-dialog .p-dialog-header {
  background: var(--gray-200);
}

.unshared {
  color: var(--p-surface400);
}


.p-dialog-content {
  background: var(--gray-100);
}

.globe {
  /* font-size: 0.5em; */
  position: relative;
  bottom: 0.9em;
  left: 0.5em;
}
</style>
