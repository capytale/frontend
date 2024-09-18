<script setup>
const my = useMyStore()

const props = defineProps({
  data: Object,
  nid: String,
})
const visible = ref(false);

const close = () => {
  visible.value = false
}

watch(visible, (v, ov) => {
  if (v) {
    drupal.setCloseHandler(close)
  } else {
    if (ov) {
      // Ici les actions à faire lorsque le metaPLayer se referme
      my.getAssignments(props.nid)
      // TODO : ne pas recharger toutes les lignes mais seulement celle du data.sa_nid
    }
    drupal.removeCloseHandler(close)
  }
})

onBeforeUnmount(() => {
  drupal.removeCloseHandler(close)
})

const openInNewTab = () => {
  window.open(props.data.player, '_blank');
}

</script>

<template>
  <div>
    <span @click.exact.stop="visible = true" v-on:click.ctrl.stop="openInNewTab" class="clickable"
      v-tooltip.top="{ value: 'Ctrl+clic pour ouvrir dans un nouvel onglet', showDelay: 300, hideDelay: 100 }" aria-controls="overlay_menu" >
    {{ data.fullname }}
    </span>
    <FullIframe v-model="visible" :url="data.player" :position="'top'" />
  </div>
</template>
