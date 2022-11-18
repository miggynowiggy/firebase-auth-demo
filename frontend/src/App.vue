<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { onAuthStateChanged, Unsubscribe } from 'firebase/auth'
import { notification } from 'ant-design-vue'
import { AUTH } from './configs/firebase'
import { useUserStore } from './store/user'
import { useRouter } from 'vue-router'
import { CheckUserByEmail, CreateUser } from './services'

const userStore = useUserStore()
const router = useRouter()
const firebaseAuthSubscriber = ref<Unsubscribe | null>(null)

onMounted(() => {
  // Subscribe to firebase auth changes when the app is initialized
  const subscriber = onAuthStateChanged(AUTH, async (authUser) => {
    userStore.setAuthUser(authUser)

    if (authUser && !authUser?.emailVerified) {
      router.push({ name: 'Login' })
      notification['error']({
        message: 'Email not verified!',
        description: 'Please confirm your email first before logging in',
      })
      return
    }

    if (authUser) {
      // Check if user is saved at the backend
      let user = await CheckUserByEmail(authUser.email as string)

      // If the firebase user was not yet created at the backend, then create it
      if (!user) {
        user = await CreateUser({
          uid: authUser?.uid as string,
          email: authUser?.email as string,
          fullName: authUser?.displayName ?? '',
          profilePicture: authUser?.photoURL ?? '',
        })
      }

      userStore.setUser(user)
      router.push({ name: 'Home' })
      return
    }

    if (!authUser) {
      userStore.clearStore()
      router.push({ name: 'Login' })
      return
    }
  })

  firebaseAuthSubscriber.value = subscriber
})

onBeforeUnmount(() => {
  // Unsubscribe to Auth Changes when the app is closed or destroyed
  if (firebaseAuthSubscriber.value) {
    firebaseAuthSubscriber!.value()
  }
})
</script>
