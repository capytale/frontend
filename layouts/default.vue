<script setup>
const user = useUserStore()
const colorMode = useColorMode()

const bgColor = computed(() => colorMode.preference === 'light' ? 'background-color: var(--p-neutral-100)' : 'background-color: var(--p-gray-800)')

user.getUser()

useHead({
  htmlAttrs: {
    lang: 'fr',
  }
})
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast position="bottom-right" />

  <div class="appContainer" :style="bgColor">
    <Header></Header>
    <div class="flex">
      <div class="container mx-auto">
        <div class="mb-8">
          <slot />
        </div>
        <div class="mb-8">
          <Footer></Footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
}

.container {
  min-width: 400px;
  max-width: min(calc(100% - 2rem), 1600px);
}


.appContainer {
  height: 100%;
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
.p-tree {
  padding: 0px;
  padding-right: 1em;
  border: none;
}

.p-tree .p-tree-container .p-tree-node .p-tree-node-content {
  padding: 0.3em 0em 0.3em 0em;
}

.p-tree-node-label {
  padding: 0.3em 0em 0.3em 0em;
  padding: 0
}

.p-tree-node-label :hover {
  border-radius: 0.3em;
}

.p-tree .p-tree-container .p-tree-node .p-tree-node-content .p-tree-toggler {
  margin-right: 0.1em;
  padding: 0.2rem;
}

.p-tree-node-label :hover .surprise {
  display: inline;
}

.p-tree ul {
  padding: 0 0 0 0.7em;
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑ */
/* TagEdit.vue  */


/*
.pousse {
  margin-left: 0;
  transition: margin-left .2s;
}

.p-tree-selectable {
  background: var(--p-surface-0);
}

.dark .p-tree-selectable {
  background: var(--p-surface-50);
}
*/
</style>
