<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'
const value = ref(null);
const invalid = ref(false)
const message = ref("Ce code n'est pas valide.");

const codeForm = async () => {
  if (/^[a-f0-9]{4}-[0-9]+$/i.test(value.value)) {
    try {
      const url = await httpClient.postGetJsonAsync("/web/c-hdls/api/code-form", { action: "codeForm", code: value.value })
      console.log("url", url)
      invalid.value = false
      location.href = url
    } catch (e) {
      console.error(e)
      message.value = e.message
      invalid.value = true
    };
  }
  invalid.value = true
  return
}

const clear = () => {
  invalid.value = false
}


</script>


<template>
  <Card class="flex-2">
    <template #title>
      <h2 style="margin:0px" class="text-3xl font-bold">Accéder à une activité</h2>
    </template>
    <template #content>

      <div class="flex flex-col gap-2">
        <Message v-if="invalid" severity="error" closable @close="clear">{{ message }}</Message>
        <label v-else for="code" class="mt-6">Saisir le code</label>
        <div class="flex flex-wrap align-items-center gap-2">
          <InputText id="code" v-model="value" aria-describedby="code-help" placeholder="a12b-345678" :invalid="invalid"
            @focus="clear" />
          <Button type="submit" label="Go !" @click="codeForm" />
        </div>
      </div>
    </template>
  </Card>
</template>
