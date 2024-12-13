<script setup>
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";

const codelist = ref([]);
const usersList = ref([])
const authenticated = ref(false);
const getDataFromApi = async function () {
  try {
    const list = await sesameApi.listCodes()
    const myList = list.map(obj => {
      return {
        ...obj,
        // code: obj.code.slice(0, 3) + " " + obj.code.slice(3, 6) + " " + obj.code.slice(6, 9),
        count: obj.max_count - obj.count + "/" + obj.max_count,
        exp: obj.exp.toLocaleString('fr-FR'),
        require_mail: obj.require_mail ? '📧' : ''
      };
    });
    authenticated.value = true;
    codelist.value = myList;
  } catch {
    authenticated.value = false;
  }
}
const getStudentListFromApi = async function () {
  try {
    const list = await sesameApi.listUsers()
    usersList.value = list
    authenticated.value = true;
    return true;
  } catch {
    authenticated.value = false;
    return false
  }
}
console.log("usersList", usersList)

const classes = computed(() => {
  const c = new Set()
  usersList.value.forEach(user => {
    c.add(user.classe)
  })
  return Array.from(c).map(classe => ({ name: classe }))
})

getStudentListFromApi()
getDataFromApi();
</script>

<template>
  <div class="mx-6 w-full mt-4">


    <h1 class="mb-6">
      Sésame : Capytale pour les établissements sans ENT public.
    </h1>

    <p>
      Capytale offre à chaque enseignant la possibilité de créer un compte avec son adresse professionnelle : @ac-***.fr
      ou @aefe.fr.
    </p>
    <p>
      Lorsqu'il est connecté, l'enseignant peut générer puis distribuer à sa classe un code sésame à neuf caractères
      pour
      que les élèves puissent à leur tour créer un compte Capytale.
    </p>
    <p>
      Pour plus d'informations, consultez la FAQ
    </p>
    <Tabs value="2" class="mt-6">
      <TabList>
        <Tab value="1">Mes codes</Tab>
        <Tab value="2">Mes élèves</Tab>
        <Tab value="3">FAQ</Tab>
      </TabList>

      <TabPanels>

        <TabPanel value="1">
          <SesameCodes :authenticated="authenticated" :codelist="codelist" />
        </TabPanel>
        <TabPanel value="2">
          <SesameEleves :authenticated="authenticated" :usersList="usersList" :classes="classes" />
        </TabPanel>
        <TabPanel value="3">
          <div class="faq">
            <h2>FAQ</h2>


            <video width="640" height="480" :poster="'media/posterVideoSesame.png'" controls class="my-6">
              <source src="https://capytale2.ac-paris.fr/f/sesame-ui/sesame.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <ul>
              <li>
                <span class="question">Comment les élèves vont-ils se connecter ?</span>
                <p>
                  Pour créer son compte, l'élève choisit "Connexion sans ENT"
                  dans l'interface de connexion de <a href="https://capytale.fr">capytale.fr</a>.<br />
                  Lors de cette phase de création, chaque élève de la classe est invité à saisir le code
                  Sésame que vous lui avez fourni.
                </p>
              </li>
              <li>
                <span class="question">Y a-t-il une limite au nombre comptes créés ?</span>
                <p>
                  Une limite de création de 50 comptes par code sésame et 1000 comptes élève par enseignant et par année
                  glissante permettent d'éviter les débordements incontrôlés.
                </p>
              </li>
              <li>
                <span class="question">Les comptes sont-ils limités dans le temps ?</span>
                <p>
                  La durée de vie d'un compte enseignant n'est pas limitée s'il est en activité.
                  Si un compte enseignant n'a pas été utilisé pendant
                  deux années scolaires consécutives, il est désactivé.<br />
                  Chaque compte élève est valide pour l'année scolaire en cours et les deux suivantes (jusqu'au 31
                  juillet).
                </p>
              </li>
              <li>
                <span class="question">Comment gérer le changement d'année scolaire pour les comptes élève ?</span>
                <p>
                  Dans l'intervalle entre le 1<sup>er</sup> août et le 31 décembre, tout compte Sésame d'élève
                  peut être prolongé pour la nouvelle année scolaire et la suivante grâce à
                  un nouveau code Sésame. Ce code Sésame peut être fourni par un autre
                  enseignant, auquel cas ce dernier hérite de la gestion du compte Sésame de l'élève.
                </p>
              </li>
            </ul>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

  </div>
</template>

<style scoped>
.question {
  font-weight: bold;
  font-style: italic;
}

ul {
  list-style: disc;
  margin: 1em;
}
</style>
