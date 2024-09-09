import { ref, readonly } from 'vue'
import { auth } from '@/config/firebase'

const user = ref(null)

export function useAuth() {
  const setUser = async () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          const token = await currentUser.getIdTokenResult(false)
          user.value = {
            ...currentUser,
            rights: token.claims.rights
          }
        } else {
          user.value = null
        }
        unsubscribe()
        resolve()
      })
    })
  }

  const logout = async () => {
    await auth.signOut()
    user.value = null
  }

  return {
    user: readonly(user),
    setUser,
    logout
  }
}