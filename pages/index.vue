<template>
    <div class="flex flex-row items-center justify-around">
      <img src="https://capytale2.ac-paris.fr/logo.svg" class="w-40 mr-4 rounded-lg" />
      <div>
        <h1 class="text-4xl font-bold">Capytale</h1>
        <h2 class="text-2xl font-semibold">
          Activités numériques et de programmation pour la classe
        </h2>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 my-32">
      <Card v-for="(c, index) of cards" key="index">
      <template #content>
        <div class="flex flex-row align-center">
          <Icon :name="c.icon" class="text-primary-500 text-2xl mr-4" />
          <div class="font-semibold">{{ c.title }}</div>
        </div>
        <div class="mt-2 text-gray-500" v-html="c.description"></div>
      </template>
      </Card>
    </div>

    <CarouselEdu />
</template>

<script setup>
const cards = [
  {
    title: "Commun numérique tsoin tsoin",
    description:
      "Un projet inter-académique soutenu par le ministère. \nDes partenariats avec des enseignants, l’Edtech, ou des associations.",
    icon: "heroicons:user-group",
  },
  {
    title: "Ressources éducatives libres",
    description:
      "Une bibliothèque de 4000 ressources pédagogiques sous licence Creative Commons By-SA",
    icon: "i-heroicons-lock-open",
  },
  {
    title: "Environnement standardisé",
    description:
      "Adapté aux besoins de l’enseignement secondaire sur les STIM (Sciences, Technologie, Ingénierie, Mathématiques)",
    icon: "i-heroicons-academic-cap",
  },
  {
    title: "Tous les langages",
    description:
      "Adapté aux besoins de l’enseignement secondaire sur les STIM (Sciences, Technologie, Ingénierie, Mathématiques)",
    icon: "i-heroicons-code-bracket",
  },
  {
    title: "Fluidité pédagogique",
    description: "Conçu pour simplifier les échanges entre les enseignants et les élèves",
    icon: "i-heroicons-arrows-right-left",
  },
  {
    title: "Du collège aux CPGE",
    description:
      "De nombreux types d’activités adaptés à tous les élèves à partir du cycle 3.",
    icon: "i-heroicons-arrow-up-right",
  },
  {
    title: "Cadre institutionnel",
    description: "Entièrement hébergé sur sur une infrastructure académique",
    icon: "i-heroicons-building-library",
  },
  {
    title: "En ligne sans installation",
    description:
      "Fonctionne simplement dans le navigateur de tout ordinateur, tablette ou téléphone.",
    icon: "i-heroicons-globe-alt",
  },
  {
    title: "Adoption massive",
    description:
      "2.5 millions d’activités <br> 400 000 utilisateurs <br> 150 000 visites par semaine",
    icon: "i-heroicons-presentation-chart-bar",
  },
];
</script>
