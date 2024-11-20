import { loadCurrentUser, type CurrentUser } from "~/utils/currentUser";

export const useCurrentUserStore = defineStore('user', () => {
  const user = ref<CurrentUser | null | false>(false)
  const getUser = async () => {
    user.value = await loadCurrentUser();
  }

  const isLoaded = computed(() => user.value !== false)
  const isAuthenticated = computed(() => (user.value != null && user.value !== false))
  const isTeacher = computed(() => {
    if (user.value == null || user.value === false) return false;
    return user.value.profil === 'teacher';
  })
  const isStudent = computed(() => {
    if (user.value == null || user.value === false) return false;
    return user.value.profil === 'student';
  })

  return {
    user,
    getUser,
    isLoaded,
    isAuthenticated,
    isTeacher,
    isStudent,
  }
})
