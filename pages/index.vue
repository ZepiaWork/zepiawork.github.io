<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="10"
                lg="9"
                xl="8"
            >
                <v-card class="elevation-3">
                    <v-card-title class="text-h5 text-md-h4 text-center py-6 font-weight-bold">
                        {{ $t('available_tools') }}
                    </v-card-title>
                    <v-card-text class="pa-4 pa-md-6">
                        <v-row>
                            <v-col
                                v-for="(item, index) in menuList"
                                :key="index"
                                cols="12"
                                sm="6"
                            >
                                <v-card
                                    :to="item.path"
                                    variant="outlined"
                                    color="primary"
                                    class="tool-card pa-4 h-100 d-flex flex-column"
                                    elevation="1"
                                >
                                    <div class="d-flex align-center mb-2">
                                        <v-icon :icon="item.icon" size="large" color="primary" class="mr-3" />
                                        <h2 class="text-h6 font-weight-bold text-primary mb-0">
                                            {{ $t(item.name) }}
                                        </h2>
                                    </div>
                                    <p class="text-body-2 text-medium-emphasis mb-0 flex-grow-1">
                                        {{ $t(item.descKey) }}
                                    </p>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
const { t } = useI18n()

useHead({
    title: 'Zepia Playground - Multi-utility Toolbox',
})

useSeoMeta({
    title: 'Zepia Playground',
    description: 'A suite of multi-utility web tools including QR generator, Kanji converter, Byte converter, Thai ID validator, Percentage calculator, Car VIN generator, and Expense overview.',
})

const menuList = [
    {
        name: "percentage_calculator",
        descKey: "percentage_calculator_desc",
        path: "/percentagecalculator",
        icon: "mdi-percent",
    },
    {
        name: "byte_converter",
        descKey: "byte_converter_desc",
        path: "/byteconverter",
        icon: "mdi-harddisk",
    },
    {
        name: "car_detail_generator",
        descKey: "car_detail_generator_desc",
        path: "/cardetailgenerator",
        icon: "mdi-car",
    },
    {
        name: "thai_id_generator",
        descKey: "thai_id_generator_desc",
        path: "/thaiidgenerator",
        icon: "mdi-card-account-details",
    },
    {
        name: "expense_overview",
        descKey: "expense_overview_desc",
        path: "/expenseoverview",
        icon: "mdi-chart-box-outline",
    },
    {
        name: "kanji_to_romanji",
        descKey: "kanji_to_romanji_desc",
        path: "/kanjitoromanji",
        icon: "mdi-translate",
    },
    {
        name: "qr_code_generator",
        descKey: "qr_code_generator_desc",
        path: "/qrcodegenerator",
        icon: "mdi-qrcode",
    },
]
</script>

<style scoped>
.tool-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}
.tool-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12) !important;
}
</style>
