<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="9"
        xl="8"
      >
        <v-card class="elevation-3 rounded-xl overflow-hidden">
          <v-card-title class="text-h5 text-md-h4 text-center py-6 font-weight-bold">
            {{ t('car_detail_generator_title') }}
          </v-card-title>

          <v-card-text class="pa-4 pa-md-6">
            <v-row>
              <!-- Chassis Number Section (Single) -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4 h-100 rounded-lg">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <v-card-subtitle class="text-subtitle-1 font-weight-bold px-0 mb-0">
                      {{ t('chassis_number_title') }}
                    </v-card-subtitle>
                    <v-chip size="x-small" color="success" variant="tonal" class="font-weight-medium">
                      {{ t('vin_valid') }}
                    </v-chip>
                  </div>

                  <v-select
                    v-model="chassisOptions.manufacturer"
                    :items="manufacturers"
                    :label="t('manufacturer')"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                    item-title="title"
                    item-value="value"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props" :title="t(item.raw.title)" />
                    </template>
                    <template #selection="{ item }">
                      {{ t(item.raw.title) }}
                    </template>
                  </v-select>

                  <v-select
                    v-model="chassisOptions.year"
                    :items="years"
                    :label="t('year')"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />

                  <v-btn
                    color="primary"
                    size="large"
                    block
                    rounded="lg"
                    prepend-icon="mdi-car"
                    class="mb-4"
                    @click="generateChassisNumber"
                  >
                    {{ t('generate_chassis_button') }}
                  </v-btn>

                  <v-text-field
                    v-model="generatedChassisNumber"
                    :label="t('generated_chassis_label')"
                    variant="outlined"
                    readonly
                    append-inner-icon="mdi-content-copy"
                    density="comfortable"
                    class="mb-1"
                    @click:append-inner="copyToClipboard(generatedChassisNumber)"
                  />
                  <v-btn
                    v-if="generatedChassisNumber"
                    variant="text"
                    color="primary"
                    size="small"
                    prepend-icon="mdi-content-copy"
                    @click="copyToClipboard(generatedChassisNumber)"
                  >
                    {{ t('copy_chassis') }}
                  </v-btn>
                </v-card>
              </v-col>

              <!-- Engine Number Section (Single) -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4 h-100 rounded-lg">
                  <v-card-subtitle class="text-subtitle-1 font-weight-bold px-0 mb-3">
                    {{ t('engine_number_title') }}
                  </v-card-subtitle>

                  <v-select
                    v-model="engineOptions.type"
                    :items="engineTypes"
                    :label="t('engine_type')"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                    item-title="title"
                    item-value="value"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props" :title="t(item.raw.title)" />
                    </template>
                    <template #selection="{ item }">
                      {{ t(item.raw.title) }}
                    </template>
                  </v-select>

                  <v-select
                    v-model="engineOptions.displacement"
                    :items="displacements"
                    :label="t('displacement')"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />

                  <v-btn
                    color="secondary"
                    size="large"
                    block
                    rounded="lg"
                    prepend-icon="mdi-engine"
                    class="mb-4"
                    @click="generateEngineNumber"
                  >
                    {{ t('generate_engine_button') }}
                  </v-btn>

                  <v-text-field
                    v-model="generatedEngineNumber"
                    :label="t('generated_engine_label')"
                    variant="outlined"
                    readonly
                    append-inner-icon="mdi-content-copy"
                    density="comfortable"
                    class="mb-1"
                    @click:append-inner="copyToClipboard(generatedEngineNumber)"
                  />
                  <v-btn
                    v-if="generatedEngineNumber"
                    variant="text"
                    color="secondary"
                    size="small"
                    prepend-icon="mdi-content-copy"
                    @click="copyToClipboard(generatedEngineNumber)"
                  >
                    {{ t('copy_engine') }}
                  </v-btn>
                </v-card>
              </v-col>

              <!-- Batch Generator Section -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-4 rounded-lg mt-2">
                  <div class="d-flex justify-space-between align-center mb-3 flex-wrap ga-2">
                    <v-card-subtitle class="text-subtitle-1 font-weight-bold px-0 mb-0">
                      {{ t('generated_batch_title') }}
                    </v-card-subtitle>
                    <div v-if="batchRecords.length > 0">
                      <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-file-delimited-outline" @click="exportBatchCsv">
                        {{ t('export_csv') }}
                      </v-btn>
                    </div>
                  </div>

                  <v-row align="center" class="mb-3">
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model.number="batchCount"
                        :label="t('batch_count')"
                        type="number"
                        min="1"
                        max="50"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" sm="8">
                      <v-btn
                        color="primary"
                        variant="tonal"
                        height="44"
                        block
                        rounded="lg"
                        prepend-icon="mdi-refresh"
                        @click="generateBatchRecords"
                      >
                        {{ t('generate_batch') }}
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-table v-if="batchRecords.length > 0" density="compact" class="rounded-lg border">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{{ t('manufacturer') }}</th>
                        <th>{{ t('chassis_number_title') }}</th>
                        <th>{{ t('engine_number_title') }}</th>
                        <th class="text-right">{{ t('copy') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(rec, idx) in batchRecords" :key="idx">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ t(rec.manufacturer.toLowerCase()) }}</td>
                        <td class="font-mono">{{ rec.vin }}</td>
                        <td class="font-mono">{{ rec.engine }}</td>
                        <td class="text-right">
                          <v-btn
                            icon="mdi-content-copy"
                            size="x-small"
                            variant="text"
                            @click="copyToClipboard(`${rec.vin} | ${rec.engine}`)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import PageHeader from "@/components/Core/PageHeader.vue"

const { t } = useI18n()

const generatedChassisNumber = ref<string>("")
const generatedEngineNumber = ref<string>("")
const batchCount = ref<number>(5)
const batchRecords = ref<{ manufacturer: string; vin: string; engine: string }[]>([])

const snackbar = ref(false)
const snackbarText = ref('')

const chassisOptions = ref({
  manufacturer: "TOYOTA",
  year: new Date().getFullYear(),
})

const engineOptions = ref({
  type: "PETROL",
  displacement: "2000",
})

const manufacturers = [
  { title: "toyota", value: "TOYOTA", wmi: "JT1" },
  { title: "honda", value: "HONDA", wmi: "JHM" },
  { title: "ford", value: "FORD", wmi: "1FA" },
  { title: "bmw", value: "BMW", wmi: "WBA" },
  { title: "mercedes", value: "MERCEDES", wmi: "WDB" },
  { title: "audi", value: "AUDI", wmi: "WAU" },
  { title: "volkswagen", value: "VOLKSWAGEN", wmi: "WVW" },
  { title: "nissan", value: "NISSAN", wmi: "JN1" },
  { title: "hyundai", value: "HYUNDAI", wmi: "KMH" },
  { title: "kia", value: "KIA", wmi: "KNA" },
]

const years = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return { title: year.toString(), value: year }
})

