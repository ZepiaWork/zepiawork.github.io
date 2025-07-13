<template>
    <v-container class="pa-6">
        <v-row justify="center">
            <v-col
                cols="12"
                md="8"
                lg="6"
            >
                <v-card class="elevation-3">
                    <v-card-title class="text-h4 text-center py-6"> Thai ID Card Number Generator </v-card-title>
                    <v-card-text class="pa-6">
                        <v-row>
                            <!-- Generation Options -->
                            <v-col cols="12">
                                <v-card
                                    variant="outlined"
                                    class="pa-4 mb-4"
                                >
                                    <v-card-subtitle class="text-subtitle-1 mb-3"> Generation Options </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="6"
                                        >
                                            <v-select
                                                v-model="selectedProvince"
                                                :items="provinces"
                                                label="Province (Optional)"
                                                variant="outlined"
                                                density="comfortable"
                                                clearable
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="6"
                                        >
                                            <v-text-field
                                                v-model="quantity"
                                                label="Number of IDs to generate"
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
                                                label="Show as plain number (without dashes)"
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
                                        Generate Thai ID Numbers
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
                                        Generated Thai ID Numbers
                                        <span
                                            v-if="generatedIds.length > 0"
                                            class="text-caption ml-2"
                                        >
                                            ({{ showAsPlainNumber ? "Plain format" : "Formatted" }})
                                        </span>
                                    </v-card-subtitle>

                                    <div
                                        v-if="generatedIds.length === 0"
                                        class="text-center text-grey"
                                    >
                                        No IDs generated yet. Click the button above to generate.
                                    </div>

                                    <div v-else>
                                        <v-text-field
                                            v-for="(id, index) in displayedIds"
                                            :key="index"
                                            :value="id"
                                            :label="`Thai ID ${index + 1}`"
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
                                                    Copy All
                                                </v-btn>
                                            </v-col>
                                            <v-col class="text-right">
                                                <v-btn
                                                    color="primary"
                                                    variant="text"
                                                    class="mt-2"
                                                    @click="toggleFormat"
                                                >
                                                    {{ showAsPlainNumber ? "Show Formatted" : "Show Plain" }}
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
                                        Validate Thai ID Number
                                    </v-card-subtitle>

                                    <v-text-field
                                        v-model="idToValidate"
                                        label="Enter Thai ID to validate"
                                        variant="outlined"
                                        density="comfortable"
                                        maxlength="17"
                                        class="mb-3"
                                        hint="You can enter with or without dashes"
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
    { title: "Bangkok", value: "10" },
    { title: "Samut Prakan", value: "11" },
    { title: "Nonthaburi", value: "12" },
    { title: "Pathum Thani", value: "13" },
    { title: "Phra Nakhon Si Ayutthaya", value: "14" },
    { title: "Ang Thong", value: "15" },
    { title: "Lopburi", value: "16" },
    { title: "Sing Buri", value: "17" },
    { title: "Chai Nat", value: "18" },
    { title: "Saraburi", value: "19" },
    { title: "Chonburi", value: "20" },
    { title: "Rayong", value: "21" },
    { title: "Chanthaburi", value: "22" },
    { title: "Trat", value: "23" },
    { title: "Chachoengsao", value: "24" },
    { title: "Prachinburi", value: "25" },
    { title: "Nakhon Nayok", value: "26" },
    { title: "Sa Kaeo", value: "27" },
    { title: "Nakhon Ratchasima", value: "30" },
    { title: "Buriram", value: "31" },
    { title: "Surin", value: "32" },
    { title: "Sisaket", value: "33" },
    { title: "Ubon Ratchathani", value: "34" },
    { title: "Yasothon", value: "35" },
    { title: "Chaiyaphum", value: "36" },
    { title: "Amnat Charoen", value: "37" },
    { title: "Bueng Kan", value: "38" },
    { title: "Nong Bua Lam Phu", value: "39" },
    { title: "Khon Kaen", value: "40" },
    { title: "Udon Thani", value: "41" },
    { title: "Loei", value: "42" },
    { title: "Nong Khai", value: "43" },
    { title: "Maha Sarakham", value: "44" },
    { title: "Roi Et", value: "45" },
    { title: "Kalasin", value: "46" },
    { title: "Sakon Nakhon", value: "47" },
    { title: "Nakhon Phanom", value: "48" },
    { title: "Mukdahan", value: "49" },
    { title: "Chiang Mai", value: "50" },
    { title: "Lamphun", value: "51" },
    { title: "Lampang", value: "52" },
    { title: "Uttaradit", value: "53" },
    { title: "Phrae", value: "54" },
    { title: "Nan", value: "55" },
    { title: "Phayao", value: "56" },
    { title: "Chiang Rai", value: "57" },
    { title: "Mae Hong Son", value: "58" },
    { title: "Nakhon Sawan", value: "60" },
    { title: "Uthai Thani", value: "61" },
    { title: "Kamphaeng Phet", value: "62" },
    { title: "Tak", value: "63" },
    { title: "Sukhothai", value: "64" },
    { title: "Phitsanulok", value: "65" },
    { title: "Phichit", value: "66" },
    { title: "Phetchabun", value: "67" },
    { title: "Ratchaburi", value: "70" },
    { title: "Kanchanaburi", value: "71" },
    { title: "Suphan Buri", value: "72" },
    { title: "Nakhon Pathom", value: "73" },
    { title: "Samut Sakhon", value: "74" },
    { title: "Samut Songkhram", value: "75" },
    { title: "Phetchaburi", value: "76" },
    { title: "Prachuap Khiri Khan", value: "77" },
    { title: "Nakhon Si Thammarat", value: "80" },
    { title: "Krabi", value: "81" },
    { title: "Phang Nga", value: "82" },
    { title: "Phuket", value: "83" },
    { title: "Surat Thani", value: "84" },
    { title: "Ranong", value: "85" },
    { title: "Chumphon", value: "86" },
    { title: "Songkhla", value: "90" },
    { title: "Satun", value: "91" },
    { title: "Trang", value: "92" },
    { title: "Phatthalung", value: "93" },
    { title: "Pattani", value: "94" },
    { title: "Yala", value: "95" },
    { title: "Narathiwat", value: "96" },
]

// Generate random number within range
const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Calculate check digit for Thai ID
const calculateCheckDigit = (first12Digits: string): number => {
    let sum = 0
    for (let i = 0; i < 12; i++) {
        sum += parseInt(first12Digits[i]) * (13 - i)
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

    // Check if first digit is 0 (invalid)
    if (cleanId[0] === "0") {
        return false
    }

    // Calculate and verify check digit
    const first12 = cleanId.substring(0, 12)
    const checkDigit = parseInt(cleanId[12])
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
        provinceCode = randomProvince.value
    }

    // Generate remaining 10 digits (positions 3-12)
    let remainingDigits = ""
    for (let i = 0; i < 10; i++) {
        remainingDigits += randomInt(0, 9).toString()
    }

    // Combine first 12 digits
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
        message: isValid ? "Valid Thai ID number" : "Invalid Thai ID number",
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

// Copy all IDs to clipboard
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
