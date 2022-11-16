<script setup lang="ts">
import { ref, computed } from 'vue'
import { notification } from 'ant-design-vue'
import Logo from 'src/assets/logo.png'
import { useUserStore } from 'src/store'
import { Logout, ChangePassword } from 'src/services'

const userStore = useUserStore()
const logoutLoading = ref(false)
const profileModal = ref(false)
const passwordModal = ref(false)
const loading = ref(false)
const changePasswordForm = ref({
  oldPassword: '',
  newPassword: '',
})

const isEmailSignIn = computed(
  () => userStore.authUser?.providerData[0].providerId === 'password'
)

async function logout() {
  logoutLoading.value = true
  await Logout()
  userStore.clearStore()
  logoutLoading.value = false
}

function openChangePass() {
  passwordModal.value = true
  profileModal.value = false
}

async function confirmChangePassword() {
  loading.value = true
  try {
    await ChangePassword(
      changePasswordForm.value.oldPassword,
      changePasswordForm.value.newPassword
    )
    passwordModal.value = false
    notification['success']({
      message: 'Change password success!',
      description: 'Your password has been changed!',
    })
  } catch (err: any) {
    let message = ''
    switch (err?.code) {
      case 'auth/wrong-password':
        message = 'Current password does not match'
        break
      default:
        message = 'Something went wrong'
    }

    notification['error']({
      message: 'Error while changing password',
      description: message,
    })
  }
  loading.value = false
}
</script>

<template>
  <a-layout>
    <a-layout-header
      :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '70px' }"
    >
      <a-row
        type="flex"
        align="top"
        justify="between"
        :style="{ height: '100%', padding: '10px' }"
      >
        <a-col :flex="22">
          <a-typography-title :style="{ color: 'white' }"
            >My Expenses Tracker</a-typography-title
          >
        </a-col>
        <a-col flex="auto">
          <a-button
            type="text"
            :style="{ color: 'white' }"
            size="large"
            @click="profileModal = true"
            >Profile</a-button
          >
        </a-col>
        <a-col flex="auto">
          <a-button type="dashed" size="large" @click="logout">Logout</a-button>
        </a-col>
      </a-row>
    </a-layout-header>

    <a-layout-content
      :style="{ padding: '0 70px', marginTop: '70px', height: '100vh' }"
    >
      <router-view />

      <!-- Profile Modal -->
      <a-modal
        v-model:visible="profileModal"
        @ok="profileModal = false"
        title="Profile"
      >
        <a-row
          type="flex"
          align="middle"
          justify="center"
          :style="{ textAlign: 'center' }"
        >
          <a-col :span="22" :style="{ margin: '20px' }">
            <a-image  
              v-if="userStore.user?.profilePicture"
              :width="250"
              :src="userStore.user?.profilePicture" 
              :fallback="Logo"
              alt="profile_picture" 
              :preview="false" 
            />
            <a-image  
              v-else
              :width="250"
              :src="Logo" 
              alt="profile_picture" 
              :preview="false" 
            />
          </a-col>
          <a-col :span="22">
            <a-typography-title>{{
              userStore.user?.fullName || ''
            }}</a-typography-title>
          </a-col>
          <a-col :span="22">
            <a-typography-paragraph>{{
              userStore.user?.email || ''
            }}</a-typography-paragraph>
          </a-col>
          <a-col :span="22" v-if="isEmailSignIn">
            <a-button
              type="default"
              :style="{ marginTop: '20px' }"
              @click="openChangePass"
              >Change Password</a-button
            >
          </a-col>
        </a-row>
      </a-modal>

      <!-- Change Password Modal -->
      <a-modal
        v-model:visible="passwordModal"
        title="Change Password"
        @ok="confirmChangePassword"
        :ok-button-props="{
          loading,
          disabled:
            !changePasswordForm.oldPassword || !changePasswordForm.newPassword,
        }"
      >
        <a-row type="flex" align="middle" justify="center">
          <a-col :span="22">
            <a-form layout="vertical">
              <a-form-item label="Old Password" name="oldPassword">
                <a-input-password
                  v-model:value="changePasswordForm.oldPassword"
                  label="Current Password"
                  placeholder="enter your current password..."
                  :readonly="loading"
                />
              </a-form-item>

              <a-form-item label="New Password" name="newPassword">
                <a-input-password
                  v-model:value="changePasswordForm.newPassword"
                  label="New Password"
                  placeholder="enter your new desired password..."
                  :readonly="loading"
                />
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>
