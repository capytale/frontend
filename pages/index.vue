<template>
  <article>
    <div class="bottomRight">
      <span @click="nextSnap"
        class="slidedown-icon h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center">
        <i :class="upDownIcon" />
      </span>
    </div>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="'https://capytale2.ac-paris.fr/logo.svg'" class="w-40 mr-4 rounded-lg my-16" />
        <div>
          <h1>Capytale</h1>
          <h2>
            Activités numériques et de programmation pour la classe
          </h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-32">
        <Card v-for="(c, index) of cards_OLD" key="index">
          <template #content>
            <div class="flex flex-row align-center">
              <i :class="c.icon" class="mt-2 mr-2 text-gray-500"></i>
              <div class="font-semibold">{{ c.title }}</div>
            </div>
            <div class="mt-2 text-gray-500" v-html="c.description"></div>
          </template>
        </Card>
      </div>
    </section>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="'https://capytale2.ac-paris.fr/logo.svg'" class="w-40 mr-4 rounded-lg my-16" />
        <div>
          <h1>Capytale Duplicata en réécriture</h1>
          <h2>
            Activités numériques et de programmation pour la classe
          </h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-32">
        <Card v-for="(c, index) of cards" key="index">
          <template #content>
            <div class="flex flex-row align-center">
              <i :class="c.icon" class="mt-2 mr-2 text-gray-500"></i>
              <div class="font-semibold">{{ c.title }}</div>
            </div>
            <div class="mt-2 text-gray-500" v-html="c.description"></div>
          </template>
        </Card>
      </div>
    </section>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="'https://capytale2.ac-paris.fr/logo.svg'" class="w-40 mr-4 rounded-lg my-16" />
        <div>
          <h2>Créer, distribuer et évaler des activités pédagogiques</h2>
        </div>
      </div>
      <CapyTimeline />
    </section>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="'https://capytale2.ac-paris.fr/logo.svg'" class="w-40 mr-4 rounded-lg my-16" />
        <div>
          <h2>Une sélection d'outils complète et cohérente</h2>
        </div>
      </div>
      <CarouselEdu />
    </section>
  </article>
</template>

<script setup>
// TODO : surveiller les références aux dépendances (composables ?)
const cards_OLD = [
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
      "Une bibliothèque collaborative offrant des milliers de ressources pédagogiques sous licence Creative Commons By-SA.",
    // icon: "i-heroicons-lock-open",
    icon: "pi pi-lock-open",
  },
  {
    title: "Environnement standardisé",
    description:
      "Adapté aux besoins de l’enseignement secondaire sur les STIAM (Sciences, Technologie, Ingénierie, Arts et Mathématiques).",
    // icon: "i-heroicons-academic-cap",
    icon: "pi pi-cog",
  },
  {
    title: "Tous les langages",
    description:
      "Programmation par blocs (Scratch), en Python, SQL, OCaml, HTML, CSS, JavaScript, ...",
    // icon: "i-heroicons-code-bracket",
    icon: "pi pi-code",
  },
  {
    title: "Fluidité pédagogique",
    description: "Conçu pour simplifier les échanges entre les enseignants et les élèves.",
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
    description: "Entièrement hébergé sur sur une infrastructure académique et respectueux du RGPD.",
    // icon: "i-heroicons-building-library",
    icon: "pi pi-server",
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
      "Accès via tous les ENT de France.<br>Des centaines de milliers d'utilisateurs.",
    icon: "pi pi-users",
    // icon: "i-heroicons-presentation-chart-bar",
    icon: "pi pi-chart-line",
  },
]; const cards = [
  {
    title: "Commun numérique",
    description:
      "Soutenu par le ministère de l'éducation. Des partenariats avec des enseignants et l’Edtech. Hébergé sur sur une infrastructure académique. Respectueux du RGPD.",
    // icon: "heroicons:user-group",
    icon: "pi pi-users",
  },
  {
    title: "Ressources éducatives libres",
    description:
      "Une bibliothèque collaborative offrant des milliers de ressources pédagogiques sous licence Creative Commons By-SA.",
    // icon: "i-heroicons-lock-open",
    icon: "pi pi-lock-open",
  },
  {
    title: "Environnement simple et homogène",
    description:
      "Tout pour les STIAM (Sciences, Technologie, Ingénierie, Arts et Mathématiques) pour tous les élèves su cycle 3 aux CPGE. Programmation par blocs (Scratch), en Python, SQL, OCaml, HTML, CSS, JavaScript, ...",
    // icon: "i-heroicons-academic-cap",
    icon: "pi pi-cog",
  },
  {
    title: "Fluidité pédagogique",
    description: "Conçu pour simplifier les échanges entre les enseignants et les élèves.",
    // icon: "i-heroicons-arrows-right-left",
    icon: "pi pi-arrow-right-arrow-left",
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
      "Accès via tous les ENT de France.<br>Des centaines de milliers d'utilisateurs.",
    icon: "pi pi-users",
    // icon: "i-heroicons-presentation-chart-bar",
    icon: "pi pi-chart-line",
  },
];

const upDownIcon = ref("pi pi-arrow-down")

const nextSnap = () => {
  const scroller = document.querySelector(".scroller");
  const sections = scroller.querySelectorAll("section");
  const currentScroll = window.scrollY;
  let nextSnap = 0;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log("loop", section.offsetTop, currentScroll);
    upDownIcon.value = "pi pi-arrow-down"

    if (section.offsetTop > currentScroll + 1) {
      nextSnap = section.offsetTop;
      console.log("i", i, sections.length)
      upDownIcon.value = i == sections.length - 1 ? "pi pi-arrow-up" : "pi pi-arrow-down"
      break;
    }
  }
  console.log(nextSnap);

  window.scrollTo({ top: nextSnap, behavior: "smooth" });
};

</script>

<style scoped>
@keyframes slidedown-icon {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(0);
  }
}

.slidedown-icon {
  animation: slidedown-icon;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  cursor: pointer;
}

.scroller {
  height: calc(100vh - 8rem);
  overflow-y: scroll;
  scroll-snap-type: y proximity;
}

.scroller section {
  scroll-snap-align: start;
  /* padding: 2rem; */
}

.bottomRight {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 99;
  text-align: center;
}
</style>
