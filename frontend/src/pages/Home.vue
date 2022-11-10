<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="10">
        <div class="text-h2 font-weight-bold primary-text text-center my-6">HOME PAGE BRUH</div>
        <v-btn
          block
          color="success"
          @click="Logout"
        >
          LOG OUT MUNA PRE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Logout } from '@/services/auth';

</script>