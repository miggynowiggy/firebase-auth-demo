<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'
import { AuthError } from '@firebase/auth'
import { useUserStore } from 'src/store/user'
import { RegisterByEmailPassword, CreateUser } from 'src/services'

const router = useRouter()
const userStore = useUserStore()

const newUser = ref({
  email: '',
  password: '',
  fullName: '',
})
const showPassword = ref(false)
const registerForm = ref(false)
const registerFormRef = ref(null)
const loading = ref(false)

async function register() {
  loading.value = true

  try {
    const authUser = await RegisterByEmailPassword(
      newUser.value.email,
      newUser.value.password
    )

    await CreateUser({
      email: authUser?.email ?? '',
      uid: authUser?.uid ?? '',
      fullName: newUser.value.fullName ?? '',
    })

    notification['success']({
      message: 'Check your Email!',
      description: 'Check your email to proceed with the verification process',
    })
  } catch (err: any) {
    notification['error']({
      message: 'Error!',
      description: err?.message || 'Something went wrong while registering',
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
    :style="{ height: '100%' }"
  >
    <a-col :span="6">
      <a-card title="Register" hoverable>
        <a-form layout="vertical">
          <a-form-item label="Full Name" name="fullName">
            <a-input v-model:value="newUser.fullName">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="Email" name="email">
            <a-input v-model:value="newUser.email">
              <template #prefix>
                <MailOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password v-model:value="newUser.password">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              :disabled="
                !newUser.fullName || !newUser.email || !newUser.password
              "
              type="primary"
              @click="register"
              :loading="loading"
              :style="{ marginTop: '10px' }"
              block
            >
              Register
            </a-button>
          </a-form-item>

          <a-form-item>
            <a-button type="text" block @click="router.push({ name: 'Login' })">
              Back to Login
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>
