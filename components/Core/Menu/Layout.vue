<template>
    <div class="grid grid-cols-2 gap-4 p-4 lg:grid-cols-6">
        <CoreMenuBlock
            v-for="(menu, index) of menuList"
            :key="index"
            :menu="menu"
        />
    </div>
</template>

<script lang="ts" setup>
const menuList = [
    {
        name: "Percentage Calculator",
        path: "/percentagecalculator"
    },
    {
        name: "Byte Converter",
        path: "/byteconverter"
    }
]
</script>

<style></style>
