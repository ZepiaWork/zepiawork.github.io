<template>
    <v-container class="pa-4 pa-md-6">
        <PageHeader />
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
                                    min="0"
                                    density="comfortable"
                                />

                                <v-select
                                    v-model="fromUnit"
                                    :items="unitOptions"
                                    item-title="title"
                                    item-value="value"
                                    :label="t('select_unit')"
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
                                    :model-value="outputValue"
                                    :label="t('result')"
                                    readonly
                                    density="comfortable"
                                />

                                <v-select
                                    v-model="toUnit"
                                    :items="unitOptions"
                                    item-title="title"
                                    item-value="value"
                                    :label="t('select_unit')"
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

                    <!-- Full conversion breakdown table -->
                    <v-divider class="my-6" />

                    <h3 class="text-h6 mb-4">
                        {{ t('all_units_table') }}
                    </h3>

                    <v-table density="compact">
                        <thead>
                            <tr>
                                <th class="text-left">
                                    {{ t('unit') }}
                                </th>
                                <th class="text-left">
                                    {{ t('value') }}
                                </th>
                                <th class="text-right">
                                    {{ t('copy') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in allConversions"
                                :key="item.key"
                            >
                                <td>{{ t(item.key) }}</td>
                                <td>{{ item.formatted }}</td>
                                <td class="text-right">
                                    <v-btn
                                        icon="mdi-content-copy"
                                        size="x-small"
                                        variant="text"
                                        @click="copyValue(item.value)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import PageHeader from "@/components/Core/PageHeader.vue"

const { t } = useI18n()

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

function copyValue(val: number) {
    navigator.clipboard.writeText(val.toString())
}

watch([inputValue, fromUnit, toUnit], () => {
    convert()
}, { immediate: true })
</script>

<style scoped>
.font-mono {
    font-family: monospace;
}
</style>
