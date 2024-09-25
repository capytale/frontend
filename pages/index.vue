<script setup>
const cards = [
  {
    title: "Commun numérique",
    description:
      "Soutenu par le ministère de l'éducation.<br/>Des partenariats avec des enseignants développeurs et l’Edtech.<br/>Hébergé sur sur une infrastructure académique et respectueux du RGPD.",
    // icon: "heroicons:user-group",
    icon: "pi pi-users",
  },
  {
    title: "Ressources éducatives libres",
    description:
      "Une bibliothèque collaborative offrant des milliers de ressources pédagogiques sous licence Creative Commons By-SA. Accès via tous les ENT de France.<br>Accès via tous les ENT de France pour des des centaines de milliers d'utilisateurs.",
    // icon: "i-heroicons-lock-open",
    icon: "pi pi-lock-open",
  },
  {
    title: "Environnement simple et homogène",
    description:
      "Tout pour les STIAM (Sciences, Technologie, Ingénierie, Arts et Mathématiques) pour les élèves du cycle 3 jusqu'aux CPGE.",
    // icon: "i-heroicons-academic-cap",
    icon: "pi pi-cog",
  },
  {
    title: "Fluidité pédagogique",
    description: "Conçu pour simplifier les échanges entre les enseignants et les élèves.<br/>Fonctionne simplement dans le navigateur de tout ordinateur, tablette ou téléphone.",
    // icon: "i-heroicons-arrows-right-left",
    icon: "pi pi-arrow-right-arrow-left",
  },
];

const nextSnap = () => {
  const scroller = document.querySelector(".scroller");
  const sections = scroller.querySelectorAll("section");
  const currentScroll = window.scrollY;
  let nextSnap = 0;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    // console.log("loop", section.offsetTop, currentScroll);

    if (section.offsetTop > currentScroll + 1) {
      nextSnap = section.offsetTop;
      // console.log("i", i, sections.length)
      break;
    }
  }
  // console.log(nextSnap);

  window.scrollTo({ top: nextSnap, behavior: "smooth" });
};

</script>


<template>
  <article>
    <!-- <div class="bottomRight"> -->
    <!--   <span @click="nextSnap" -->
    <!--     class="slidedown-icon h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center"> -->
    <!--     <i :class="upDownIcon" /> -->
    <!--   </span> -->
    <!-- </div> -->

    <!-- <section> -->
    <!--   <div class="flex flex-row items-center justify-around"> -->
    <!--     <img :src="'https://capytale2.ac-paris.fr/logo.svg'" class="w-40 mr-4 rounded-lg my-16" /> -->
    <!--     <div> -->
    <!--       <h1>Capytale</h1> -->
    <!--       <h2> -->
    <!--         Activités numériques et de programmation pour la classe -->
    <!--       </h2> -->
    <!--     </div> -->
    <!--   </div> -->
    <!--   <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-32"> -->
    <!--     <Card v-for="(c, index) of cards_OLD" key="index"> -->
    <!--       <template #content> -->
    <!--         <div class="flex flex-row align-center"> -->
    <!--           <i :class="c.icon" class="mt-2 mr-2 text-gray-500"></i> -->
    <!--           <div class="font-semibold">{{ c.title }}</div> -->
    <!--         </div> -->
    <!--         <div class="mt-2 text-gray-500" v-html="c.description"></div> -->
    <!--       </template> -->
    <!--     </Card> -->
    <!--   </div> -->
    <!--   <span @click="nextSnap" -->
    <!--     class="slidedown-icon h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center"> -->
    <!--     <i :class="upDownIcon" /> -->
    <!--   </span> -->
    <!-- </section> -->

    <section>
      <div class="flex flex-row items-center justify-around">
        <img src="https://capytale2.ac-paris.fr/logo.svg" class="w-40 mr-4 rounded-lg my-8" />
        <div>
          <h1>Capytale</h1>
          <h2>
            Activités numériques et de programmation pour la classe
          </h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 mb-4">
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
      <span @click="nextSnap" class="slidedown-icon bg-primary text-primary-contrast flex items-center justify-center">
        <i class="pi pi-arrow-circle-down" style="font-size: 1.5rem" />
      </span>
    </section>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="'media/classe.png'" class="w-60 mr-4 rounded-lg my-20" />
        <div>
          <h2>Créer, distribuer et évaluer des activités pédagogiques</h2>
        </div>
      </div>
      <CapyTimeline />
      <span @click="nextSnap" class="slidedown-icon bg-primary text-primary-contrast flex items-center justify-center">
        <i class="pi pi-arrow-circle-down" style="font-size: 1.5rem" />
      </span>
    </section>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="'media/apps.png'" class="w-60 mr-4 my-20" />
        <div>
          <h2>Une sélection d'outils complète et cohérente</h2>
        </div>
      </div>
      <CarouselEdu />
      <span @click="nextSnap" class="slidedown-icon bg-primary text-primary-contrast flex items-center justify-center">
        <i class="pi pi-arrow-circle-up" style="font-size: 1.5rem" />
      </span>
    </section>
  </article>
</template>



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
  animation-duration: 2s;
  animation-iteration-count: infinite;
  cursor: pointer;
}

.scroller {
  height: calc(100vh - 8rem);
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.scroller section {
  scroll-snap-align: start;
  /* padding: 2rem; */
}

section {
  height: 100%;
}

.bottomRight {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 99;
  text-align: center;
}
</style>
