<script setup>
import sesameApi from "@capytale/activity.js/backend/capytale/sesame";

const codelist = ref([]);
const authenticated = ref(true);
const getDataFromApi = async function () {
  try {
    const list = await sesameApi.listCodes()
    const myList = list.map(obj => {
      return {
        ...obj,
        code: obj.code.slice(0, 3) + " " + obj.code.slice(3, 6) + " " + obj.code.slice(6, 9),
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
getDataFromApi();
</script>

<template>
  <div class="prose mx-6 max-w-6xl w-full mt-4">

    <Tabs value="0">
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
          <!-- <Eleves /> -->
        </TabPanel>
        <TabPanel value="3">
          <div class="faq">
            <h2>FAQ</h2>
            <ul>
              <li>
                <span class="question">Comment les élèves vont-ils se connecter ?</span>
                Pour créer son compte, l'élève choisit "Connexion sans ENT"
                dans l'interface de connexion de <a href="https://capytale.fr">capytale.fr</a>.<br />
                Lors de cette phase de création, chaque élève de la classe est invité à saisir le code
                Sésame que vous lui avez fourni.
              </li>
              <li>
                <span class="question">Y a-t-il une limite au nombre comptes créés ?</span>
                Une limite de création de 50 comptes par code sésame et 1000 comptes élève par enseignant et par année
                glissante permettent d'éviter les débordements incontrôlés.
              </li>
              <li>
                <span class="question">Les comptes sont-ils limités dans le temps ?</span>
                La durée de vie d'un compte enseignant n'est pas limitée s'il est en activité.
                Si un compte enseignant n'a pas été utilisé pendant
                deux années scolaires consécutives, il est désactivé.<br />
                Chaque compte élève est valide pour l'année scolaire en cours et les deux suivantes (jusqu'au 31
                juillet).
              </li>
              <li>
                <span class="question">Comment gérer le changement d'année scolaire pour les comptes élève ?</span>
                Dans l'intervalle entre le 1<sup>er</sup> août et le 31 décembre, tout compte Sésame d'élève
                peut être prolongé pour la nouvelle année scolaire et la suivante grâce à
                un nouveau code Sésame. Ce code Sésame peut être fourni par un autre
                enseignant, auquel cas ce dernier hérite de la gestion du compte Sésame de l'élève.
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
