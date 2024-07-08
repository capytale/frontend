<template>
    <div class="flex flex-row items-center justify-around">
      <img :src="'https://capytale2.ac-paris.fr/logo.svg'" class="w-40 mr-4 rounded-lg" />
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
          <i :class="c.icon" class="mt-2 mr-2 text-gray-500" ></i>
          <div class="font-semibold">{{ c.title }}</div>
        </div>
        <div class="mt-2 text-gray-500" v-html="c.description"></div>
      </template>
      </Card>
    </div>

     <CarouselEdu />
</template>

<script setup>
// TODO : surveiller les références aux dépendances (composables ?)
const cards = [
  {
    title: "Commun numérique",
    description:
      "Un projet inter-académique soutenu par le ministère. \nDes partenariats avec des enseignants, l’Edtech, ou des associations.",
    // icon: "heroicons:user-group",
    icon: "pi pi-users",
  },
  {
    title: "Ressources éducatives libres",
    description:
      "Une bibliothèque de 4000 ressources pédagogiques sous licence Creative Commons By-SA",
    // icon: "i-heroicons-lock-open",
    icon: "pi pi-lock-open",
  },
  {
    title: "Environnement standardisé",
    description:
      "Adapté aux besoins de l’enseignement secondaire sur les STIM (Sciences, Technologie, Ingénierie, Mathématiques)",
    // icon: "i-heroicons-academic-cap",
    icon: "pi pi-cog",
  },
  {
    title: "Tous les langages",
    description:
      "Adapté aux besoins de l’enseignement secondaire sur les STIM (Sciences, Technologie, Ingénierie, Mathématiques)",
    // icon: "i-heroicons-code-bracket",
    icon: "pi pi-code",
  },
  {
    title: "Fluidité pédagogique",
    description: "Conçu pour simplifier les échanges entre les enseignants et les élèves",
    // icon: "i-heroicons-arrows-right-left",
    icon: "pi pi-arrow-right-arrow-left",
  },
  {
    title: "Du collège aux CPGE",
    description:
      "De nombreux types d’activités adaptés à tous les élèves à partir du cycle 3.",
    // icon: "i-heroicons-arrow-up-right",
    icon: "pi pi-arrow-up-right",
  },
  {
    title: "Cadre institutionnel",
    description: "Entièrement hébergé sur sur une infrastructure académique",
    // icon: "i-heroicons-building-library",
    // icon: "pi pi-server",
  },
  {
    title: "En ligne sans installation",
    description:
      "Fonctionne simplement dans le navigateur de tout ordinateur, tablette ou téléphone.",
    // icon: "i-heroicons-globe-alt",
    icon: "pi pi-globe",
  },
  {
    title: "Adoption massive",
    description:
      "Accès via tous les ENT de France<br>Des centaines de milliers d'utilisateurs",
    icon: "pi pi-users",
    // icon: "i-heroicons-presentation-chart-bar",
    icon: "pi pi-chart-line",
  },
];
</script>
