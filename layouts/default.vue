<script setup>
const userStore = useCurrentUserStore()
const colorMode = useColorMode()
const { path } = useRoute()
const bgColor = computed(() => colorMode.value === 'light' ? 'background-color: var(--p-neutral-100)' : 'background-color: var(--p-gray-800)')

useHead({
  htmlAttrs: {
    lang: 'fr',
  }
})
</script>

<template>
  <div class="scroller">
    <ConfirmDialog />
    <DynamicDialog />
    <ArchiveBuilderJobsPanel />
    <Toast position="bottom-right" />

    <div class="appContainer" :style="bgColor">
      <Header></Header>
      <div class="flex">
        <div class="container mx-auto flex flex-col">
          <div class="mb-8 grow shrink-0">
            <slot />
          </div>
          <div class="pb-8 shrink-0">
            <Footer></Footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scroller {
  /* height: calc(100vh); */
  /* overflow-y: scroll; */
  scroll-snap-type: y proximity;
}


html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
}

.container {
  max-width: min(calc(100% - 2rem), 1600px);
}


.appContainer {
  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr;
  overflow: hidden;

  &>*:nth-child(2) {
    overflow-y: auto;
  }
}

h1 {
  font-size: 2rem;
  font-weight: 700;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

h3 {
  font-size: 1.25rem;
  font-weight: 500;
}

.dark .p-card {
  border: 1px solid var(--gray-600);
}

/*
.p-component {
  font-size: 1.3rem;
}

.p-badge {
  font-size: 1rem;
}

.p-tag {
  font-size: 1rem;
}
  */

.bggray {
  background: var(--p-surface-100);
}

/*   List.vue   */
/* ↓↓↓↓↓↓↓↓↓↓↓↓ */
.p-datatable-hoverable-rows .p-selectable-row {
  cursor: default;
}

.scroll {
  height: 50%;
  overflow: scroll;
}

/*    My.vue    */
/* ↓↓↓↓↓↓↓↓↓↓↓↓ */
.sidemenu-inactive {
  margin-left: 200px;
  padding-left: 4rem;
}

.fixed {
  position: fixed;
  z-index: 1000;
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑ */
/*    My.vue    */

/* Comments.vue */
/* ↓↓↓↓↓↓↓↓↓↓↓↓ */
.p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
  font-size: 1.5rem;
  color: #ffd90088;
}

.p-rating .p-rating-item .p-rating-icon {
  font-size: 1.5rem;
  color: #ccc;
}

.p-fieldset .p-fieldset-legend {
  font-weight: 100;
  font-size: small;
  border: none;
  background: none;
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑ */
/* Comments.vue */


/* TagEdit.vue  */
/* ↓↓↓↓↓↓↓↓↓↓↓↓ */
.p-tree-node-label :hover .surprise {
  display: inline;
}

</style>
