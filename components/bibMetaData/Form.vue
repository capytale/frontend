<script setup lang="ts">
import Enseignements from './Enseignements.vue'
import Niveaux from './Niveaux.vue'
import Modules from './Modules.vue'
import Themes from './Themes.vue'
import { useBibList } from '@/composables/bib/list';

const activites = useActivitiesStore()
const bib = useBibList(true)
const toast = useToast();

const model = defineModel<
  { nid: number, title: string } | undefined
>()

const visible = ref(false);

/**
 * Si l'utilisateur a soumis le formulaire ou si le partage était déjà activé,
 * on affiche les champs invalides
 */
const showErrors = ref(false);

type FormData = {
  present: boolean;
  status_shared: boolean;
  status_web: boolean;
  abstract: string;
  enseignements: string[];
  niveaux: string[];
  modules: number[];
  themes: number[];
}

const formData = ref<FormData>({
  present: false,
  status_shared: false,
  status_web: false,
  abstract: '',
  enseignements: [],
  niveaux: [],
  modules: [],
  themes: [],
});


// le formulaire est visible dès qu'une activité est sélectionnée via le model
watchImmediate(model, (m) => {
  visible.value = m != null;
})

// Dès que le formulaire est visible, on récupère les métadonnées de l'activité
watchImmediate(visible, (v) => {
  if (v) {
    formData.value.present = false;
    activites.getMetadata(model.value!.nid).then(
      (v) => {
        formData.value.status_shared = v!.status_shared;
        formData.value.status_web = v!.status_web;
        formData.value.abstract = v!.abstract ?? '';
        formData.value.enseignements = v!.enseignements;
        formData.value.niveaux = v!.niveaux;
        formData.value.modules = v!.modules;
        formData.value.themes = v!.themes;
        formData.value.present = true;
        if (v!.status_shared) showErrors.value = true;
      },
      (e) => {
        showErrors.value = false;
        formData.value.present = false;
        console.error(e);
      }
    );
  } else {
    showErrors.value = false;
    model.value = undefined;
    formData.value.present = false;
  }
});

function computedCheck(test: (data: FormData) => boolean) {
  return computed(() => {
    if (formData.value == null) return false;
    if (!(formData.value.status_shared || formData.value.status_web)) return false;
    return test(formData.value);
  });
}

const resumeInvalid = computedCheck((data) => data.abstract.length < 50);
const enseignementsInvalid = computedCheck((data) => data.enseignements.length == 0);
const niveauxInvalid = computedCheck((data) => data.niveaux.length == 0);
const formInvalid = computed(() => resumeInvalid.value || enseignementsInvalid.value || niveauxInvalid.value);

watchEffect(() => {
  const data = formData.value;
  if ((data == null) || (!data.status_shared)) return { resume: false, enseignements: false, niveaux: false, some: false };
  const resume = data.abstract.length < 50;
  const enseignements = data.enseignements.length == 0;
  const niveaux = data.niveaux.length == 0;
});

function computedShowError(comp: ReturnType<typeof computedCheck>) {
  return computed(() => {
    return showErrors.value && comp.value;
  });
}

const resumeError = computedShowError(resumeInvalid);
const enseignementsError = computedShowError(enseignementsInvalid);
const niveauxError = computedShowError(niveauxInvalid);
const submitDisabled = computedShowError(formInvalid);

watch(() => formData.value.status_shared, (v) => {
  if (!v) {
    formData.value.status_web = false;
  }
});

function cancel() {
  model.value = undefined;
}

let locked = false;

async function submit() {
  if (model.value == null) return false;
  if (formData.value == null) return false;
  showErrors.value = true;
  if (formInvalid.value) return;

  if (locked) return;
  locked = true;
  try {
    const nid = model.value.nid;
    try {
      await activites.putMetaData(nid, {
        status_shared: formData.value.status_shared,
        status_web: formData.value.status_shared && formData.value.status_web,
        abstract: formData.value.abstract,
        enseignements: formData.value.enseignements,
        modules: formData.value.modules,
        niveaux: formData.value.niveaux,
        themes: formData.value.themes,
      });
      model.value = undefined;
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Échec l\'enregistrement', detail: error, life: 5000 });
      throw error;
    }
    bib.refresh(parseInt('' + nid));
  } catch (error) {

  } finally {
    locked = false;
  }
}

</script>

<template>
  <Checkbox v-model="formData!.status_shared" id="share" :binary="true" class="mr-4" />
  <label for="share" class="font-semibold w-6rem">Publier dans la bibliothèque ENTRE ENSEIGNANTS</label>
  <div class="details">
    En cochant cette case, vous partagez votre activité avec les enseignants possédant un compte sur Capytale.
  </div>
  <div :class="{ faded: formData!.status_shared }">
    <Checkbox v-model="formData!.status_web" id="web" :binary="true" class="mr-4"
      :disabled="!formData!.status_shared" />
    <label for="web" class="font-semibold w-6rem">Publier dans la bibliothèque POUR TOUS</label>
    <div class="details">
      En cochant cette case, vous partagez votre activité sans restriction de statut. Elle sera visible par tout
      utilisateur de Capytale, y compris les élèves.
    </div>
  </div>
  <label for="description" class="font-semibold w-6rem" :class="{ invalid: resumeError }">Résumé (50 caractères
    minimum) <span class="invalid">*</span></label>
  <Textarea id="resume" v-model="formData!.abstract" autoResize rows="5" class="w-full" :invalid="resumeError" />
  <div class="grid my-form-grid">
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <Enseignements v-model="formData!.enseignements" :invalid="enseignementsError" />
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <Niveaux v-model="formData!.niveaux" :invalid="niveauxError" />
    </div>
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <Modules v-model="formData!.modules" />
      <Themes v-model="formData!.themes" />
    </div>
  </div>
  <div class="flex justify-content-end gap-2 my-4" style="position: absolute; height:2em; bottom: 0;">
    <Button type="button" label="Annuler" severity="secondary" @click="cancel"></Button>
    <Button type="button" label="Enregistrer" :disabled="submitDisabled" @click="submit"></Button>
  </div>
</template>


<style scoped>
.invalid {
  color: var(--p-red-500);
}


.faded {
  color: var(--gray-300);
}

.my-form-grid {
  grid-template-columns: 1.5fr 1.5fr 2fr;
  column-gap: 0.5em;
}
</style>
