<script setup>
const props = defineProps({
  mode: String,
  tr_beg: String,
  tr_end: String,
  required: true
})

const explainMode = computed(() => {
  const b = props.tr_beg
  const e = props.tr_end
  const strPeriode = `Libre pour les élèves du ${b} au ${e}`
  const strC = " et en lecture seule en dehors"
  const strL = " et non accessible en dehors"

  switch (props.mode) {
    case 'N_O':
      return {}
    case 'N_X':
      return {
        title: "Non partagé avec la classe",
        mainIcon: 'pi pi-lock',
        color: "red"
      }
    case 'C_O':
      return {
        title: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "green"
      }
    case 'C_X':
      return {
        title: strPeriode + strC,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-envelope',
        color: "orange"
      }
    case 'L_O':
      return {
        title: strPeriode + strL,
        mainIcon: 'pi pi-clock',
        secondaryIcon: 'pi pi-lock',
        color: "green"
      }
    case 'L_X':
      return {
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
  <span v-if="explainMode.title">
    <span v-tooltip="explainMode.title" type="text" placeholder="Right">
      <span v-if="explainMode.secondaryIcon" :class="explainMode.color">
        <i :class="explainMode.mainIcon"></i>
        <i :class="explainMode.secondaryIcon"></i>
      </span>
      <span v-else :class="explainMode.color">
        <i :class="explainMode.mainIcon"></i>
      </span>
    </span>
  </span>
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
</style>
