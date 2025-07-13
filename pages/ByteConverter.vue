<template>
    <v-container class="max-width-lg">
        <v-row justify="center">
            <v-col
                cols="12"
                md="8"
            >
                <v-card class="pa-6">
                    <v-card-title class="text-h4 text-center mb-6"> Byte Unit Converter </v-card-title>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-card
                                variant="outlined"
                                class="pa-4"
                            >
                                <v-card-subtitle class="text-subtitle-1 mb-2"> From </v-card-subtitle>

                                <v-text-field
                                    v-model="inputValue"
                                    label="Enter value"
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
                                    label="Select unit"
                                    variant="outlined"
                                    density="comfortable"
                                />
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
                                <v-card-subtitle class="text-subtitle-1 mb-2"> To </v-card-subtitle>

                                <v-text-field
                                    v-model="outputValue"
                                    label="Result"
                                    type="number"
                                    variant="outlined"
                                    density="comfortable"
                                    readonly
                                    class="mb-4"
                                />
                                <v-select
                                    v-model="toUnit"
                                    :items="unitOptions"
                                    label="Select unit"
                                    variant="outlined"
                                    density="comfortable"
                                />
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
    { title: "Bytes", value: "bytes" },
    { title: "Kilobytes", value: "kilobytes" },
    { title: "Megabytes", value: "megabytes" },
    { title: "Gigabytes", value: "gigabytes" },
    { title: "Terabytes", value: "terabytes" },
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
