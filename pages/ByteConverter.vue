<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="10"
                lg="8"
            >
                <v-card class="pa-4 pa-md-6">
                    <v-card-title class="text-h5 text-md-h4 text-center mb-6"> {{ $t('byte_converter_title') }} </v-card-title>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-card
                                variant="outlined"
                                class="pa-4"
                            >
                                <v-card-subtitle class="text-subtitle-1 mb-2"> {{ $t('from') }} </v-card-subtitle>

                                <v-text-field
                                    v-model="inputValue"
                                    :label="$t('enter_value')"
                                    type="number"
                                    variant="outlined"
                                    density="comfortable"
                                    :min="0"
                                    step="any"
                                    class="mb-4"
                                />

                                <v-select
                                    v-model="fromUnit"
                                    :items="unitOptions"
                                    :label="$t('select_unit')"
                                    variant="outlined"
                                    density="comfortable"
                                >
                                    <template #item="{ props, item }">
                                        <v-list-item v-bind="props" :title="$t(item.raw.title)" />
                                    </template>
                                    <template #selection="{ item }">
                                        {{ $t(item.raw.title) }}
                                    </template>
                                </v-select>
                            </v-card>
                        </v-col>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-card
                                variant="outlined"
                                class="pa-4"
                            >
                                <v-card-subtitle class="text-subtitle-1 mb-2"> {{ $t('to') }} </v-card-subtitle>

                                <v-text-field
                                    v-model="outputValue"
                                    :label="$t('result')"
                                    type="number"
                                    variant="outlined"
                                    density="comfortable"
                                    readonly
                                    class="mb-4"
                                />
                                <v-select
                                    v-model="toUnit"
                                    :items="unitOptions"
                                    :label="$t('select_unit')"
                                    variant="outlined"
                                    density="comfortable"
                                >
                                    <template #item="{ props, item }">
                                        <v-list-item v-bind="props" :title="$t(item.raw.title)" />
                                    </template>
                                    <template #selection="{ item }">
                                        {{ $t(item.raw.title) }}
                                    </template>
                                </v-select>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

definePageMeta({
    layout: "single-page",
})

// Input values
const inputValue = ref<number>(0)
const outputValue = ref<number>(0)

// Selected units
const fromUnit = ref<string>("bytes")
const toUnit = ref<string>("bytes")

// Available units and their multipliers (relative to bytes)
const units = {
    bytes: 1,
    kilobytes: 1024,
    megabytes: 1024 ** 2,
    gigabytes: 1024 ** 3,
    terabytes: 1024 ** 4,
}

// Unit options for v-select
const unitOptions = [
    { title: "bytes", value: "bytes" },
    { title: "kilobytes", value: "kilobytes" },
    { title: "megabytes", value: "megabytes" },
    { title: "gigabytes", value: "gigabytes" },
    { title: "terabytes", value: "terabytes" },
]

// Convert between units
const convert = () => {
    if (!inputValue.value) {
        outputValue.value = 0
        return
    }

    const fromMultiplier = units[fromUnit.value as keyof typeof units]
    const toMultiplier = units[toUnit.value as keyof typeof units]

    // Convert to bytes first, then to the target unit
    const bytes = inputValue.value * fromMultiplier
    outputValue.value = parseFloat((bytes / toMultiplier).toFixed(8))
}

// Watch for changes in input value or units
watch([inputValue, fromUnit, toUnit], () => {
    convert()
})
</script>
