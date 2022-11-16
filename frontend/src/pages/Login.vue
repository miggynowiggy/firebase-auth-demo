<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
} from '@ant-design/icons-vue'
import { logEvent } from 'firebase/analytics'
import { ANALYTICS } from 'src/configs/firebase'
import { LoginByEmailPassword, LoginByGoogle } from 'src/services'
import { useUserStore } from 'src/store/user'

interface ILoginForm {
  email: string
  password: string
}

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function emailSignIn() {
  loading.value = true

  try {
    await LoginByEmailPassword(email.value, password.value)
    logEvent(ANALYTICS, 'email_login')
  } catch (err: any) {
    let message = ''

    if (err.hasOwnProperty('code')) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid Email / Password'
          break

        default:
          message = 'Something went wrong'
      }
    }

    notification['error']({
      message: 'Error!',
      description: message,
    })
  }

  loading.value = false
}

async function googleSignIn() {
  loading.value = true

  try {
    await LoginByGoogle()
    logEvent(ANALYTICS, 'google_login')
  } catch (err: any) {
    let message = ''

    if (err.hasOwnProperty('code')) {
      switch (err?.code) {
        case 'auth/popup-closed-by-user':
          message = 'Google Sign In cancelled'
          break
        default:
          message = 'Something went wrong'
      }
    }

    notification['error']({
      message: 'Error!',
      description: message,
    })
  }
  loading.value = false
}
</script>

<template>
  <a-row
    type="flex"
    align="middle"
    justify="center"
    :style="{ height: '100%', width: '100%' }"
  >
    <a-col :xs="22" :sm="22" :md="7">
      <a-card title="Login" hoverable bordered>
        <a-form layout="vertical">
          <a-form-item label="Email" name="email">
            <a-input v-model:value="email" type="email">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password v-model:value="password">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="text"
              @click="router.push({ name: 'ForgotPassword' })"
            >
              Forgot Password?
            </a-button>
          </a-form-item>

          <a-form-item>
            <a-button
              :disabled="!email || !password"
              type="primary"
              @click="emailSignIn"
              :loading="loading"
              block
            >
              Log in
            </a-button>
          </a-form-item>

          <a-form-item>
            <a-button
              type="default"
              block
              :loading="loading"
              @click="router.push({ name: 'Register' })"
            >
              Register
            </a-button>
          </a-form-item>
        </a-form>

        <template #actions>
          <a-row type="flex" align="center" justify="around">
            <a-col
              :span="21"
              :style="{ marginTop: '20px', marginBottom: '20px' }"
            >
              <a-button
                type="primary"
                block
                :loading="loading"
                @click="googleSignIn"
              >
                Login with Google
                <template #icon>
                  <GoogleOutlined />
                </template>
              </a-button>
            </a-col>
          </a-row>
        </template>
      </a-card>
    </a-col>
  </a-row>
</template>
