<script setup>
const colorMode = useColorMode()
colorMode.preference = 'light'
</script>

<template>
  <div class="prose mx-6 max-w-6xl w-full mt-4">
    <h2>Créez un code Sésame pour que des élèves puissent créer un compte Capytale</h2>

    <SesameCreateCode />

    <p>Pour créer son compte, l'élève choisit "Connexion sans ENT"
      dans l'interface de connexion de <a href="https://capytale.fr">capytale.fr</a>.<br />
      Lors de cette phase de création, chaque élève de la classe est invité à saisir le code
      Sésame que vous lui avez fourni.
    </p>
    <p><b>⚠️&nbsp; Les élèves qui disposent déjà d'un compte ne devraient pas en créer un second.</b></p>

    <span id="anchor"></span>

    <p>
      <strong>Remarques importantes</strong>
    </p>
    <ul>
      <li>Un compte élève créé à partir d'un code Sésame permet d'utiliser pleinement
        tous les services de Capytale, en lien avec tout enseignant.
      </li>
      <ul>
        <li>Si l'élève saisit un courriel, ce sera son identifiant.
          En cas d'oubli de son mot de passe, il devra passer par la procédure de récupération par courriel.</li>
        <li>S'il ne saisit pas pas de courriel, un identifiant sera généré.
          En cas d'oubli de son mot de passe, vous pourrez le réinitialiser.</li>
      </ul>
      <li>Les élèves à qui vous donnez un code ont plus de 15 ans ou créent leur compte avec le consentement d'un
        parent.
      </li>
    </ul>

    <SesameCodes />

    <h2>Gérez les comptes de vos élèves</h2>
    <!-- <Eleves /> -->

    <div class="faq">
      <h2>FAQ</h2>

      <ul>
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
          Chaque compte élève est valide pour l'année scolaire en cours et les deux suivantes (jusqu'au 31 juillet).
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

  </div>
</template>

<style>
.vip {
  background-color: antiquewhite;
}

body {
  margin-right: 3em;
}

.abstract {
  margin: 2em 0em;
  border: 1px solid #999;
  padding: 0 1em 1em 2em;
  border-radius: 0.5em;
}

.question {
  font-weight: bold;
  font-style: italic;
}
</style>
