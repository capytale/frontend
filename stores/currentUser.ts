import { loadCurrentUser, type CurrentUser } from "~/utils/currentUser";
import type { Status } from '~/types/store';

export const useCurrentUserStore = defineStore('user', () => {
  const user = ref<CurrentUser | null>()
  const status = shallowRef<Status>("idle")

  const loadUser = async () => {
    if (status.value == "success") return
    if (status.value == "loading") return
    try {
      status.value = "loading"
      user.value = await loadCurrentUser();
      status.value = "success"
    } catch (e) {
      status.value = "error"
    }
  }
  loadUser()

  const isAuthenticated = computed(() => (!!user.value))
  const isTeacher = computed(() => (user.value && (user.value.profil === 'teacher')))
  const isStudent = computed(() => (user.value && (user.value.profil === 'student')))

  return {
    user,
    status,
    isAuthenticated,
    isTeacher,
    isStudent,
  }
})
