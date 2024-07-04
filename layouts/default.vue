<script setup>
const theme = useThemeStore()
const sideMenu = useSideMenuStore()

const currentThemeClass = computed(() => {
  return theme.current + "-theme"
})

useHead({
  htmlAttrs: {
    lang: 'fr',
    style: 'font-size: 13px'
  }
})
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast position="bottom-right" />

  <div :class="'appContainer ' + currentThemeClass">
    <Header></Header>
    <div class="flex bggray">

        <div class="container  mx-auto">
          <slot />
        </div>
    </div>
  </div>
</template>

<style>
.pousse {
  margin-left: 0;
  transition: margin-left .2s;
}

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

.bggray {
  background: var(--surface-100);
}


.p-tree-selectable {
  background: var(--surface-0);
}

.dark-theme .p-tree-selectable {
  background: var(--surface-50);
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

.dark-theme .p-card {
  border: 1px solid var(--gray-600);
}

.p-component {
  font-size: 1.3rem;
}

.p-badge {
  font-size: 1rem;
}

.p-tag {
  font-size: 1rem;
}
</style>
