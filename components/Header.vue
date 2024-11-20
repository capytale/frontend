<script setup lang="ts">
const colorMode = useColorMode()
const userStore = useCurrentUserStore()

const checked = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

</script>
<template>
  <div class="navbar sticky top-0 z-[1000]">
    <div class="navbarContainer flex-wrap">
      <span class="navbarLogo hidden lg:block order-1">
        <NuxtLink href="/"> CAPYTALE </NuxtLink>
      </span>
      <div class="capytaleMenu order-4 md:order-2">
        <NuxtLink v-if="userStore.isAuthenticated" to="/my"><span class="px-2">Mes activités</span></NuxtLink>
        <NuxtLink v-if="userStore.isAuthenticated" to="/bibliotheque"><span class="px-2">La bibliothèque</span></NuxtLink>
      </div>

      <div class="activityMenu grow justify-end order-3">
        <NuxtLink to="/sesame"
          v-if="userStore.isAuthenticated && (userStore.user?.provider === 'mail') && userStore.isTeacher" class="mr-4">
          Sésame
        </NuxtLink>
        <i :class="checked ? 'pi pi-sun' : 'pi pi-sun text-yellow-400'"></i>
        <ToggleSwitch v-model="checked" @change="checked = !checked" style="transform: scale(0.7)" class="-mx-1"
          v-tooltip.top="{ value: 'Mode clair/sombre', showDelay: 300, hideDelay: 100 }"
          aria-controls="Mode clair/sombre" />

        <i :class="checked ? 'pi pi-moon text-yellow-400 mr-4' : 'pi pi-moon mr-4'"></i>
        <EntButton />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  font-weight: bold;
}

.navbar {
  --navbar-text-color: rgba(255, 255, 255, 0.95);

  /* .dark) & { */
  .dark & {
    --navbar-text-color: var(--text-color);
  }

  & {
    min-height: 4rem;
    background-color: var(--p-surface-800);
    display: flex;
    align-items: center;
    color: var(--navbar-text-color);
    color-scheme: dark;
  }


  /* .dark) & { */
  /*.dark & {
    background-color: var(--p-surface-50);
  }*/

  & .p-button-outlined,
  & .p-button-text {
    color: var(--navbar-text-color);
  }

  & .p-button-outlined {
    border-color: var(--navbar-text-color);
  }

  .light & .p-button.p-button-secondary:enabled:focus {
    box-shadow: 0 0 0 2px #1c2127, 0 0 0 4px rgba(255, 255, 255, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0);
  }

  .light & .p-button.p-button-warning:enabled:focus {
    box-shadow: 0 0 0 2px #1c2127, 0 0 0 4px rgba(249, 115, 22, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0);
  }
}

.navbarContainer {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1rem;
  height: 100%;

  &>* {
    flex-shrink: 0;
  }
}

.navbarLogo {
  font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 2px;
  height: 100%;

  &>* {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    color: var(--navbar-text-color);
    text-decoration: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.capytaleMenu {
  display: flex;
  gap: 1rem;
  min-height: 3rem;
  align-items: center;
}


.activityMenu {
  padding-right: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}

/*TODO : ces classes sont-elles utilisées ? */
.sidebarRadioButtons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebarRadioGroup {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
