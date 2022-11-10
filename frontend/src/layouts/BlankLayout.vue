<template>
  <v-app>
    <v-main>
      <Notify />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Notify from '@/components/Notify.vue'
</script>
