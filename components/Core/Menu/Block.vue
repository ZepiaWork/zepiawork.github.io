<template>
    <NuxtLink
        :to="props.menu.path"
        class="flex aspect-square items-center justify-center rounded-2xl border-2 border-white bg-red-500 text-center text-white"
    >
        <span>{{ props.menu.name }}</span>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { MenuItem } from "~/interface/MenuItem"

const props = defineProps({
    menu: {
        type: Object as PropType<MenuItem>,
        required: true,
    },
})
</script>

<style></style>
