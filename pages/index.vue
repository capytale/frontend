<script setup>
const cards = [
  {
    title: "Commun numérique",
    description:
      "Soutenu par le ministère de l'éducation.<br/>Des partenariats avec des enseignants développeurs et l’Edtech.<br/>Hébergé sur sur une infrastructure académique et respectueux du RGPD.",
    // icon: "heroicons:user-group",
    icon: "pi pi-users",
    img: "media/men.jpg"
  },
  {
    title: "Ressources éducatives libres",
    description:
      "Une bibliothèque collaborative offrant des milliers de ressources pédagogiques sous licence Creative Commons By-SA. Accès via tous les ENT de France.<br>Accès via tous les ENT de France pour des des centaines de milliers d'utilisateurs.",
    // icon: "i-heroicons-lock-open",
    icon: "pi pi-lock-open",
    img: "media/library.png"
  },
  {
    title: "Environnement simple et homogène",
    description:
      "Tout pour les STIAM (Sciences, Technologie, Ingénierie, Arts et Mathématiques) pour les élèves du cycle 3 jusqu'aux CPGE.",
    // icon: "i-heroicons-academic-cap",
    icon: "pi pi-cog",
    img: "media/students.png"
  },
  {
    title: "Fluidité pédagogique",
    description: "Conçu pour simplifier les échanges entre les enseignants et les élèves.<br/>Fonctionne simplement dans le navigateur de tout ordinateur, tablette ou téléphone.",
    // icon: "i-heroicons-arrows-right-left",
    icon: "pi pi-arrow-right-arrow-left",
    img: "media/classroom.png"
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

const publicUrl = usePublicUrl();

</script>


<template>
  <article>
    <section>
      <div class="flex flex-row items-center justify-between">
        <img src="https://capytale2.ac-paris.fr/logo.svg" class="w-40 mr-4 rounded-lg my-8" />
        <div>
          <h1>Capytale</h1>
          <h2>
            Activités numériques et de programmation pour la classe
          </h2>
        </div>
        <div class="flex flex-row items-center justify-around gap-2">
          <div class="myflex">
            <NuxtLink href="/my">
              <Message severity="secondary" icon="pi pi-folder-open" class="border">
                Mes activités
              </Message>
            </NuxtLink>
            <NuxtLink href="/bibliotheque">
              <Message severity="secondary" icon="pi pi-book" class="border">
                <span>Bibliothèque</span>
              </Message>
            </NuxtLink>
          </div>
          <div class="myflex">
            <a href="https://groupes.renater.fr/sympa/subscribe/capytale" target="_blank">
              <Message severity="secondary" icon="pi pi-envelope" class="border">
                <span>Liste de discussion</span>
              </Message>
            </a>
            <a href="https://capytale2.ac-paris.fr/wiki" target="_blank">
              <Message severity="secondary" icon="pi pi-info-circle" class="border">
                <span>Documentation</span>
              </Message>
            </a>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 mb-4">
        <Card v-for="(c, index) of cards" key="index">
          <template #content>
            <div class="flex flex-row align-center">
              <i :class="c.icon" class="mt-2 mr-2 text-gray-500"></i>
              <div class="font-semibold">{{ c.title }}</div>
            </div>
            <div class="flex flex-row justify-between items-center gap-4">
              <div class="mt-2 text-gray-500" v-html="c.description"></div>
              <img :src="publicUrl(c.img)" class="w-40 rounded-lg" />
            </div>
          </template>
        </Card>
      </div>


      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 mb-4">
        <center class="mt-10 mb-10">
          <video width="640" height="480" :poster="publicUrl('media/posterVideoPres.png')" controls>
            <source src="https://video.ac-paris.fr/mp4/2023-05/rev_-_capytale_-_marion_sarfati_hd.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </center>
        <center class="mt-10 mb-10">
          <video width="640" height="480" :poster="publicUrl('media/posterVideoClasse.png')" controls>
            <source
              src="https://pia.ac-paris.fr/portail/upload/docs/video/mp4/2024-06/24_06_gipticmaths_2024-06-06_15-16-4_454.mp4"
              type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </center>
      </div>

      <span @click="nextSnap" class="slidedown-icon bg-primary text-primary-contrast flex items-center justify-center">
        <i class="pi pi-arrow-circle-down" style="font-size: 1.5rem" />
      </span>
    </section>

    <section>
      <div class="flex flex-row items-center justify-around">
        <img :src="publicUrl('media/classe.png')" class="w-60 mr-4 rounded-lg my-20" />
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
        <img :src="publicUrl('media/apps.png')" class="w-60 mr-4 my-20" />
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
.border {
  border: 1px solid var(--p-message-secondary-color);
}

.myflex {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

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
