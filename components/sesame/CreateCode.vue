<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import sesame from "@capytale/activity.js/backend/capytale/sesame";


const durations = [{
  temps: '1 h',
  value: '1'
}, {
  temps: '2 h',
  value: '2'
}, {
  temps: '6 h',
  value: '6'
}, {
  temps: '1 jour',
  value: '24'
}, {
  temps: '2 jours',
  value: '48',
}, {
  temps: '3 jours',
  value: '72',
}, {
  temps: '5 jours',
  value: '120',
}, {
  temps: '7 jours',
  value: '168'
}]

const count = ref(0);
const authenticated = ref(false);

const getCount = async function () {
  try {
    const mycount = await sesame.countUsers()
    authenticated.value = true;
    count.value = mycount.count;
  } catch {
    authenticated.value = false;
  }
}
getCount();

const state = reactive({
  validity: 2,
  classe: "",
  requireMail: false,
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.classe) errors.push({ path: 'classe', message: 'Obligatoire' })
  return errors
}

async function onSubmit(e: FormSubmitEvent<any>) {
  const validity = e.data.validity
  const classe = e.data.classe
  const requireMail = e.data.requireMail
  //console.log("validity:" + validity + " requireMail:" + requireMail + " classe:" + classe)
  const d = new Date()
  d.setTime(d.getTime() + parseInt(validity) * 3600 * 1000)
  const code = await sesame.createCode({ exp: d, require_mail: requireMail, classe })
  useEvent('createCodeEvent', code);
}
</script>

<template>
  <template v-if="!authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir le formulaire de création de code
      Sésame.
    </div>
  </template>
  <template v-else>

    <div class="card">
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <div class="cols">
          <UFormGroup label="Choisir la durée de validité du code Sésame dans une limite de 7 jours" name="validity">
            <USelect v-model="state.validity" :options="durations" option-attribute="temps" />
          </UFormGroup>

          <UFormGroup label="Indiquer le nom de la classe pour ce nouveau code Sésame" name="classe">
            <UInput v-model="state.classe" />
          </UFormGroup>
        </div>

        <UFormGroup label="">
          <UCheckbox v-model="state.requireMail" label="📧 Obliger les élèves à saisir une adresse email" />
        </UFormGroup>

        <UButton type="submit">
          Créer le code Sésame
        </UButton>
      </UForm>
    </div>
  </template>
</template>

<style>
.cols {
  display: inline-flex;
  gap: 4em;
}
</style>
