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
  focus.value = true
}

</script>


<template>
  <Card class="flex-2">
    <template #title>
      <h2 style="margin:0px">Accéder à une activité</h2>
    </template>
    <template #content>

      <div class="flex flex-col gap-2 mt-4">
        <Message v-if="invalid" severity="error" closable @close="clear">{{ message }}</Message>
        <div class="flex flex-wrap align-items-center gap-2">
          <FloatLabel>
          <InputText id="code" v-model="value" aria-describedby="code-help" :invalid="invalid" />
            <label for="username">Code (ex : xxxx-123456)</label>
          </FloatLabel>
          <Button type="submit" label="Go !" @click="codeForm" />
        </div>
      </div>
    </template>
  </Card>
</template>
