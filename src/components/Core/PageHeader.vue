<template>
  <div class="mb-4 d-flex align-center">
    <v-btn
      to="/"
      variant="tonal"
      color="primary"
      size="default"
      prepend-icon="mdi-arrow-left"
      rounded="pill"
      class="px-4 font-weight-medium"
    >
      {{ $t('back_to_home') }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
