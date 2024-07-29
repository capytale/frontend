<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { formatDateTime } from '~/utils/format';
const props = defineProps({
  data: Object,
})

const activites = useActivitiesStore()
await activites.getAllDetails(props.data.nid)

const current = computed (() => {
  const obj = activites.activities.data.find(o => o.nid === props.data.nid)
  return obj
})

const visible = ref(false);
const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};
const url = `https://np.ac-capytale.fr/web/c/${current.code}`
const items = computed(() =>
  [
    {
      label: 'Copier le code partage avec la classe',
      icon: 'pi pi-copy',
      command: () => {
        navigator.clipboard.writeText(my.code);
        toast.add({ severity: 'success', summary: 'Copié !', detail: current.code, life: 2000 });
      }
    },
    {
      label: 'Copier l\'URL de partage avec la classe',
      icon: 'pi pi-link',
      command: () => {
        navigator.clipboard.writeText(url);
        toast.add({ severity: 'success', summary: 'Copié !', detail: url, life: 3000 });
      }
    },
    {
      label: 'Afficher le QR Code de partage',
      icon: 'pi pi-qrcode',
      command: () => {
        visible.value = true;
      }
    }
  ])

const label = computed(() => {
  const b = props.tr_beg
  const e = props.tr_end
  const strPeriode = `Libre pour les élèves du ${formatDateTime(b)} au ${formatDateTime(e)}`
  const strC = " et en lecture seule en dehors"
  const strL = " et non accessible en dehors"

  switch (props.mode) {
    case 'N_O':
      return {
        code: props.code,
        severity: "success"
      }
    case 'N_X':
      return {
        code: props.code,
        tooltipText: "Non partagé avec la classe",
        mainIcon: 'pi pi-lock',
        color: "red",
        severity: "danger"
      }
    case 'C_O':
      return {
        code: props.code,
        tooltipText: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "green",
        severity: "success"
      }
    case 'C_X':
      return {
        code: props.code,
        tooltipText: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "orange",
        severity: "danger"
      }
    case 'L_O':
      return {
        code: props.code,
        tooltipText: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "green",
        severity: "success"
      }
    case 'L_X':
      return {
        code: props.code,
        tooltipText: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "red",
        severity: "danger"
      }
    default:
      return {}
  }
})

const wfStatus = computed(() => {
  if (props.wf == '100' && props.mode.includes('X')) {
    return {
      label: 'Verrouillé',
      icon: 'pi pi-lock',
      color: "red"
    }
  }

  switch (props.wf) {
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
  <div v-if="current.code">
    +{{ current.code }}+
  </div>
  <div v-else>
    -+{{ current.code }}+-
  </div>

  <!-- <template v-if="(whoami == 'cr' || whoami == 'as') && isTeacher"> -->
  <!--   <div class="card flex justify-content-center mystyle" -->
  <!--     v-tooltip.top="{ value: label.tooltipText, showDelay: 400, hideDelay: 0 }"> -->
  <!--     <Button type="button" :label="label.code" @click="toggle" class="mystyle p-3" :severity="label.severity" -->
  <!--       aria-haspopup="true" aria-controls="overlay_menu" outlined> -->
  <!--       <template #icon> -->
  <!--         <i class="pi pi-angle-down m-2"></i> -->
  <!--         <div :class="label.color"> -->
  <!--           <i :class="label.mainIcon + ' ml-2'" style="font-size: 1.2rem"></i> -->
  <!--           <i :class="label.secondaryIcon + ' mr-2'" style="font-size: 1.2rem"></i> -->
  <!--         </div> -->
  <!--       </template> -->
  <!--     </Button> -->
  <!--     <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
  <!--   </div> -->

  <!--   <Dialog v-model:visible="visible" header="Accès à l'activité" modal -->
  <!--     :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" :style="{ width: '75%' }"> -->
  <!--     <MyTableQrcode :code="code" :url="url" /> -->
  <!--   </Dialog> -->

  <!--   <div v-if="whoami == 'as'" class="flex justify-content-center"> -->
  <!--   Associé par {{ boss }} -->
  <!--   </div> -->

  <!-- </template> -->
  <!-- <template v-else-if="whoami == 'cr' && !isTeacher"> -->
  <!--    Perso -->
  <!-- </template> -->
  <!-- <template v-else-if="whoami == 'as' && !isTeacher"> -->
  <!--   Associé par {{ boss }} -->
  <!-- </template> -->
  <!-- <template v-else> -->
  <!--   <i :class="wfStatus.icon + ' ml-2'" :style="'font-size: 1.3rem; color: ' + wfStatus.color" -->
  <!--     v-tooltip.top="{ value: wfStatus.label, showDelay: 400, hideDelay: 0 }"></i> -->
  <!--   {{ whoami == 'as' ? 'Associé par ' : 'Apprenant de ' }}{{ boss }} -->
  <!-- </template> -->
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
  width: 19rem
}
</style>
