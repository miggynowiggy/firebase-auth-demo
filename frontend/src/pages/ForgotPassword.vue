<template>
  <a-row type="flex" align="middle" justify="center" :style="{ height: '100%'}">
    <a-col :span="12" v-if="sendSuccess">
      <div v-if="sendSuccess" :style="{ textAlign: 'center' }">
        <a-typography-title >
          Success!
        </a-typography-title>
        <a-typography>
          An email has been sent to you to reset your password
        </a-typography>
        <a-button type="dashed" :style="{ marginTop: '30px'}" @click="router.push({ name: 'Login' })">
          Back to Login
        </a-button>
      </div>
    </a-col>
    <a-col :span="6" v-else>
      <a-card title="Forgot Password">
        <a-form layout="vertical">
          <a-form-item
            label="Email"
            name="email"
          >
            <a-input v-model:value="email">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button 
              :disabled="!email" 
              type="primary"
              block
              :loading="loading"
              @click="processForgotPassword"
            >
              Send Password Reset Link
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'
import { SendForgotPassword } from '@/services'

const router = useRouter()

const email = ref('')
const forgotForm = ref(false)
const forgotFormRef = ref(null)
const loading = ref(false)
const sendSuccess = ref(false)

async function processForgotPassword() {
  loading.value = true

  try {
    await SendForgotPassword(email.value)
    sendSuccess.value = true
  } catch (err) {
    notification['error']({
      message: 'Error!',
      description: "Something went wrong while sending your password reset email",
    })
  }

  loading.value = false
}
</script>
