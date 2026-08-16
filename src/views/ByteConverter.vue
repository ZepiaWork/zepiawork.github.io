<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <v-card class="pa-4 pa-md-6 elevation-3 rounded-xl overflow-hidden">
          <v-card-title class="text-h5 text-md-h4 text-center font-weight-bold mb-4">
            {{ t('byte_converter_title') }}
          </v-card-title>

          <!-- Mode Toggle: Binary (1024) vs Decimal (1000) vs Bits -->
          <div class="d-flex justify-center mb-6">
            <v-btn-toggle
              v-model="conversionMode"
              mandatory
              color="primary"
              variant="outlined"
              rounded="pill"
              density="comfortable"
            >
              <v-btn value="binary">{{ t('mode_binary') }}</v-btn>
              <v-btn value="decimal">{{ t('mode_decimal') }}</v-btn>
              <v-btn value="bits">{{ t('mode_bits') }}</v-btn>
            </v-btn-toggle>
          </div>

          <v-row>
            <!-- From Section -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4 rounded-lg">
                <v-card-subtitle class="text-subtitle-1 font-weight-bold mb-2 px-0">
                  {{ t('from') }}
                </v-card-subtitle>

                <v-text-field
                  v-model.number="inputValue"
                  :label="t('enter_value')"
                  type="number"
                  min="0"
                  step="any"
                  density="comfortable"
                  variant="outlined"
                  class="mb-3"
                />

                <v-select
                  v-model="fromUnit"
                  :items="activeUnitOptions"
                  item-title="title"
                  item-value="value"
                  :label="t('select_unit')"
                  density="comfortable"
                  variant="outlined"
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

            <!-- To Section -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4 rounded-lg">
                <v-card-subtitle class="text-subtitle-1 font-weight-bold mb-2 px-0">
                  {{ t('to') }}
                </v-card-subtitle>

                <v-text-field
                  :model-value="outputValueFormatted"
                  :label="t('result')"
                  readonly
                  density="comfortable"
                  variant="outlined"
                  append-inner-icon="mdi-content-copy"
                  class="mb-3"
                  @click:append-inner="copyValue(outputValue)"
                />

                <v-select
                  v-model="toUnit"
                  :items="activeUnitOptions"
                  item-title="title"
                  item-value="value"
                  :label="t('select_unit')"
                  density="comfortable"
                  variant="outlined"
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

          <h3 class="text-h6 font-weight-bold mb-4">
            {{ t('all_units_table') }}
          </h3>

          <v-table density="compact" class="rounded-lg border">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">{{ t('unit') }}</th>
                <th class="text-left font-weight-bold">{{ t('value') }}</th>
                <th class="text-right font-weight-bold">{{ t('copy') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in allConversions" :key="item.key">
                <td>{{ t(item.key) }}</td>
                <td class="font-mono">{{ item.formatted }}</td>
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

    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      {{ t('copied_to_clipboard') }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import PageHeader from "@/components/Core/PageHeader.vue"

const { t } = useI18n()

type ConversionMode = 'binary' | 'decimal' | 'bits'
const conversionMode = ref<ConversionMode>('binary')

const inputValue = ref<number>(1)
const outputValue = ref<number>(1024)
const snackbar = ref(false)

const binaryUnits: Record<string, number> = {
  bytes: 1,
  kibibytes: 1024,
  mebibytes: 1024 ** 2,
  gibibytes: 1024 ** 3,
  tebibytes: 1024 ** 4,
  pebibytes: 1024 ** 5,
}

const decimalUnits: Record<string, number> = {
  bytes: 1,
  kilobytes: 1000,
  megabytes: 1000 ** 2,
  gigabytes: 1000 ** 3,
  terabytes: 1000 ** 4,
  petabytes: 1000 ** 5,
}

const bitUnits: Record<string, number> = {
  bits: 1,
  kilobits: 1000,
  megabits: 1000 ** 2,
  gigabits: 1000 ** 3,
  terabits: 1000 ** 4,
}

const fromUnit = ref<string>("gibibytes")
const toUnit = ref<string>("mebibytes")

const activeUnitMap = computed(() => {
  if (conversionMode.value === 'decimal') return decimalUnits
  if (conversionMode.value === 'bits') return bitUnits
  return binaryUnits
})

const activeUnitOptions = computed(() => {
  return Object.keys(activeUnitMap.value).map(key => ({
    title: key,
    value: key
  }))
})

// Automatically synchronize defaults when mode switches
watch(conversionMode, (mode) => {
  if (mode === 'decimal') {
    fromUnit.value = 'gigabytes'
    toUnit.value = 'megabytes'
  } else if (mode === 'bits') {
    fromUnit.value = 'megabits'
    toUnit.value = 'kilobits'
  } else {
    fromUnit.value = 'gibibytes'
    toUnit.value = 'mebibytes'
  }
})

const convert = () => {
  const val = Number(inputValue.value) || 0
  if (!val) {
    outputValue.value = 0
    return
  }

  const units = activeUnitMap.value
  const fromMultiplier = units[fromUnit.value] ?? 1
  const toMultiplier = units[toUnit.value] ?? 1

  const base = val * fromMultiplier
  outputValue.value = parseFloat((base / toMultiplier).toFixed(8))
}

const outputValueFormatted = computed(() => {
  return outputValue.value.toLocaleString(undefined, { maximumFractionDigits: 8 })
})

const allConversions = computed(() => {
  const val = Number(inputValue.value) || 0
  const units = activeUnitMap.value
  const fromMultiplier = units[fromUnit.value] ?? 1
  const base = val * fromMultiplier

  return Object.entries(units).map(([key, multiplier]) => {
    const converted = base / multiplier
    return {
      key,
      value: converted,
      formatted: converted.toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }
  })
})

function copyValue(val: number) {
  navigator.clipboard.writeText(val.toString())
  snackbar.value = true
}

watch([inputValue, fromUnit, toUnit, conversionMode], () => {
  convert()
}, { immediate: true })
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>
