<template>
  <v-app>
    <AppHeader />
    <v-main>
      <router-view />
    </v-main>
    <SettingsDialog />
    <footer class="text-center py-3 text-caption text-medium-emphasis">
      <span>{{ $t('app_title') }} &bull; v0.3</span>
    </footer>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from '@/components/Core/AppHeader.vue'
import SettingsDialog from '@/components/Core/SettingsDialog.vue'
</script>

<style></style>
