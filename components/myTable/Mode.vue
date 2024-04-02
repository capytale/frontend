<script setup>
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

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
  const strC = "et en lecture seule en dehors"
  const strL = "et non accessible en dehors"

  switch (props.mode) {
    case 'N_O':
      return {}
    case 'N_X':
      return {
        title: "Non partagé avec la classe",
        mainIcon: "fa-solid fa-lock",
        color: "red"
      }
    case 'C_O':
      return {
        title: strPeriode + strC,
        mainIcon: 'fa-solid fa-clock',
        secondaryIcon: 'fa-solid fa-envelope',
        color: "green"
      }
    case 'C_X':
      return {
        title: strPeriode + strC,
        mainIcon: 'fa-solid fa-clock orange',
        secondaryIcon: 'fa-solid fa-envelope orange',
        color: "orange"
      }
    case 'L_O':
      return {
        title: strPeriode + strL,
        mainIcon: 'fa-solid fa-clock',
        secondaryIcon: 'fa-solid fa-lock',
        color: "green"
      }
    case 'L_X':
      return {
        title: strPeriode + strL,
        mainIcon: 'fa-solid fa-clock',
        secondaryIcon: 'fa-solid fa-lock red',
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
        <font-awesome-layers class="">
          <font-awesome-icon :icon="explainMode.mainIcon" />
          <font-awesome-icon :icon="explainMode.secondaryIcon" transform="shrink-4 down-4.2 right-10"/>
        </font-awesome-layers>
      </span>
      <span v-else :class="explainMode.color">
        <font-awesome-icon :icon="explainMode.mainIcon" />
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
