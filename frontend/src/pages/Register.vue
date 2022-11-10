<template>
  <v-container fluid class="h-screen w-100">
    <v-row align="center" justify="center" class="h-100">
      <v-col cols="3">
        <v-card class="px-2 py-4" elevation="12">
          <v-card-title
            class="text-h4 font-weight-bold text-center text-primary"
          >
            Register
          </v-card-title>
          <v-container fluid>
            <v-row align="center" justify="center">
              <v-col cols="11">
                <v-form
                  v-model="registerForm"
                  ref="registerFormRef"
                  lazy-validation
                  @submit.prevent="register"
                >
                  <v-text-field
                    v-model="newUser.fullName"
                    label="Full Name"
                    placeholder="Enter your full name here"
                    variant="outlined"
                    type="text"
                    color="primary"
                    required
                    clearable
                    :readonly="loading"
                    :rules="[(v) => !!v || 'Name is required']"
                  />

                  <v-text-field
                    v-model="newUser.email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    color="primary"
                    class="mt-3"
                    required
                    clearable
                    :readonly="loading"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
                    ]"
                  />

                  <v-text-field
                    v-model="newUser.password"
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
                    :disabled="!registerForm"
                    :loading="loading"
                  >
                    Register
                  </v-btn>

                  <v-btn
                    variant="text"
                    color="black"
                    block
                    class="mt-4"
                    @click="router.push({ name: 'Login' })"
                  >
                    Back to Login
                  </v-btn>
                </v-form>
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
import { RegisterByEmailPassword, SendEmailVerification } from "@/services/auth";

const router = useRouter()
const notify = useNotify()

const newUser = ref({
  email: "",
  password: "",
  fullName: "",
})
const showPassword = ref(false)
const registerForm = ref(false)
const registerFormRef = ref(null)
const loading = ref(false)

async function register() {
  const isValid = registerFormRef?.value?.validate()
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
    const user = await RegisterByEmailPassword(newUser.value.email, newUser.value.password)
    await SendEmailVerification(user)
    notify.show({
      title: 'Registration Success!',
      text: 'Please check your email for verification steps',
      type: 'success'
    })
  } catch (err) {
    notify.show({
      title: 'Error',
      text: err?.message || "Something went wrong while registering",
      type: 'error'
    })
  }

  loading.value = false
}
</script>
