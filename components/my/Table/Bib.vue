<script setup lang="ts">
import { PrimeIcons as PI } from '@primevue/core/api'

const p = defineProps<{
  data: {
    status_shared: string;
    status_web: string;
    whoami: string;
    extra: boolean;
  }
}>()

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}

const activites = useActivitiesStore()
activites.getAllDetails(p.data)

const shared = computed(() => {
  return p.data.status_shared == '1';
})

const toolTip = computed(() => {
  if (p.data.status_shared == '1') {
    if (p.data.status_web == '1') {
      return 'Partagé avec tous. Cliquez pour paramétrer'
    } else {
      return 'Partagé entre enseignants. Cliquez pour paramétrer'
    }
  } else {
    return 'Cliquez pour partager'
  }
});

const sharedIconClass = computed(() => {
  if (p.data.status_shared == '1') {
    if (p.data.status_web == '1') {
      return PI.GLOBE
    } else {
      return PI.CLONE
    }
  }
})
</script>

<template>
  <div v-if="!p.data.extra">
    <i class="pi pi-spin pi-spinner"></i>
  </div>
  <div v-else class="bib">
    <div v-if="p.data.whoami != 'ap'">
      <button @click.stop="handleClick">
        <div v-tooltip.top="{ value: toolTip, showDelay: 300, hideDelay: 100 }" :class="{ shared: shared }">
          <i v-if="sharedIconClass" :class="sharedIconClass" class="globe" />
          <i :class="PI.SHARE_ALT" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.shared i {
  color: green;
  font-weight: bold;
  font-size: 1.0rem
}

i {
  color: var(--p-surface400);
}

.globe {
  position: relative;
  bottom: 0.9em;
  left: 0.5em;
}

.bib {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
