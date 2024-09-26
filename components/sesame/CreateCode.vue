<script setup lang="ts">
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";

const props = defineProps({
  codelist: Object,
  authenticated: Boolean,
})

import { useToast } from "primevue/usetoast";
const toast = useToast();

const durations = ref([
  { label: '1 h', value: '1' },
  { label: '2 h', value: '2' },
  { label: '6 h', value: '6' },
  { label: '1 jour', value: '24' },
  { label: '2 jours', value: '48' },
  { label: '3 jours', value: '72' },
  { label: '5 jours', value: '120' },
  { label: '7 jours', value: '168' }
])

const validity = ref(2)
const classe = ref("")
const noClasse = ref(false);
const requireMail = ref(false);

async function handleSubmit() {
  // console.log("validity:" + validity.value + " requireMail:" + requireMail.value + " classe:" + classe.value)
  const d = new Date()
  d.setTime(d.getTime() + parseInt(validity.value) * 3600 * 1000)
  if (classe.value === "") {
    noClasse.value = true;
    toast.add({ severity: 'warn', summary: 'Nom de classe obligatoire' });
    return;
  }
  try {
    const ret = await sesameApi.createCode({ exp: d, require_mail: requireMail.value, classe: classe.value })
    toast.add({ severity: 'success', summary: 'Réussi', life: 4000, detail: `Code : "${ret.code}"` });
    ret.code = ret.code.slice(0, 3) + " " + ret.code.slice(3, 6) + " " + ret.code.slice(6, 9),
      ret.count = ret.max_count - ret.count + "/" + ret.max_count;
    ret.exp = ret.exp.toLocaleString('fr-FR')
    ret.require_mail = ret.require_mail ? '📧' : ''
    props.codelist.push(ret);
    //   isEmpty.value = (codelist.length == 0) ? true : false;
    //   const element = document.getElementById("anchor");
    //   element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

  }
  catch (e) {
    toast.add({ severity: 'error', summary: 'Échec', detail: `${e}` });
  }
}

const emit = defineEmits(['closeSesameForm'])

</script>

<template>
  <template v-if="!props.authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir le formulaire de création de code
      Sésame.
    </div>
  </template>
  <template v-else>

    <Card class="my-4">
      <template #content>
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-2">
            <label for="validity">Choisir la durée de validité du code Sésame</label>
            <Select id="validity" v-model="validity" :options="durations" optionLabel="label" optionValue="value"
              placeholder="Durée" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="classe">Indiquer le nom de la classe pour ce nouveau code Sésame *</label>
            <InputText id="classe" v-model="classe" :invalid="noClasse" />
          </div>
          <div class="flex flex-row gap-10 my-4">
            <div class="card flex justify-center">
              <Checkbox inputId="requireMail" v-model="requireMail" :binary="true" />
              <label for="requireMail" class="ml-2"> 📧 Obliger les élèves à saisir une adresse email </label>
            </div>
          </div>
          <div class="flex flex-row gap-10 my-4">
            <Button label="Créer le code Sésame" @click="() => { handleSubmit(); $emit('closeSesameForm') }" />
            <Button type="button" label="Annuler" severity="secondary" @click="$emit('closeSesameForm')"></Button>
          </div>
        </div>
      </template>
    </Card>
    <span id="anchor"></span>

    <p>
      <strong>Remarques importantes</strong>
    </p>
    <Message severity="warn" icon="pi pi-exclamation-triangle">Les élèves qui disposent déjà d'un compte ne
      devraient
      pas en créer un second.
    </Message>

    <ul>
      <li>Un compte élève créé à partir d'un code Sésame permet d'utiliser pleinement
        tous les services de Capytale, en lien avec tout enseignant.
      </li>
      <li>Si l'élève saisit un courriel, ce sera son identifiant.
        En cas d'oubli de son mot de passe, il devra passer par la procédure de récupération par courriel.</li>
      <li>S'il ne saisit pas pas de courriel, un identifiant sera généré.
        En cas d'oubli de son mot de passe, vous pourrez le réinitialiser.</li>
      <li>Les élèves à qui vous donnez un code ont plus de 15 ans ou créent leur compte avec le consentement d'un
        parent.
      </li>
    </ul>

  </template>
</template>

<style scoped>
ul {
  list-style: disc;
  margin: 1em;
}
</style>
