<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="7"
      >
        <v-card class="elevation-3 rounded-xl overflow-hidden">
          <v-card-title class="text-h5 text-md-h4 text-center py-6 font-weight-bold">
            {{ t('thai_id_generator_title') }}
          </v-card-title>

          <v-card-text class="pa-4 pa-md-6">
            <!-- ID Anatomy Info Banner -->
            <v-alert
              color="primary"
              variant="tonal"
              icon="mdi-information-outline"
              class="mb-6 rounded-lg"
            >
              <div class="d-flex align-center justify-space-between flex-wrap ga-2">
                <span>{{ t('id_anatomy_desc') }}</span>
                <v-btn
                  size="small"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-help-circle-outline"
                  rounded="pill"
                  @click="guideDialog = true"
                >
                  {{ t('learn_more_id') }}
                </v-btn>
              </div>
            </v-alert>

            <!-- Generation Options -->
            <v-card variant="outlined" class="pa-4 mb-6 rounded-lg">
              <v-card-subtitle class="text-subtitle-1 font-weight-bold mb-3 px-0">
                {{ t('generation_options') }}
              </v-card-subtitle>

              <v-row>
                <v-col cols="12" sm="7">
                  <v-select
                    v-model="selectedProvince"
                    :items="provinces"
                    :label="t('province_optional')"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    item-title="title"
                    item-value="value"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props" :title="item?.raw?.title ? t(item.raw.title) : ''" />
                    </template>
                    <template #selection="{ item }">
                      {{ item?.raw?.title ? t(item.raw.title) : '' }}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="5">
                  <v-text-field
                    v-model.number="quantity"
                    :label="t('number_of_ids')"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    :min="1"
                    :max="50"
                  />
                </v-col>
              </v-row>

              <v-row dense class="mb-2">
                <v-col cols="12">
                  <v-checkbox
                    v-model="showAsPlainNumber"
                    :label="t('show_plain_number')"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>

              <v-btn
                color="primary"
                size="large"
                block
                rounded="lg"
                prepend-icon="mdi-card-account-details-outline"
                @click="generateThaiIds"
              >
                {{ t('generate_button') }}
              </v-btn>
            </v-card>

            <!-- Generated IDs Display -->
            <v-card variant="outlined" class="pa-4 mb-6 rounded-lg">
              <div class="d-flex justify-space-between align-center mb-3 flex-wrap ga-2">
                <v-card-subtitle class="text-subtitle-1 font-weight-bold px-0 mb-0">
                  {{ t('generated_ids_title') }}
                  <span v-if="generatedIds.length > 0" class="text-caption font-weight-regular ml-2 text-medium-emphasis">
                    ({{ showAsPlainNumber ? t('plain_format') : t('formatted') }} - {{ generatedIds.length }} IDs)
                  </span>
                </v-card-subtitle>

                <!-- Export actions -->
                <div v-if="generatedIds.length > 0" class="d-flex ga-1">
                  <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-file-delimited-outline" @click="exportCsv">
                    {{ t('export_csv') }}
                  </v-btn>
                  <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-file-document-outline" @click="exportTxt">
                    {{ t('export_txt') }}
                  </v-btn>
                </div>
              </div>

              <div v-if="generatedIds.length === 0" class="text-center py-6 text-medium-emphasis">
                <v-icon icon="mdi-card-bulleted-off-outline" size="36" class="mb-2 opacity-50" />
                <p class="text-body-2">{{ t('no_ids_generated') }}</p>
              </div>

              <div v-else>
                <div style="max-height: 280px; overflow-y: auto;">
                  <v-text-field
                    v-for="(id, index) in displayedIds"
                    :key="index"
                    :model-value="id"
                    :label="t('thai_id_label', { index: index + 1 })"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    append-inner-icon="mdi-content-copy"
                    class="mb-2"
                    @click:append-inner="copyToClipboard(id)"
                  />
                </div>

                <div class="d-flex justify-space-between align-center mt-3 pt-2 border-t">
                  <v-btn
                    color="primary"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-content-copy"
                    rounded="pill"
                    @click="copyAllToClipboard"
                  >
                    {{ t('copy_all') }}
                  </v-btn>

                  <v-btn
                    variant="text"
                    size="small"
                    @click="toggleFormat"
                  >
                    {{ showAsPlainNumber ? t('show_formatted') : t('show_plain') }}
                  </v-btn>
                </div>
              </div>
            </v-card>

            <!-- Validation Section -->
            <v-card variant="outlined" class="pa-4 rounded-lg">
              <v-card-subtitle class="text-subtitle-1 font-weight-bold mb-3 px-0">
                {{ t('validate_title') }}
              </v-card-subtitle>

              <v-text-field
                v-model="idToValidate"
                :label="t('enter_id_validate')"
                variant="outlined"
                density="comfortable"
                maxlength="17"
                class="mb-3"
                clearable
                :hint="t('validate_hint')"
                persistent-hint
                @input="validateId"
                @click:clear="validationResult = null"
              />

              <v-alert
                v-if="validationResult !== null"
                :type="validationResult.isValid ? 'success' : 'error'"
                variant="tonal"
                class="mb-0 rounded-lg"
              >
                <div class="font-weight-bold">{{ validationResult.message }}</div>
                <div v-if="validationResult.isValid && validationResult.breakdown" class="text-caption mt-1">
                  {{ validationResult.breakdown }}
                </div>
              </v-alert>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ID Anatomy Guide Dialog -->
    <v-dialog v-model="guideDialog" max-width="560">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex align-center pt-3 px-4">
          <v-icon color="primary" class="mr-2">mdi-school-outline</v-icon>
          <span class="text-h6 font-weight-bold">{{ t('id_anatomy_title') }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" @click="guideDialog = false" />
        </v-card-title>

        <v-card-text class="px-4 py-3">
          <p class="text-body-2 mb-4">{{ t('id_anatomy_desc') }}</p>

          <v-list density="compact" class="rounded-lg border mb-3">
            <v-list-item>
              <template #prepend><v-icon color="primary" size="small" class="mr-2">mdi-numeric-1-circle</v-icon></template>
              <v-list-item-title class="text-caption font-weight-medium text-wrap">{{ t('id_seg_1') }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon color="primary" size="small" class="mr-2">mdi-numeric-2-circle</v-icon></template>
              <v-list-item-title class="text-caption font-weight-medium text-wrap">{{ t('id_seg_2') }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon color="primary" size="small" class="mr-2">mdi-numeric-3-circle</v-icon></template>
              <v-list-item-title class="text-caption font-weight-medium text-wrap">{{ t('id_seg_3') }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon color="primary" size="small" class="mr-2">mdi-numeric-4-circle</v-icon></template>
              <v-list-item-title class="text-caption font-weight-medium text-wrap">{{ t('id_seg_4') }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon color="primary" size="small" class="mr-2">mdi-numeric-5-circle</v-icon></template>
              <v-list-item-title class="text-caption font-weight-medium text-wrap">{{ t('id_seg_5') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="px-4 pb-3">
          <v-spacer />
          <v-btn color="primary" variant="tonal" rounded="pill" @click="guideDialog = false">
            {{ t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import PageHeader from "@/components/Core/PageHeader.vue"

const { t } = useI18n()

const generatedIds = ref<string[]>([])
const selectedProvince = ref<string>("")
const quantity = ref<number>(1)
const idToValidate = ref<string>("")
const validationResult = ref<{ isValid: boolean; message: string; breakdown?: string } | null>(null)
const showAsPlainNumber = ref<boolean>(false)
const guideDialog = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

const displayedIds = computed(() => {
  if (showAsPlainNumber.value) {
    return generatedIds.value.map((id) => id.replace(/[-\s]/g, ""))
  }
  return generatedIds.value
})

const provinces = [
  { title: "bangkok", value: "10" },
  { title: "samut_prakan", value: "11" },
  { title: "nonthaburi", value: "12" },
  { title: "pathum_thani", value: "13" },
  { title: "phra_nakhon_si_ayutthaya", value: "14" },
  { title: "ang_thong", value: "15" },
  { title: "lopburi", value: "16" },
  { title: "sing_buri", value: "17" },
  { title: "chai_nat", value: "18" },
  { title: "saraburi", value: "19" },
  { title: "chonburi", value: "20" },
  { title: "rayong", value: "21" },
  { title: "chanthaburi", value: "22" },
  { title: "trat", value: "23" },
  { title: "chachoengsao", value: "24" },
  { title: "prachinburi", value: "25" },
  { title: "nakhon_nayok", value: "26" },
  { title: "sa_kaeo", value: "27" },
  { title: "nakhon_ratchasima", value: "30" },
  { title: "buriram", value: "31" },
  { title: "surin", value: "32" },
  { title: "sisaket", value: "33" },
  { title: "ubon_ratchathani", value: "34" },
  { title: "yasothon", value: "35" },
  { title: "chaiyaphum", value: "36" },
  { title: "amnat_charoen", value: "37" },
  { title: "bueng_kan", value: "38" },
  { title: "nong_bua_lam_phu", value: "39" },
  { title: "khon_kaen", value: "40" },
  { title: "udon_thani", value: "41" },
  { title: "loei", value: "42" },
  { title: "nong_khai", value: "43" },
  { title: "maha_sarakham", value: "44" },
  { title: "roi_et", value: "45" },
  { title: "kalasin", value: "46" },
  { title: "sakon_nakhon", value: "47" },
  { title: "nakhon_phanom", value: "48" },
  { title: "mukdahan", value: "49" },
  { title: "chiang_mai", value: "50" },
  { title: "lamphun", value: "51" },
  { title: "lampang", value: "52" },
  { title: "uttaradit", value: "53" },
  { title: "phrae", value: "54" },
  { title: "nan", value: "55" },
  { title: "phayao", value: "56" },
  { title: "chiang_rai", value: "57" },
  { title: "mae_hong_son", value: "58" },
  { title: "nakhon_sawan", value: "60" },
  { title: "uthai_thani", value: "61" },
  { title: "kamphaeng_phet", value: "62" },
  { title: "tak", value: "63" },
  { title: "sukhothai", value: "64" },
  { title: "phitsanulok", value: "65" },
  { title: "phichit", value: "66" },
  { title: "phetchabun", value: "67" },
  { title: "ratchaburi", value: "70" },
  { title: "kanchanaburi", value: "71" },
  { title: "suphan_buri", value: "72" },
  { title: "nakhon_pathom", value: "73" },
  { title: "samut_sakhon", value: "74" },
  { title: "samut_songkhram", value: "75" },
  { title: "phetchaburi", value: "76" },
  { title: "prachuap_khiri_khan", value: "77" },
  { title: "nakhon_si_thammarat", value: "80" },
  { title: "krabi", value: "81" },
  { title: "phang_nga", value: "82" },
  { title: "phuket", value: "83" },
  { title: "surat_thani", value: "84" },
  { title: "ranong", value: "85" },
  { title: "chumphon", value: "86" },
  { title: "songkhla", value: "90" },
  { title: "satun", value: "91" },
  { title: "trang", value: "92" },
  { title: "phatthalung", value: "93" },
  { title: "pattani", value: "94" },
  { title: "yala", value: "95" },
  { title: "narathiwat", value: "96" },
]

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const calculateCheckDigit = (first12Digits: string): number => {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(first12Digits[i] || "0") * (13 - i)
  }
  const remainder = sum % 11
  return remainder < 2 ? remainder : 11 - remainder
}

const isValidThaiId = (id: string): boolean => {
  const cleanId = id.replace(/[\s-]/g, "")
  if (!/^\d{13}$/.test(cleanId) || cleanId[0] === "0") {
    return false
  }
  const first12 = cleanId.substring(0, 12)
  const checkDigit = parseInt(cleanId[12] || "0")
  const calculatedCheckDigit = calculateCheckDigit(first12)
  return checkDigit === calculatedCheckDigit
}

const generateSingleThaiId = (): string => {
  let provinceCode: string
  if (selectedProvince.value) {
    provinceCode = selectedProvince.value
  } else {
    const randomProvince = provinces[randomInt(0, provinces.length - 1)]
    provinceCode = randomProvince?.value || "10"
  }

  // Citizen category: randomly 1, 2, 3, 4, 5, 8
  const validCategories = [1, 2, 3, 4, 5, 8]
  const citizenCat = validCategories[randomInt(0, validCategories.length - 1)].toString()

  let remainingDigits = ""
  for (let i = 0; i < 9; i++) {
    remainingDigits += randomInt(0, 9).toString()
  }

  const first12Digits = citizenCat + provinceCode + remainingDigits
  const checkDigit = calculateCheckDigit(first12Digits)
  const fullId = first12Digits + checkDigit.toString()
  return formatThaiId(fullId)
}

const formatThaiId = (id: string): string => {
  const clean = id.replace(/\D/g, '')
  if (clean.length === 13) {
    return `${clean.substring(0, 1)}-${clean.substring(1, 5)}-${clean.substring(5, 10)}-${clean.substring(10, 12)}-${clean.substring(12, 13)}`
  }
  return id
}

const generateThaiIds = (): void => {
  const ids: string[] = []
  const count = Math.min(Math.max(quantity.value || 1, 1), 50)

  for (let i = 0; i < count; i++) {
    let newId: string
    let attempts = 0
    do {
      newId = generateSingleThaiId()
      attempts++
    } while (ids.includes(newId) && attempts < 100)
    ids.push(newId)
  }

  generatedIds.value = ids
}

const toggleFormat = (): void => {
  showAsPlainNumber.value = !showAsPlainNumber.value
}

const validateId = (): void => {
  if (!idToValidate.value) {
    validationResult.value = null
    return
  }

  const clean = idToValidate.value.replace(/[\s-]/g, "")
  const isValid = isValidThaiId(idToValidate.value)

  let breakdown = ''
  if (isValid && clean.length === 13) {
    const prov = provinces.find(p => p.value === clean.substring(1, 3))
    const provName = prov ? t(prov.title) : 'Province code ' + clean.substring(1, 3)
    breakdown = `Category: ${clean[0]} | ${provName} | Book: ${clean.substring(5, 10)} | Seq: ${clean.substring(10, 12)} | Check Digit: ${clean[12]}`
  }

  validationResult.value = {
    isValid,
    message: isValid ? t("valid_id_msg") : t("invalid_id_msg"),
    breakdown
  }
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

const copyAllToClipboard = async (): Promise<void> => {
  const allIds = displayedIds.value.join("\n")
  await copyToClipboard(allIds)
}

const exportTxt = () => {
  const textContent = displayedIds.value.join('\r\n')
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `thai_ids_${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const exportCsv = () => {
  const rows = displayedIds.value.map((id, index) => `${index + 1},"${id}"`)
  const csvContent = "Index,Thai ID Number\r\n" + rows.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `thai_ids_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.border-t {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
