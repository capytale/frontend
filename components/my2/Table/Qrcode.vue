<script setup>
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  code: String,
  url: String,
})

</script>

<template>
  <div class="flex-container">
    <div class="flex-child magenta">

      <div class="bigtext">
        {{ code }}
      </div>
    </div>
    <div class="flex-child green">

      <QrcodeVue :value="url" level="M" render-as="svg" class="qrcode" />
    </div>
  </div>
</template>

<style scoped>
.qrcode {
  width: 400px;
  height: 400px;
}

.bigtext {
  font-size: 4em;
  font-weight: bold;
}
.flex-container {
    display: flex;
  	align-items: center;
  margin-top: 1.5em;
}

.flex-child {
    flex: 1;
}  

.flex-child:first-child {
    margin-right: 20px;
}
</style>
