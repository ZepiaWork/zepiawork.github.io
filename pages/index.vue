<template>
    <v-container class="pa-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="8"
                lg="6"
            >
                <v-card class="elevation-3">
                    <v-card-title class="text-h4 text-center py-6"> Available Tools </v-card-title>
                    <v-card-text class="pa-6">
                        <v-row>
                            <v-col
                                v-for="(item, index) in menuList"
                                :key="index"
                                cols="12"
                                sm="6"
                            >
                                <v-btn
                                    :to="item.path"
                                    block
                                    size="large"
                                    variant="outlined"
                                    color="primary"
                                    class="text-h6 py-6"
                                >
                                    {{ item.name }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
const menuList = [
    {
        name: "Percentage Calculator",
        path: "/percentagecalculator",
    },
    {
        name: "Byte Converter",
        path: "/byteconverter",
    },
]
</script>

<style></style>
