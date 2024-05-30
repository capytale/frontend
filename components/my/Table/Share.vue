<script setup>
const props = defineProps({
  code: String,
  mode: String,
  tr_beg: String,
  tr_end: String,
  required: true
})

const visible = ref(false);
const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};
const url = `https://np.ac-capytale.fr/web/c/${props.code}`
const items = computed(() =>
  [
    {
      label: 'Copier le code partage avec la classe',
      icon: 'pi pi-copy',
      command: () => {
        navigator.clipboard.writeText(props.code);
        toast.add({ severity: 'success', summary: 'Copié !', detail: props.code, life: 2000 });
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
      label: 'Afficher le QRCode de partage',
      icon: 'pi pi-qrcode',
      command: () => {
        visible.value = true;
      }
    }
  ])

const label = computed(() => {
  const b = props.tr_beg
  const e = props.tr_end
  const strPeriode = `Libre pour les élèves du ${b} au ${e}`
  const strC = " et en lecture seule en dehors"
  const strL = " et non accessible en dehors"

  switch (props.mode) {
    case 'N_O':
      return {
        code: props.code,
      }
    case 'N_X':
      return {
        code: props.code,
        title: "Non partagé avec la classe",
        mainIcon: 'pi pi-lock',
        color: "red"
      }
    case 'C_O':
      return {
        code: props.code,
        title: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "green"
      }
    case 'C_X':
      return {
        code: props.code,
        title: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "orange"
      }
    case 'L_O':
      return {
        code: props.code,
        title: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "green"
      }
    case 'L_X':
      return {
        code: props.code,
        title: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "red"
      }
    default:
      return {}
  }
})

</script>

<template>
  <div class="card flex justify-content-center mystyle">
    <Button type="button" :label="label.code" @click="toggle" class="mystyle p-3" severity="primary"
      aria-haspopup="true" aria-controls="overlay_menu" outlined>
      <template #icon>
        <i class="pi pi-angle-down m-2"></i>
        <div :class="label.color">
          <i :class="label.mainIcon + ' ml-2'" ></i>
          <i :class="label.secondaryIcon + ' mr-2'"></i>
        </div>
        </template> 
    </Button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>


  <Dialog v-model:visible="visible" header="Accès à l'activité" modal
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }" :style="{ width: '75%' }">
    <MyTableQrcode :code="code" :url="url" />
  </Dialog>
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
  width: 17rem
}
</style>