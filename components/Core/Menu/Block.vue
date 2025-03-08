<template>
    <NuxtLink
        class="bg-red-500 text-white aspect-square flex justify-center items-center text-center border-2 border-white rounded-2xl"
        :to="props.menu.path"
    >
        <span>{{ props.menu.name }}</span>
    </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
    menu: {
        type: Object,
        required: true,
    },
})
</script>

<style></style>
