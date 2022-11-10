<template>
  <v-container fluid class="h-screen w-100">
    <v-row align="center" justify="center" class="h-100">
      <v-col cols="3">
        <v-card class="px-2 py-4" elevation="12">
          <v-card-title
            v-if="!sendSuccess"
            class="text-h4 font-weight-bold text-center text-primary"
          >
            Forgot Password
          </v-card-title>
          <v-card-title
            v-else
            class="text-h4 text-success text-center font-weight-bold"
          >
            Success!
          </v-card-title>
          <v-container fluid v-if="!sendSuccess">
            <v-row align="center" justify="center">
              <v-col cols="11">
                <v-form
                  v-model="forgotForm"
                  ref="forgotFormRef"
                  lazy-validation
                  @submit.prevent="processForgotPassword"
                >
                  <v-text-field
                    v-model="email"
                    label="Email"
                    placeholder="Enter the email used for your account"
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

                  <br />

                  <v-btn
                    block
                    variant="flat"
                    color="primary"
                    type="submit"
                    :disabled="!forgotForm"
                    :loading="loading"
                  >
                    Send Password Reset Link
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
          <v-container fluid v-else>
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-2 text-center mt-6">
                  Please proceed with the instructions sent out to your email
                </div>
              </v-col>
              <v-col>
                <v-btn
                  block
                  color="primary"
                  variant="outlined"
                  @click="router.push({ name: 'Login' })"
                >
                  Back to Login
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '@/store/notify'
import { SendForgotPassword } from '@/services/auth'

const router = useRouter()
const notify = useNotify()

const email = ref('')
const forgotForm = ref(false)
const forgotFormRef = ref(null)
const loading = ref(false)
const sendSuccess = ref(false)

async function processForgotPassword() {
  const isValid = forgotFormRef?.value?.validate()
  loading.value = true

  if (!isValid) {
    notify.show({
      text: 'Double check your details',
      type: 'error',
    })
    loading.value = false
    return
  }

  try {
    await SendForgotPassword(email.value)
    sendSuccess.value = true
  } catch (err) {
    notify.show({
      title: 'Error',
      text: err?.message || 'Something went wrong',
      type: 'error',
    })
  }

  loading.value = false
}
</script>
