<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="10"
                lg="8"
            >
                <v-card class="pa-4 pa-md-6 elevation-3">
                    <v-card-title class="text-h5 text-md-h4 text-center mb-6"> {{ t('byte_converter_title') }} </v-card-title>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-card
                                variant="outlined"
                                class="pa-4"
                            >
                                <v-card-subtitle class="text-subtitle-1 mb-2"> {{ t('from') }} </v-card-subtitle>

                                <v-text-field
                                    v-model.number="inputValue"
                                    :label="t('enter_value')"
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
                                    :label="t('select_unit')"
                                    variant="outlined"
                                    density="comfortable"
                                >
                                    <template #item="{ props, item }">
                                        <v-list-item v-bind="props" :title="t(item.raw.title)" />
                                    </template>
                                    <template #selection="{ item }">
                                        {{ t(item.raw.title) }}
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
                                <v-card-subtitle class="text-subtitle-1 mb-2"> {{ t('to') }} </v-card-subtitle>

                                <v-text-field
                                    v-model="outputValue"
                                    :label="t('result')"
                                    type="number"
                                    variant="outlined"
                                    density="comfortable"
                                    readonly
                                    class="mb-4"
                                />
                                <v-select
                                    v-model="toUnit"
                                    :items="unitOptions"
                                    :label="t('select_unit')"
                                    variant="outlined"
                                    density="comfortable"
                                >
                                    <template #item="{ props, item }">
                                        <v-list-item v-bind="props" :title="t(item.raw.title)" />
                                    </template>
                                    <template #selection="{ item }">
                                        {{ t(item.raw.title) }}
                                    </template>
                                </v-select>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Full Conversion Table Feature -->
                    <v-card variant="outlined" class="pa-4 mt-6">
                        <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0">
                            {{ t('all_units_table') }}
                        </v-card-title>
                        <v-table density="comfortable">
                            <thead>
                                <tr>
                                    <th class="text-left">{{ t('unit') }}</th>
                                    <th class="text-left">{{ t('value') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="unit in allConversions" :key="unit.key">
                                    <td class="font-weight-medium">{{ t(unit.key) }}</td>
                                    <td class="font-mono">{{ unit.formatted }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"

definePageMeta({
    layout: "single-page",
})

const { t } = useI18n()

useHead({
    title: t('byte_converter_title') + ' | Zepia Playground',
})

useSeoMeta({
    title: t('byte_converter_title'),
    description: t('byte_converter_desc'),
})

// Input values
const inputValue = ref<number>(0)
const outputValue = ref<number>(0)

// Selected units
const fromUnit = ref<string>("bytes")
const toUnit = ref<string>("kilobytes")

// Available units and their multipliers (relative to bytes)
const units = {
    bytes: 1,
    kilobytes: 1024,
    megabytes: 1024 ** 2,
    gigabytes: 1024 ** 3,
    terabytes: 1024 ** 4,
}

const unitOptions = [
    { title: "bytes", value: "bytes" },
    { title: "kilobytes", value: "kilobytes" },
    { title: "megabytes", value: "megabytes" },
    { title: "gigabytes", value: "gigabytes" },
    { title: "terabytes", value: "terabytes" },
]

// Convert between selected units
const convert = () => {
    const val = Number(inputValue.value) || 0
    if (!val) {
        outputValue.value = 0
        return
    }

    const fromMultiplier = units[fromUnit.value as keyof typeof units]
    const toMultiplier = units[toUnit.value as keyof typeof units]

    const bytes = val * fromMultiplier
    outputValue.value = parseFloat((bytes / toMultiplier).toFixed(8))
}

// Compute table for all units
const allConversions = computed(() => {
    const val = Number(inputValue.value) || 0
    const fromMultiplier = units[fromUnit.value as keyof typeof units]
    const baseBytes = val * fromMultiplier

    return Object.entries(units).map(([key, multiplier]) => {
        const converted = baseBytes / multiplier
        return {
            key,
            value: converted,
            formatted: converted.toLocaleString(undefined, { maximumFractionDigits: 8 }),
        }
    })
})

watch([inputValue, fromUnit, toUnit], () => {
    convert()
})
</script>

<style scoped>
.font-mono {
    font-family: monospace;
}
</style>
