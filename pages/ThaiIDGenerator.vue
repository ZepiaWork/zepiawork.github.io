<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="10"
                lg="8"
                xl="6"
            >
                <v-card class="elevation-3">
                    <v-card-title class="text-h5 text-md-h4 text-center py-6"> {{ $t('thai_id_generator_title') }} </v-card-title>
                    <v-card-text class="pa-6">
                        <v-row>
                            <!-- Generation Options -->
                            <v-col cols="12">
                                <v-card
                                    variant="outlined"
                                    class="pa-4 mb-4"
                                >
                                    <v-card-subtitle class="text-subtitle-1 mb-3"> {{ $t('generation_options') }} </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="6"
                                        >
                                            <v-select
                                                v-model="selectedProvince"
                                                :items="provinces"
                                                :label="$t('province_optional')"
                                                variant="outlined"
                                                density="comfortable"
                                                clearable
                                                item-title="title"
                                                item-value="value"
                                            >
                                                <template #item="{ props, item }">
                                                    <v-list-item v-bind="props" :title="$t(item.raw.title)" />
                                                </template>
                                                <template #selection="{ item }">
                                                    {{ $t(item.raw.title) }}
                                                </template>
                                            </v-select>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="6"
                                        >
                                            <v-text-field
                                                v-model="quantity"
                                                :label="$t('number_of_ids')"
                                                type="number"
                                                variant="outlined"
                                                density="comfortable"
                                                :min="1"
                                                :max="10"
                                            />
                                        </v-col>
                                    </v-row>

                                    <!-- Format Options -->
                                    <v-row>
                                        <v-col cols="12">
                                            <v-checkbox
                                                v-model="showAsPlainNumber"
                                                :label="$t('show_plain_number')"
                                                density="comfortable"
                                            />
                                        </v-col>
                                    </v-row>

                                    <v-btn
                                        color="primary"
                                        variant="outlined"
                                        class="mb-3"
                                        block
                                        @click="generateThaiIds"
                                    >
                                        {{ $t('generate_button') }}
                                    </v-btn>
                                </v-card>
                            </v-col>

                            <!-- Generated IDs Display -->
                            <v-col cols="12">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-subtitle-1 mb-3">
                                        {{ $t('generated_ids_title') }}
                                        <span
                                            v-if="generatedIds.length > 0"
                                            class="text-caption ml-2"
                                        >
                                            ({{ showAsPlainNumber ? $t('plain_format') : $t('formatted') }})
                                        </span>
                                    </v-card-subtitle>

                                    <div
                                        v-if="generatedIds.length === 0"
                                        class="text-center text-grey"
                                    >
                                        {{ $t('no_ids_generated') }}
                                    </div>

                                    <div v-else>
                                        <v-text-field
                                            v-for="(id, index) in displayedIds"
                                            :key="index"
                                            :value="id"
                                            :label="$t('thai_id_label', { index: index + 1 })"
                                            variant="outlined"
                                            readonly
                                            append-inner-icon="mdi-content-copy"
                                            class="mb-2"
                                            @click:append-inner="copyToClipboard(id)"
                                        />

                                        <v-row>
                                            <v-col>
                                                <v-btn
                                                    color="secondary"
                                                    variant="text"
                                                    class="mt-2"
                                                    @click="copyAllToClipboard"
                                                >
                                                    {{ $t('copy_all') }}
                                                </v-btn>
                                            </v-col>
                                            <v-col class="text-right">
                                                <v-btn
                                                    color="primary"
                                                    variant="text"
                                                    class="mt-2"
                                                    @click="toggleFormat"
                                                >
                                                    {{ showAsPlainNumber ? $t('show_formatted') : $t('show_plain') }}
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-card>
                            </v-col>

                            <!-- Validation Section -->
                            <v-col cols="12">
                                <v-card
                                    variant="outlined"
                                    class="pa-4"
                                >
                                    <v-card-subtitle class="text-subtitle-1 mb-3">
                                        {{ $t('validate_title') }}
                                    </v-card-subtitle>

                                    <v-text-field
                                        v-model="idToValidate"
                                        :label="$t('enter_id_validate')"
                                        variant="outlined"
                                        density="comfortable"
                                        maxlength="17"
                                        class="mb-3"
                                        :hint="$t('validate_hint')"
                                        @input="validateId"
                                    />

                                    <v-alert
                                        v-if="validationResult !== null"
                                        :type="validationResult.isValid ? 'success' : 'error'"
                                        :text="validationResult.message"
                                        class="mb-3"
                                    />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

