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
                    <v-card-title class="text-h5 text-md-h4 text-center py-6"> {{ $t('available_tools') }} </v-card-title>
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
                                    :prepend-icon="item.icon"
                                    block
                                    size="x-large"
                                    variant="outlined"
                                    color="primary"
                                    class="text-body-1 text-md-h6 py-6"
                                    height="auto"
                                    min-height="80"
                                >
                                    {{ $t(item.name) }}
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
        name: "percentage_calculator",
        path: "/percentagecalculator",
        icon: "mdi-percent",
    },
    {
        name: "byte_converter",
        path: "/byteconverter",
        icon: "mdi-harddisk",
    },
    {
        name: "car_detail_generator",
        path: "/cardetailgenerator",
        icon: "mdi-car",
    },
    {
        name: "thai_id_generator",
        path: "/thaiidgenerator",
        icon: "mdi-card-account-details",
    },
]
</script>

<style></style>
