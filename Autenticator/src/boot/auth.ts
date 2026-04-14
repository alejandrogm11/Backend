import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth'

export default boot(async () => {
  const authStore = useAuthStore()
  await authStore.initSession()
  // Si la cookie existe y es válida → authStore.isAuthenticated = true
  // Si no → queda en false, y el router redirigirá al login
})
