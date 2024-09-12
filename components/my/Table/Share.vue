<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { formatDateTime } from '~/utils/format';
const props = defineProps({
  data: Object,
  isTeacher: Boolean,
})

const visible = ref(false);
const menu = ref();
const toggle = (event) => { menu.value.toggle(event); };
const activites = useActivitiesStore()

activites.getAllDetails(props.data)

const label = computed(() => labelGetter(props.data))
const items = computed(() => itemsGetter(props.data))
const wfStatus = computed(() => wfStatusGetter(props.data))

const itemsGetter = ((obj) => {
  const url = window.location.origin + `/web/c/${obj.code}`
  return [
    {
      label: 'Copier le code partage avec la classe',
      icon: 'pi pi-copy',
      command: () => {
        navigator.clipboard.writeText(obj.code);
        toast.add({ severity: 'info', summary: 'Code copié', detail: 'Le code de partage a été copié dans le presse-papier.', life: 2000 });
      }
    },
    {
      label: 'Copier l\'URL de partage avec la classe',
      icon: 'pi pi-link',
      command: () => {
        navigator.clipboard.writeText(url);
        toast.add({ severity: 'info', summary: 'URL copiée', detail: 'L\'URL de partage a été copiée dans le presse-papier.', life: 2000 });
      }
    },
    {
      label: 'Afficher le QR Code de partage',
      icon: 'pi pi-qrcode',
      command: () => {
        visible.value = true;
      }
    }
  ]
})

const labelGetter = ((obj) => {
  const b = obj.tr_beg
  const e = obj.tr_end
  const strPeriode = `Libre pour les élèves du ${formatDateTime(b)} au ${formatDateTime(e)}`
  const strC = " et en lecture seule en dehors"
  const strL = " et non accessible en dehors"

  switch (obj.mode) {
    case 'N_O':
      return {
        code: obj.code,
        severity: "success"
      }
    case 'N_X':
      return {
        code: obj.code,
        tooltipText: "Non partagé avec la classe",
        mainIcon: 'pi pi-lock',
        color: "red",
        severity: "danger"
      }
    case 'C_O':
      return {
        code: obj.code,
        tooltipText: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "green",
        severity: "success"
      }
    case 'C_X':
      return {
        code: obj.code,
        tooltipText: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "orange",
        severity: "danger"
      }
    case 'L_O':
      return {
        code: obj.code,
        tooltipText: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "green",
        severity: "success"
      }
    case 'L_X':
      return {
        code: obj.code,
        tooltipText: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "red",
        severity: "danger"
      }
    default:
      return {
        code: "Pas encore là"
      }
  }
})

const wfStatusGetter = ((obj) => {
  if (obj.wf == '100' && obj.mode.includes('X')) {
    return {
      label: 'Verrouillé',
      icon: 'pi pi-lock',
      color: "red"
    }
  }

  switch (obj.wf) {
    case '0':
      return {
        label: 'Modifiable',
        icon: 'pi pi-pencil',
        color: "blue"
      }
    case '100':
      return {
        label: 'En cours',
        icon: 'pi pi-pencil',
        color: "blue"
      }
    case '200':
      return {
        label: 'Rendu',
        icon: 'pi pi-envelope',
        color: "orange"
      }
    case '300':
      return {
        label: 'Corrigé',
        icon: 'pi pi-check-circle',
        color: "green"
      }
    default:
      return {}
  }
})

</script>

<template>
  <div v-if="!props.data.extra">
    <i class="pi pi-spin pi-spinner"></i>
  </div>
  <div v-else>

    <template
      v-if="(props.data.whoami == 'cr' || props.data.whoami == 'as') && isTeacher && label.code != 'student_activity'">
      <div class="flex mystyle" v-tooltip.top="{ value: label.tooltipText, showDelay: 400, hideDelay: 0 }">
        <div :class="label.color" class="flex flex-col justify-center ml-2">
          <i :class="label.mainIcon" style="font-size: 1.2rem"></i>
          <i :class="label.secondaryIcon" style="font-size: 1.2rem"></i>
        </div>
        <Button type="button" :label="label.code" @click="toggle" class="mystyle" :severity="label.severity"
          aria-haspopup="true" aria-controls="overlay_menu" outlined
          :dt="{ 'padding.x': '0.4rem', 'padding.y': '0.2rem' }">
          <template #icon>
            <i class="pi pi-angle-down m-2"></i>
          </template>
        </Button>

        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>

      <Dialog v-model:visible="visible" header="Accès à l'activité" modal
        :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" :style="{ width: '75%' }" dismissableMask>
        <MyTableQrcode :code="props.data.code" :url="url" />
      </Dialog>

      <div v-if="props.data.whoami == 'as'" class="flex justify-content-center">
        Associé par {{ props.data.boss }}
      </div>

    </template>
    <template v-else-if="props.data.whoami == 'cr' && !isTeacher">
      Perso
    </template>
    <template v-else-if="props.data.whoami == 'as' && !isTeacher">
      Associé par {{ props.data.boss }}
    </template>
    <template v-else>
      <div class="flex flex-row gap-2 items-center">
        <div v-if="props.status_clonable">
            <i class="pi pi-lock" style="font-size: 1.3rem; color: red"></i>
        </div>
        <div v-else>
          <i :class="wfStatus.icon + ' ml-2'" :style="'font-size: 1.3rem; color: ' + wfStatus.color"
            v-tooltip.top="{ value: wfStatus.label, showDelay: 400, hideDelay: 0 }"></i>
          <span class="whitespace-nowrap">{{ props.data.whoami == 'as' ? 'Associé par ' : 'Apprenant de ' }}{{
            props.data.boss }}</span>
        </div>
      </div>
    </template>
  </div>
</template>


<style scoped>
.orange {
  color: orange;
}

.red {
  color: red;
}

.green {
  color: #4ade80
}

.mystyle {
  flex-direction: row-reverse;
  font-family: monospace;
  width: 100%;
}
</style>
