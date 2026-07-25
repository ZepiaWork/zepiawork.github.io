<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <SettingsDialog />
    <div class="text-center py-2 text-caption text-grey">v0.3</div>
  </v-app>
</template>

<script setup lang="ts">
import SettingsDialog from '@/components/Core/SettingsDialog.vue'
</script>

<style></style>
