<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="10"
                lg="8"
                xl="6"
            >
                <v-card class="elevation-3">
                    <v-card-title class="text-h5 text-md-h4 text-center py-6"> Available Tools </v-card-title>
                    <v-card-text class="pa-4 pa-md-6">
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
                                    size="x-large"
                                    variant="outlined"
                                    color="primary"
                                    class="text-body-1 text-md-h6 py-6"
                                    height="auto"
                                    min-height="80"
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
    {
        name: "Car Detail Generator",
        path: "/cardetailgenerator",
    },
    {
        name: "Thai ID Generator",
        path: "/thaiidgenerator",
    },
]
</script>

<style></style>
