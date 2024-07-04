<script setup>
import { useSideMenuStore } from '@/stores/ui'
const sideMenu = useSideMenuStore()
const theme = useThemeStore()

const { data: user, pending, error, status } = await fetchCurrentUser()

const themeIcon = () => {
  return theme.current === 'light' ? 'pi pi-moon' : 'pi pi-sun';
}


</script>
<template>
  <div class="navbar">
    <span v-if="$route.name == 'my'" class="text-2xl text-gray-100 p-2">
        <button v-if="user" @click="sideMenu.toggle"><i class="pi pi-bars"></i> </button>
      </span>
    <div class="navbarContainer">
      <span class="navbarLogo">
        <NuxtLink href="/"> CAPYTALE </NuxtLink>    
      </span>
      <div class="capytaleMenu">
        <NuxtLink v-if="user" to="/my"><span class="px-2">Mes activités</span></NuxtLink>
        <NuxtLink v-if="user" to="/bibliotheque"><span class="px-2">La bibliothèque</span></NuxtLink>
      </div>
      <div class="activityInfo">
      </div>
      <div class="activityMenu">
        <Button @click="theme.toggle" :icon="themeIcon()" class="mr-2" outlined/>
        <div v-if = "user">
          <span class="px-2">{{ user.firstname }} {{ user.lastname }}</span>
        <a href="/web/user/logout"><span class="px-2"><i class="pi pi-sign-out"></i></span></a>
        </div>
        <div v-else>
        <span class="px-2">Connexion <i class="pi pi-sign-in"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  --navbar-text-color: rgba(255, 255, 255, 0.95);

  /* .dark-theme) & { */
  .dark-theme & {
    --navbar-text-color: var(--text-color);
  }

  height: 60px;
  background-color: var(--surface-800);
  display: flex;
  align-items: center;
  color: var(--navbar-text-color);
  overflow: hidden;
  color-scheme: dark;

  /* .dark-theme) & { */
  .dark-theme & {
    background-color: var(--surface-50);
  }

  & .p-button-outlined,
  & .p-button-text {
    color: var(--navbar-text-color);
  }

  & .p-button-outlined {
    border-color: var(--navbar-text-color);
  }

  .light-theme & .p-button.p-button-secondary:enabled:focus {
    box-shadow: 0 0 0 2px #1c2127, 0 0 0 4px rgba(255, 255, 255, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0);
  }

  .light-theme & .p-button.p-button-warning:enabled:focus {
    box-shadow: 0 0 0 2px #1c2127, 0 0 0 4px rgba(249, 115, 22, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0);
  }
}

.navbarContainer {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 100%;

  &>* {
    flex-shrink: 0;
  }

  overflow: hidden;
}

.navbarLogo {
  font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 24px;
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
  gap: 8px;
}

.activityInfo {
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  gap: 12px;
}

.activityInfoText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &>* {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}

.activityInfoTitle {
  font-size: 20px;
  font-weight: 500;
}

.activityLogo {
  width: 35px;
  height: 37px;
  background-color: orange;
  border-radius: 4px;
  border: 1px solid red;
  flex-shrink: 0;

  @media only screen and (max-width: 992px) {
    display: none;
  }
}

.activityMenu {
  padding-right: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

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
