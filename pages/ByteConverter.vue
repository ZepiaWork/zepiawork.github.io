<template>
    <div class="mx-auto max-w-2xl space-y-6 p-6">
        <h2 class="mb-4 text-2xl font-bold text-gray-800">Byte Unit Converter</h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Input section -->
            <div class="space-y-4">
                <label class="block">
                    <span class="text-gray-700">From:</span>
                    <input
                        v-model="inputValue"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                        step="any"
                        type="number"
                    />
                </label>
                <select
                    v-model="fromUnit"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="bytes">Bytes</option>
                    <option value="kilobytes">Kilobytes</option>
                    <option value="megabytes">Megabytes</option>
                    <option value="gigabytes">Gigabytes</option>
                    <option value="terabytes">Terabytes</option>
                </select>
            </div>

            <!-- Output section -->
            <div class="space-y-4">
                <label class="block">
                    <span class="text-gray-700">To:</span>
                    <input
                        v-model="outputValue"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        readonly
                        type="number"
                    />
                </label>
                <select
                    v-model="toUnit"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="bytes">Bytes</option>
                    <option value="kilobytes">Kilobytes</option>
                    <option value="megabytes">Megabytes</option>
                    <option value="gigabytes">Gigabytes</option>
                    <option value="terabytes">Terabytes</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"

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
    terabytes: 1024 ** 4
}

// Convert between units
const convert = () => {
    if (!inputValue.value) {
        outputValue.value = 0
        return
    }

    const fromMultiplier = units[fromUnit.value as keyof typeof units]
    const toMultiplier = units[toUnit.value as keyof typeof units]

    // Convert to bytes first, then to target unit
    const bytes = inputValue.value * fromMultiplier
    outputValue.value = parseFloat((bytes / toMultiplier).toFixed(8))
}

// Watch for changes in input value or units
watch([inputValue, fromUnit, toUnit], () => {
    convert()
})
</script>
