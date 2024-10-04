<script setup>
import httpClient from '@capytale/activity.js/backend/capytale/http'

const defaultErrorMessage = "Ce code n'est pas valide."

const value = ref(null);
const invalid = ref(false)
const message = ref(defaultErrorMessage);

let locked = false;

const codeForm = async () => {
  let code = value.value;
  if (code == null) return;
  code = code.trim();
  if (code.length === 0) return;
  if (value.value !== code) {
    value.value = code;
  }
  let alreadyUnlocked = false;
  if (/^[a-f0-9]{4}-[0-9]+$/i.test(code)) {
    if (locked) return;
    locked = true;
    try {
      const url = await httpClient.postGetJsonAsync("/web/c-hdls/api/code-form", { action: "codeForm", code })
      invalid.value = false
      await nextTick()
      window.location.assign(url)
    } catch (e) {
      console.error(e)
      message.value = e.message
      invalid.value = true
      locked = false
      alreadyUnlocked = true
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (!alreadyUnlocked) locked = false
    }
  } else {
    message.value = defaultErrorMessage
    invalid.value = true
  }
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

      <div class="flex flex-col gap-2 ">
        <Message v-if="invalid" severity="error" closable @close="clear">{{ message }}</Message>
        <label for="code" class="text-xs">Code (ex : a1bc-12345678)</label>
        <div class="flex flex-wrap align-items-center gap-2">
          <!-- <FloatLabel> -->
          <!-- <label for="code">Code (ex : a1bc-12345678)</label> -->
          <InputText id="code" v-model="value" :invalid="invalid" @keydown.enter="codeForm" autofocus />
          <!-- </FloatLabel> -->
          <Button type="submit" label="Go !" @click="codeForm" />
        </div>
      </div>
    </template>
  </Card>
</template>
