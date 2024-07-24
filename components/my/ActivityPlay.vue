<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'
const my = useMyStore()
const value = ref(null);

// pour le backend, voir capytaleUI/codeForm réclamé par un postGetJsonAsync 
// revoyer le playerURl de activityBunch 
// pour faire un window.location.href ici et rediriger vers le player

const codeForm = async () => {
  const url = await httpClient.postGetJsonAsync("/web/c-hdls/api/code-form", { action: "codeForm", code: value.value })
  console.log("url", url)
}
</script>


<template>
  <Card class="flex-2">
    <template #title>
      <h2 style="margin:0px">Accéder à une activité</h2>
    </template>
    <template #content>

      <div class="flex flex-col gap-2">
        <label for="code">Saisir le code de partage</label>
        <div class="flex flex-wrap align-items-center gap-2">
          <InputText id="code" v-model="value" aria-describedby="code-help" placeholder="a12b-345678" />
          <Button type="submit" label="Go !" @click="codeForm" />
        </div>
      </div>
    </template>
  </Card>
</template>
