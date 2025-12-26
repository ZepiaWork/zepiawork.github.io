<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="10"
                lg="8"
            >
                <v-card class="elevation-3">
                    <v-card-title class="text-h5 text-md-h4 text-center py-6 bg-primary text-white">
                        {{ $t('percentage_calculator_title') }}
                    </v-card-title>

                    <v-card-text class="pa-6">
                        <v-tabs
                            v-model="activeTab"
                            color="primary"
                            class="mb-6"
                        >
                            <v-tab value="basic">{{ $t('basic_percentage') }}</v-tab>
                            <v-tab value="increase">{{ $t('percentage_increase') }}</v-tab>
                            <v-tab value="decrease">{{ $t('percentage_decrease') }}</v-tab>
                            <v-tab value="of">{{ $t('percentage_of') }}</v-tab>
                            <v-tab value="change">{{ $t('percentage_change') }}</v-tab>
                        </v-tabs>

                        <v-tabs-window v-model="activeTab">
                            <!-- Basic Percentage: X is what percent of Y? -->
                            <v-tabs-window-item value="basic">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-h6 mb-4"> {{ $t('what_percent_is_x_of_y') }} </v-card-subtitle>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="basic.value"
                                                :label="$t('value_x')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="basic.total"
                                                :label="$t('total_y')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                :model-value="basicResult"
                                                :label="$t('result_percent')"
                                                variant="outlined"
                                                density="comfortable"
                                                readonly
                                                suffix="%"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-tabs-window-item>

                            <!-- Percentage Increase -->
                            <v-tabs-window-item value="increase">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-h6 mb-4"> {{ $t('add_x_percent_to_number') }} </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="increase.value"
                                                :label="$t('original_value')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="increase.percentage"
                                                :label="$t('percentage_to_add')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                                suffix="%"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                :model-value="increaseResult"
                                                :label="$t('result')"
                                                variant="outlined"
                                                density="comfortable"
                                                readonly
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-tabs-window-item>

                            <!-- Percentage Decrease -->
                            <v-tabs-window-item value="decrease">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-h6 mb-4"> {{ $t('subtract_x_percent_from_number') }} </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="decrease.value"
                                                :label="$t('original_value')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="decrease.percentage"
                                                :label="$t('percentage_to_subtract')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                                suffix="%"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                :model-value="decreaseResult"
                                                :label="$t('result')"
                                                variant="outlined"
                                                density="comfortable"
                                                readonly
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-tabs-window-item>

                            <!-- Percentage Of -->
                            <v-tabs-window-item value="of">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-h6 mb-4"> {{ $t('what_is_x_percent_of_y') }} </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="of.percentage"
                                                :label="$t('percentage')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                                suffix="%"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="of.value"
                                                :label="$t('value')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                :model-value="ofResult"
                                                :label="$t('result')"
                                                variant="outlined"
                                                density="comfortable"
                                                readonly
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-tabs-window-item>

                            <!-- Percentage Change -->
                            <v-tabs-window-item value="change">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-h6 mb-4">
                                        {{ $t('percentage_change_from_x_to_y') }}
                                    </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="change.oldValue"
                                                :label="$t('original_value')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="change.newValue"
                                                :label="$t('new_value')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                step="any"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                :model-value="changeResult"
                                                :label="$t('percentage_change')"
                                                variant="outlined"
                                                density="comfortable"
                                                readonly
                                                suffix="%"
                                                :color="getChangeColor(changeResult)"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"

definePageMeta({
    layout: "single-page",
})

const activeTab = ref("basic")

// Basic Percentage: X is what percent of Y?
const basic = ref({
    value: 0,
    total: 0,
})

const basicResult = computed(() => {
    if (!basic.value.total || basic.value.total === 0) return "0.00"
    return ((basic.value.value / basic.value.total) * 100).toFixed(2)
})

// Percentage Increase: Add X% to a number
const increase = ref({
    value: 0,
    percentage: 0,
})

const increaseResult = computed(() => {
    if (!increase.value.value) return "0.00"
    const result = increase.value.value * (1 + increase.value.percentage / 100)
    return result.toFixed(2)
})

// Percentage Decrease: Subtract X% from a number
const decrease = ref({
    value: 0,
    percentage: 0,
})

const decreaseResult = computed(() => {
    if (!decrease.value.value) return "0.00"
    const result = decrease.value.value * (1 - decrease.value.percentage / 100)
    return result.toFixed(2)
})

// Percentage Of: What is X% of Y?
const of = ref({
    percentage: 0,
    value: 0,
})

const ofResult = computed(() => {
    if (!of.value.value) return "0.00"
    const result = (of.value.percentage / 100) * of.value.value
    return result.toFixed(2)
})

// Percentage Change: Percentage change from X to Y
const change = ref({
    oldValue: 0,
    newValue: 0,
})

const changeResult = computed(() => {
    if (!change.value.oldValue || change.value.oldValue === 0) return "0.00"
    const result = ((change.value.newValue - change.value.oldValue) / change.value.oldValue) * 100
    return result.toFixed(2)
})

// Helper function to get color based on percentage change
const getChangeColor = (result: string) => {
    const value = parseFloat(result)
    if (value > 0) return "success"
    if (value < 0) return "error"
    return "primary"
}
</script>

<style></style>