const engineTypes = [
  { title: "petrol", value: "PETROL" },
  { title: "diesel", value: "DIESEL" },
  { title: "hybrid", value: "HYBRID" },
  { title: "electric", value: "ELECTRIC" },
]

const displacements = [
  { title: "1.0L", value: "1000" },
  { title: "1.2L", value: "1200" },
  { title: "1.4L", value: "1400" },
  { title: "1.6L", value: "1600" },
  { title: "1.8L", value: "1800" },
  { title: "2.0L", value: "2000" },
  { title: "2.4L", value: "2400" },
  { title: "3.0L", value: "3000" },
  { title: "3.5L", value: "3500" },
  { title: "4.0L", value: "4000" },
]

// VIN ISO 3779 Check Digit Calculation
const vinWeights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
const vinTransliteration: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
}

const generateRandomString = (length: number, characters: string): string => {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const generateRandomNumber = (length: number): string => {
  return generateRandomString(length, "0123456789")
}

const generateRandomAlphanumeric = (length: number): string => {
  return generateRandomString(length, "0123456789ABCDEFGHJKLMNPRSTUVWXYZ")
}

const getYearCode = (year: number): string => {
  const yearCodes: Record<number, string> = {
    2026: "T",
    2025: "S",
    2024: "R",
    2023: "P",
    2022: "N",
    2021: "M",
    2020: "L",
    2019: "K",
    2018: "J",
    2017: "H",
    2016: "G",
    2015: "F",
    2014: "E",
    2013: "D",
    2012: "C",
    2011: "B",
    2010: "A",
    2009: "9",
    2008: "8",
    2007: "7",
    2006: "6",
    2005: "5",
    2004: "4",
    2003: "3",
    2002: "2",
    2001: "1",
    2000: "Y",
  }
  return yearCodes[year] || "A"
}

// Calculate ISO 3779 9th character check digit
const calculateVinCheckDigit = (vinWithoutCheck: string): string => {
  let sum = 0
  for (let i = 0; i < 17; i++) {
    const char = vinWithoutCheck[i] || '0'
    const value = vinTransliteration[char] ?? 0
    sum += value * vinWeights[i]
  }
  const remainder = sum % 11
  return remainder === 10 ? 'X' : remainder.toString()
}

const createRealisticVin = (manufacturerName: string, year: number): string => {
  const mfr = manufacturers.find(m => m.value === manufacturerName)
  const wmi = mfr?.wmi || 'JT1'
  const vds = generateRandomAlphanumeric(5)
  const yearCode = getYearCode(year)
  const plantCode = generateRandomAlphanumeric(1)
  const serialNumber = generateRandomNumber(6)

  // Draft VIN with dummy '0' at pos 9 (index 8)
  const draftVin = `${wmi}${vds}0${yearCode}${plantCode}${serialNumber}`
  const checkDigit = calculateVinCheckDigit(draftVin)

  // Return complete 17-char valid VIN
  return `${wmi}${vds}${checkDigit}${yearCode}${plantCode}${serialNumber}`
}

const createRealisticEngine = (type: string, displacement: string): string => {
  const typeCode = type.substring(0, 2).replace(/I/g, "1").replace(/O/g, "0")
  const displacementCode = displacement.padStart(4, "0")
  const serialNumber = generateRandomAlphanumeric(8)
  return `${typeCode}${displacementCode}${serialNumber}`
}

const generateChassisNumber = (): void => {
  generatedChassisNumber.value = createRealisticVin(
    chassisOptions.value.manufacturer,
    chassisOptions.value.year
  )
}

const generateEngineNumber = (): void => {
  generatedEngineNumber.value = createRealisticEngine(
    engineOptions.value.type,
    engineOptions.value.displacement
  )
}

const generateBatchRecords = (): void => {
  const records = []
  const count = Math.min(Math.max(batchCount.value || 1, 1), 50)
  for (let i = 0; i < count; i++) {
    const randomMfr = manufacturers[Math.floor(Math.random() * manufacturers.length)]
    const randomYear = years[Math.floor(Math.random() * 10)].value
    const randomType = engineTypes[Math.floor(Math.random() * engineTypes.length)].value
    const randomDisp = displacements[Math.floor(Math.random() * displacements.length)].value

    records.push({
      manufacturer: randomMfr.value,
      vin: createRealisticVin(randomMfr.value, randomYear),
      engine: createRealisticEngine(randomType, randomDisp)
    })
  }
  batchRecords.value = records
}

const exportBatchCsv = () => {
  const rows = batchRecords.value.map((r, i) => `${i + 1},"${r.manufacturer}","${r.vin}","${r.engine}"`)
  const csv = "Index,Manufacturer,VIN / Chassis Number,Engine Number\r\n" + rows.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vehicles_batch_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const copyToClipboard = async (text: string): Promise<void> => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    snackbarText.value = t('copied_to_clipboard')
    snackbar.value = true
  } catch (err) {
    console.error("Failed to copy to clipboard:", err)
  }
}

onMounted(() => {
  generateChassisNumber()
  generateEngineNumber()
  generateBatchRecords()
})
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>
