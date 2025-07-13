<template>
    <NuxtLayout>
        <v-app>
            <NuxtPage />
        </v-app>
        <div>v0.1</div>
    </NuxtLayout>
</template>

<script setup lang="ts"></script>
<style>
.layout-enter-active,
.layout-leave-active {
    transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
    opacity: 0;
    transform: translateY(-20px);
    filter: blur(1rem);
}
</style>
