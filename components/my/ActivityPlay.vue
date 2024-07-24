<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'
const my = useMyStore()
const value = ref(null);
const toast = useToast();
const invalid = ref(false)
const message = ref("Ce code n'est pas valide.");

// pour le backend, voir capytaleUI/codeForm réclamé par un postGetJsonAsync 
// revoyer le playerURl de activityBunch 
// pour faire un window.location.href ici et rediriger vers le player

const codeForm = async () => {
  try {
    const url = await httpClient.postGetJsonAsync("/web/c-hdls/api/code-form", { action: "codeForm", code: value.value })
    console.log("url", url)
    invalid.value = false
    location.href = url
  } catch (e) {
    console.error(e)
    invalid.value = true
  };
}

const clear = () => {
  invalid.value = false
}


</script>


<template>
  <Card class="flex-2">
    <template #title>
      <h2 style="margin:0px">Accéder à une activité</h2>
    </template>
    <template #content>

      <div class="flex flex-col gap-2">
        <Message v-if="invalid" severity="error">{{ message }}</Message>
        <label v-else for="code" class="mt-4">Saisir le code de partage</label>
        <div class="flex flex-wrap align-items-center gap-2">
          <InputText id="code" v-model="value" aria-describedby="code-help" placeholder="a12b-345678" :invalid="invalid"
            @focus="clear" />
          <Button type="submit" label="Go !" @click="codeForm" />
        </div>
      </div>
    </template>
  </Card>
</template>
