<template>
  <v-container fluid class="h-screen w-100">
    <v-row align="center" justify="center" class="h-100">
      <v-col cols="3">
        <v-card class="px-2 py-4" elevation="12">
          <v-card-title
            class="text-h4 font-weight-bold text-center text-primary"
          >
            Login
          </v-card-title>
          <v-container fluid>
            <v-row align="center" justify="center">
              <v-col cols="11">
                <v-form
                  v-model="loginForm"
                  ref="loginFormRef"
                  lazy-validation
                  @submit.prevent="emailSignIn"
                >
                  <v-text-field
                    v-model="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    color="primary"
                    required
                    clearable
                    :readonly="loading"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
                    ]"
                  />

                  <v-text-field
                    v-model="password"
                    label="Password"
                    variant="outlined"
                    color="primary"
                    class="mt-3"
                    required
                    :rules="[
                      (v) => !!v || 'Password is required',
                      (v) =>
                        v.length >= 8 || 'Password should be 8 characters long',
                    ]"
                    :type="showPassword ? 'text' : 'password'"
                    :readonly="loading"
                    :append-inner-icon="
                      showPassword
                        ? 'fa-regular fa-eye'
                        : 'fa-regular fa-eye-slash'
                    "
                    @click:append-inner="showPassword = !showPassword"
                  >
                  </v-text-field>

                  <br />

                  <v-btn
                    block
                    variant="flat"
                    color="primary"
                    type="submit"
                    :disabled="!loginForm"
                    :loading="loading"
                  >
                    Login
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    color="primary"
                    block
                    class="mt-6"
                    :disabled="loading"
                    @click="router.push({ name: 'Register' })"
                  >
                    Register
                  </v-btn>

                  <v-btn
                    variant="text"
                    color="black"
                    class="mt-6"
                    block
                    @click="router.push({ name: 'ForgotPassword' })"
                    :disabled="loading"
                  >
                    Forgot Password?
                  </v-btn>
                </v-form>
              </v-col>
              <v-col cols="12" class="my-2">
                <v-divider />
              </v-col>
              <v-col cols="11">
                <v-btn
                  block
                  variant="outlined"
                  color="black"
                  append-icon="fa-brands fa-google"
                  :loading="loading"
                  @click="googleSignIn"
                >
                  Login with Google
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useNotify } from "@/store/notify"
import { LoginByEmailPassword, LoginByGoogle } from '@/services/auth'

const router = useRouter()
const notify = useNotify()

const email = ref("")
const password = ref("")
const showPassword = ref(false)
const loginForm = ref(false)
const loginFormRef = ref(null)
const loading = ref(false)

async function emailSignIn() {
  const isValid = loginFormRef?.value?.validate()
  loading.value = true

  if (!isValid) {
    notify.show({
      text: "Double check your credentials",
      type: "error",
    })
    loading.value = false
    return
  }

  try {
    await LoginByEmailPassword(email.value, password.value)
  } catch (err) {
    let message = ''

    switch (err?.code) {
      case 'auth/user-not-found':
        message = 'Invalid Email / Password'
        break
      default:
        message = 'Something went wrong'
    }

    notify.show({
      title: "Error",
      text: message,
      type: "error",
    })
  }

  loading.value = false
}

async function googleSignIn() {
  loading.value = true

  try {
    await LoginByGoogle()
  } catch (err) {
    let message = ''

    switch (err?.code) {
      case 'auth/popup-closed-by-user':
        message = 'Google Sign In cancelled'
        break
      default:
        message = 'Something went wrong'
    }

    notify.show({
      title: "Error",
      text: message,
      type: "error",
    })
  }
  loading.value = false
}
</script>
