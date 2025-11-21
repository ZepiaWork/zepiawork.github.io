<template>
    <v-container class="pa-2 pa-sm-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                sm="12"
                md="10"
                lg="8"
                xl="6"
            >
                <v-card class="elevation-2 elevation-md-4">
                    <v-card-title class="text-h5 text-md-h4 text-center pa-4 pa-md-6">
                        Car Detail Generator
                    </v-card-title>
                    <v-card-text class="pa-4 pa-md-6">
                        <v-row>
                            <!-- Chassis Number Section -->
                            <v-col cols="12">
                                <v-card
                                    variant="outlined"
                                    class="pa-3 pa-md-4 mb-3 mb-md-4"
                                >
                                    <v-card-subtitle class="text-subtitle-1 text-md-h6 mb-2 mb-md-3">
                                        Chassis Number (VIN)
                                    </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                        >
                                            <v-select
                                                v-model="chassisOptions.manufacturer"
                                                :items="manufacturers"
                                                label="Manufacturer"
                                                variant="outlined"
                                                density="comfortable"
                                                class="mb-2 mb-sm-0"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                        >
                                            <v-select
                                                v-model="chassisOptions.year"
                                                :items="years"
                                                label="Year"
                                                variant="outlined"
                                                density="comfortable"
                                            />
                                        </v-col>
                                    </v-row>

                                    <v-btn
                                        color="primary"
                                        variant="outlined"
                                        class="mb-3 text-body-2 text-sm-body-1"
                                        size="large"
                                        block
                                        @click="generateChassisNumber"
                                    >
                                        <span class="d-block d-sm-inline">Generate Chassis Number</span>
                                    </v-btn>

                                    <v-text-field
                                        v-model="generatedChassisNumber"
                                        label="Generated Chassis Number"
                                        variant="outlined"
                                        readonly
                                        append-inner-icon="mdi-content-copy"
                                        density="comfortable"
                                        @click:append-inner="copyToClipboard(generatedChassisNumber)"
                                    />
                                </v-card>
                            </v-col>

                            <!-- Engine Number Section -->
                            <v-col cols="12">
                                <v-card
                                    variant="outlined"
                                    class="pa-3 pa-md-4"
                                >
                                    <v-card-subtitle class="text-subtitle-1 text-md-h6 mb-2 mb-md-3">
                                        Engine Number
                                    </v-card-subtitle>

                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                        >
                                            <v-select
                                                v-model="engineOptions.type"
                                                :items="engineTypes"
                                                label="Engine Type"
                                                variant="outlined"
                                                density="comfortable"
                                                class="mb-2 mb-sm-0"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                        >
                                            <v-select
                                                v-model="engineOptions.displacement"
                                                :items="displacements"
                                                label="Displacement"
                                                variant="outlined"
                                                density="comfortable"
                                            />
                                        </v-col>
                                    </v-row>

                                    <v-btn
                                        color="secondary"
                                        variant="outlined"
                                        class="mb-3 text-body-2 text-sm-body-1"
                                        size="large"
                                        block
                                        @click="generateEngineNumber"
                                    >
                                        <span class="d-block d-sm-inline">Generate Engine Number</span>
                                    </v-btn>

                                    <v-text-field
                                        v-model="generatedEngineNumber"
                                        label="Generated Engine Number"
                                        variant="outlined"
                                        readonly
                                        append-inner-icon="mdi-content-copy"
                                        density="comfortable"
                                        @click:append-inner="copyToClipboard(generatedEngineNumber)"
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
import { ref } from "vue"

definePageMeta({
    layout: "single-page",
})

// Reactive variables
const generatedChassisNumber = ref<string>("")
const generatedEngineNumber = ref<string>("")

// Chassis number options
const chassisOptions = ref({
    manufacturer: "TOYOTA",
    year: new Date().getFullYear(),
})

// Engine number options
const engineOptions = ref({
    type: "PETROL",
    displacement: "2000",
})

// Data options
const manufacturers = [
    { title: "Toyota", value: "TOYOTA" },
    { title: "Honda", value: "HONDA" },
    { title: "Ford", value: "FORD" },
    { title: "BMW", value: "BMW" },
    { title: "Mercedes", value: "MERCEDES" },
    { title: "Audi", value: "AUDI" },
    { title: "Volkswagen", value: "VOLKSWAGEN" },
    { title: "Nissan", value: "NISSAN" },
    { title: "Hyundai", value: "HYUNDAI" },
    { title: "Kia", value: "KIA" },
]

const years = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { title: year.toString(), value: year }
})

const engineTypes = [
    { title: "Petrol", value: "PETROL" },
    { title: "Diesel", value: "DIESEL" },
    { title: "Hybrid", value: "HYBRID" },
    { title: "Electric", value: "ELECTRIC" },
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

// Utility functions
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
    return generateRandomString(length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
}

// Year code conversion (simplified VIN year encoding)
const getYearCode = (year: number): string => {
    const yearCodes: { [key: number]: string } = {
        2024: "P",
        2023: "N",
        2022: "M",
        2021: "L",
        2020: "K",
        2019: "J",
        2018: "H",
        2017: "G",
        2016: "F",
        2015: "E",
        2014: "D",
        2013: "C",
        2012: "B",
        2011: "A",
        2010: "9",
        2009: "8",
        2008: "7",
        2007: "6",
        2006: "5",
        2005: "4",
        2004: "3",
        2003: "2",
        2002: "1",
        2001: "Y",
        2000: "X",
    }
    return yearCodes[year] || "A"
}

// Generate chassis number (VIN-like format)
const generateChassisNumber = (): void => {
    const manufacturer = chassisOptions.value.manufacturer
    const year = chassisOptions.value.year

    // VIN-like format: 3 characters manufacturer + 6 characters vehicle descriptor + 1 char year + 1 char plant + 6 characters serial
    const manufacturerCode = manufacturer.substring(0, 3).padEnd(3, "X")
    const vehicleDescriptor = generateRandomAlphanumeric(6)
    const yearCode = getYearCode(year)
    const plantCode = generateRandomAlphanumeric(1)
    const serialNumber = generateRandomNumber(6)

    generatedChassisNumber.value = `${manufacturerCode}${vehicleDescriptor}${yearCode}${plantCode}${serialNumber}`
}

// Generate engine number
const generateEngineNumber = (): void => {
    const type = engineOptions.value.type
    const displacement = engineOptions.value.displacement

    // Engine number format: 2 chars type + 4 chars displacement + 8 chars serial
    const typeCode = type.substring(0, 2)
    const displacementCode = displacement.padStart(4, "0")
    const serialNumber = generateRandomAlphanumeric(8)

    generatedEngineNumber.value = `${typeCode}${displacementCode}${serialNumber}`
}

// Copy to clipboard function
const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text)
        // You can add a toast notification here if needed
        console.log("Copied to clipboard:", text)
    } catch (err) {
        console.error("Failed to copy to clipboard:", err)
    }
}
</script>
