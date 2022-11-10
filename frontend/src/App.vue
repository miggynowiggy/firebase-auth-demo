<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { onAuthStateChanged, Unsubscribe } from 'firebase/auth'
import { AUTH } from './configs/firebase';
import { useUser } from './store/user';
import { useRouter } from 'vue-router';
import { useNotify } from './store/notify';

const userStore = useUser()
const router = useRouter()
const notify = useNotify()
const firebaseAuthSubscriber = ref<Unsubscribe | null>(null);

onMounted(() => {
  // Subscribe to firebase changes when the app is initialized
  const subscriber = onAuthStateChanged(AUTH, async (authUser) => {
    userStore.setAuthUser(authUser);

    if (authUser && !authUser?.emailVerified) {
      console.log('email not verified')
      router.push({ name: 'Login' })
      notify.show({
        title: 'Error',
        text: 'Please verify your email first before logging-in',
        type: 'error'
      })
      return;
    } 
    
    if (authUser) {
      router.push({ name: 'Home' })
      return;
    }

    if (!authUser) {
      userStore.clearStore();
      router.push({ name: 'Login' })
      return
    }
  });

  firebaseAuthSubscriber.value = subscriber;
})

onBeforeUnmount(() => {
  // Unsubscribe to Auth Changes when the app is closed or destroyed
  if (firebaseAuthSubscriber.value) {
    firebaseAuthSubscriber!.value()
  }
})

</script>
