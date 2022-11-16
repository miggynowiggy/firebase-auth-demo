import { defineStore } from 'pinia'
import { User as FirebaseUser } from 'firebase/auth'
import { IUser } from 'src/models'

interface UserStore {
  user: IUser | null
  authUser: FirebaseUser | null
}

export const useUserStore = defineStore('userStore', {
  state: (): UserStore => ({
    user: null,
    authUser: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.authUser,
  },
  actions: {
    setAuthUser(user: FirebaseUser | null) {
      this.authUser = user
    },
    setUser(user: IUser | null) {
      this.user = user
    },
    clearStore() {
      this.authUser = null
      this.user = null
    },
  },
})
