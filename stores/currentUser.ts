import { loadCurrentUser, type CurrentUser } from "@/utils/currentUser";

export const useCurrentUserStore = defineStore('user', {
  state: () => ({
    user: false
  }) as {
    user: CurrentUser | null | false;
  },
  actions: {
    async getUser() {
      this.user = await loadCurrentUser();
    },
  },
  getters: {
    isLoaded: (state) => state.user !== false,
    isAuthenticated: (state) => (state.user != null && state.user !== false),
    isTeacher: (state) => {
      if (state.user == null || state.user === false) return false;
      return state.user.profil === 'teacher';
    },
    isStudent: (state) => {
      if (state.user == null || state.user === false) return false;
      return state.user.profil === 'student';
    },
  }
})