definePageMeta({
    layout: "single-page",
})

const { t } = useI18n()

// Reactive variables
const generatedIds = ref<string[]>([])
const selectedProvince = ref<string>("")
const quantity = ref<number>(1)
const idToValidate = ref<string>("")
const validationResult = ref<{ isValid: boolean; message: string } | null>(null)
const showAsPlainNumber = ref<boolean>(false)

// Computed property for displayed IDs based on format preference
const displayedIds = computed(() => {
    if (showAsPlainNumber.value) {
        return generatedIds.value.map((id) => id.replace(/[-\s]/g, ""))
    }
    return generatedIds.value
})

// Thai province codes (first 2 digits of ID)
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

// Generate random number within range
const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Calculate a check digit for Thai ID
const calculateCheckDigit = (first12Digits: string): number => {
    let sum = 0
    for (let i = 0; i < 12; i++) {
        sum += parseInt(first12Digits[i] || "0") * (13 - i)
    }
    const remainder = sum % 11
    return remainder < 2 ? remainder : 11 - remainder
}

// Validate Thai ID format and check digit
const isValidThaiId = (id: string): boolean => {
    // Remove spaces and dashes
    const cleanId = id.replace(/[\s-]/g, "")

    // Check if it's 13 digits
    if (!/^\d{13}$/.test(cleanId)) {
        return false
    }

    // Check if the first digit is 0 (invalid)
    if (cleanId[0] === "0") {
        return false
    }

    // Calculate and verify check digit
    const first12 = cleanId.substring(0, 12)
    const checkDigit = parseInt(cleanId[12] || "0")
    const calculatedCheckDigit = calculateCheckDigit(first12)

    return checkDigit === calculatedCheckDigit
}

// Generate a single valid Thai ID
const generateSingleThaiId = (): string => {
    let provinceCode: string

    if (selectedProvince.value) {
        provinceCode = selectedProvince.value
    } else {
        // Select random province code
        const randomProvince = provinces[randomInt(0, provinces.length - 1)]
        provinceCode = randomProvince?.value || ""
    }

    // Generate the remaining 10 digits (positions 3-12)
    let remainingDigits = ""
    for (let i = 0; i < 10; i++) {
        remainingDigits += randomInt(0, 9).toString()
    }

    // Combine the first 12 digits
    const first12Digits = provinceCode + remainingDigits

    // Calculate check digit
    const checkDigit = calculateCheckDigit(first12Digits)

    // Return formatted ID (always store as formatted, display based on preference)
    const fullId = first12Digits + checkDigit.toString()
    return formatThaiId(fullId)
}

// Format Thai ID with dashes
const formatThaiId = (id: string): string => {
    if (id.length === 13) {
        return `${id.substring(0, 1)}-${id.substring(1, 5)}-${id.substring(5, 10)}-${id.substring(10, 12)}-${id.substring(12, 13)}`
    }
    return id
}

// Generate multiple Thai IDs
const generateThaiIds = (): void => {
    const ids: string[] = []
    const count = Math.min(Math.max(quantity.value || 1, 1), 10)

    for (let i = 0; i < count; i++) {
        let newId: string
        let attempts = 0

        // Ensure no duplicates
        do {
            newId = generateSingleThaiId()
            attempts++
        } while (ids.includes(newId) && attempts < 100)

        ids.push(newId)
    }

    generatedIds.value = ids
}

// Toggle format display
const toggleFormat = (): void => {
    showAsPlainNumber.value = !showAsPlainNumber.value
}

// Validate entered ID
const validateId = (): void => {
    if (!idToValidate.value) {
        validationResult.value = null
        return
    }

    const isValid = isValidThaiId(idToValidate.value)
    validationResult.value = {
        isValid,
        message: isValid ? t("valid_id_msg") : t("invalid_id_msg"),
    }
}

// Copy to clipboard function
const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text)
        console.log("Copied to clipboard:", text)
    } catch (err) {
        console.error("Failed to copy to clipboard:", err)
    }
}

// Copy all IDs to the clipboard
const copyAllToClipboard = async (): Promise<void> => {
    const allIds = displayedIds.value.join("\n")
    await copyToClipboard(allIds)
}
</script>

<style scoped>
.text-grey {
    color: #9e9e9e;
}
</style>
