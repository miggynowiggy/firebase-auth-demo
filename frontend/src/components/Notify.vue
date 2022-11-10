<template>
  <v-snackbar
    @update:model-value="notify.toggleNotif"
    :model-value="notify.showNotif"
    :timeout="notify.timeout"
    :color="notify.type"
    elevation="24"
    location="top end"
  >
    <div class="text-subtitle-1 font-weight-bold text-white">{{ notify.title }}</div>
    <div class="text-body-1">{{ notify.text }}</div>

    <template v-slot:action>
      <v-btn
        color="white"
        variant="text"
        @click="notify.toggleNotif"
      >
        {{ notify.actionButtonText }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotify } from '@/store/notify';
const notify = useNotify()
</script>
