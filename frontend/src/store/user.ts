import { defineStore } from "pinia";
import { User as FirebaseUser } from 'firebase/auth'

export interface IUser {
  fullName: string;
  email: string;
}

interface UserStore {
  user: IUser | null
  authUser: FirebaseUser | null
}

export const useUser = defineStore('user', {
  state: (): UserStore => ({
    user: null,
    authUser: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.authUser,
  },
  actions: {
    setAuthUser(user: FirebaseUser | null) {
      this.authUser = user;
    },
    setUser(user: IUser | null) {
      this.user = user;
    },
    clearStore() {
      this.authUser = null;
      this.user = null;
    }
  }
})