<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col
                cols="12"
                lg="11"
                xl="10"
            >
                <v-card class="elevation-3 overflow-hidden">
                    <!-- Premium Header -->
                    <div class="header-gradient text-white py-6 px-6 text-center position-relative">
                        <h1 class="text-h4 font-weight-bold mb-2">{{ t('qr_code_generator_title') }}</h1>
                        <p class="text-subtitle-1 opacity-80">{{ t('qr_code_generator_subtitle') }}</p>
                    </div>

                    <v-card-text class="pa-6">
                        <v-row>
                            <!-- Left Column: Settings and Inputs -->
                            <v-col cols="12" md="7">
                                <!-- Text Input -->
                                <v-card variant="outlined" class="pa-4 mb-4 card-glow">
                                    <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0 d-flex align-center">
                                        <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
                                        {{ t('qr_text_title') }}
                                    </v-card-title>
                                    <v-textarea
                                        v-model="qrText"
                                        :label="t('qr_text_label')"
                                        :placeholder="t('qr_text_placeholder')"
                                        variant="outlined"
                                        rows="3"
                                        counter
                                        maxlength="1000"
                                        persistent-hint
                                        :hint="t('qr_text_hint')"
                                        class="mt-2"
                                        @input="onInputChange"
                                    />
                                </v-card>

                                <!-- Design & Colors -->
                                <v-card variant="outlined" class="pa-4 mb-4 card-glow">
                                    <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0 d-flex align-center">
                                        <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
                                        {{ t('qr_design_title') }}
                                    </v-card-title>

                                    <!-- Colors Section -->
                                    <v-row class="mt-2">
                                        <v-col cols="12" sm="6">
                                            <v-label class="text-caption font-weight-medium mb-1 d-block">{{ t('qr_color_fg') }}</v-label>
                                            <div class="d-flex align-center">
                                                <v-menu :close-on-content-click="false" location="bottom">
                                                    <template #activator="{ props }">
                                                        <div
                                                            v-bind="props"
                                                            class="color-preview-btn mr-3"
                                                            :style="{ backgroundColor: foregroundColor }"
                                                        />
                                                    </template>
                                                    <v-color-picker
                                                        v-model="foregroundColor"
                                                        hide-inputs
                                                        @update:model-value="debouncedGenerate"
                                                    />
                                                </v-menu>
                                                <v-text-field
                                                    v-model="foregroundColor"
                                                    variant="outlined"
                                                    density="compact"
                                                    hide-details
                                                    maxlength="9"
                                                    @input="debouncedGenerate"
                                                />
                                            </div>
                                        </v-col>

                                        <v-col cols="12" sm="6">
                                            <v-label class="text-caption font-weight-medium mb-1 d-block">{{ t('qr_color_bg') }}</v-label>
                                            <div class="d-flex align-center">
                                                <v-menu :close-on-content-click="false" location="bottom" :disabled="transparentBg">
                                                    <template #activator="{ props }">
                                                        <div
                                                            v-bind="props"
                                                            class="color-preview-btn mr-3"
                                                            :style="{ backgroundColor: transparentBg ? 'transparent' : backgroundColor }"
                                                            :class="{ 'transparent-checkerboard': transparentBg }"
                                                        />
                                                    </template>
                                                    <v-color-picker
                                                        v-model="backgroundColor"
                                                        hide-inputs
                                                        @update:model-value="debouncedGenerate"
                                                    />
                                                </v-menu>
                                                <v-text-field
                                                    v-model="backgroundColor"
                                                    :disabled="transparentBg"
                                                    variant="outlined"
                                                    density="compact"
                                                    hide-details
                                                    maxlength="9"
                                                    @input="debouncedGenerate"
                                                />
                                            </div>
                                            <v-checkbox
                                                v-model="transparentBg"
                                                :label="t('qr_transparent_bg')"
                                                density="compact"
                                                hide-details
                                                class="mt-1"
                                                @update:model-value="debouncedGenerate"
                                            />
                                        </v-col>
                                    </v-row>

                                    <!-- QR Configuration -->
                                    <v-row class="mt-2">
                                        <v-col cols="12" sm="6">
                                            <v-slider
                                                v-model="margin"
                                                :label="t('qr_margin')"
                                                :min="0"
                                                :max="10"
                                                :step="1"
                                                thumb-label
                                                density="compact"
                                                color="primary"
                                                @update:model-value="debouncedGenerate"
                                            />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-slider
                                                v-model="size"
                                                :label="t('qr_size')"
                                                :min="128"
                                                :max="1024"
                                                :step="64"
                                                thumb-label
                                                density="compact"
                                                color="primary"
                                                @update:model-value="debouncedGenerate"
                                            />
                                        </v-col>
                                    </v-row>

                                    <!-- Error Correction Level -->
                                    <v-row>
                                        <v-col cols="12">
                                            <v-label class="text-caption font-weight-medium mb-1 d-block">
                                                {{ t('qr_error_correction') }}
                                            </v-label>
                                            <v-btn-toggle
                                                v-model="errorCorrectionLevel"
                                                mandatory
                                                color="primary"
                                                variant="outlined"
                                                divided
                                                class="w-100"
                                                @update:model-value="debouncedGenerate"
                                            >
                                                <v-btn value="L" class="flex-grow-1">L (7%)</v-btn>
                                                <v-btn value="M" class="flex-grow-1">M (15%)</v-btn>
                                                <v-btn value="Q" class="flex-grow-1">Q (25%)</v-btn>
                                                <v-btn value="H" class="flex-grow-1">H (30%)</v-btn>
                                            </v-btn-toggle>
                                        </v-col>
                                    </v-row>
                                </v-card>

                                <!-- Logo Overlay Settings -->
                                <v-card variant="outlined" class="pa-4 card-glow">
                                    <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0 d-flex align-center">
                                        <v-icon color="primary" class="mr-2">mdi-image-filter-center-focus</v-icon>
                                        {{ t('qr_logo_title') }}
                                    </v-card-title>

                                    <v-checkbox
                                        v-model="showLogo"
                                        :label="t('qr_logo_enable')"
                                        density="comfortable"
                                        hide-details
                                        @update:model-value="debouncedGenerate"
                                    />

                                    <v-expand-transition>
                                        <div v-show="showLogo" class="mt-4">
                                            <v-file-input
                                                accept="image/*"
                                                :label="t('qr_logo_file')"
                                                variant="outlined"
                                                density="comfortable"
                                                prepend-icon="mdi-camera"
                                                show-size
                                                @change="onLogoFileChange"
                                                @click:clear="clearLogoFile"
                                            />

                                            <v-row class="mt-2" align="center">
                                                <v-col cols="12" sm="6">
                                                    <v-slider
                                                        v-model="logoSizePercent"
                                                        :label="t('qr_logo_size')"
                                                        :min="5"
                                                        :max="30"
                                                        :step="1"
                                                        thumb-label
                                                        color="primary"
                                                        density="compact"
                                                        :disabled="!logoImage"
                                                        @update:model-value="debouncedGenerate"
                                                    />
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-checkbox
                                                        v-model="clearLogoMargin"
                                                        :label="t('qr_logo_clear')"
                                                        density="compact"
                                                        hide-details
                                                        :disabled="!logoImage"
                                                        @update:model-value="debouncedGenerate"
                                                    />
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-transition>
                                </v-card>
                            </v-col>

                            <!-- Right Column: Live Preview & Actions -->
                            <v-col cols="12" md="5" class="d-flex flex-column align-center">
                                <v-card
                                    variant="outlined"
                                    class="pa-4 w-100 d-flex flex-column align-center justify-center card-glow"
                                    style="min-height: 420px;"
                                >
                                    <v-card-subtitle class="text-subtitle-1 mb-4 text-center font-weight-bold">
                                        {{ t('qr_preview_title') }}
                                    </v-card-subtitle>

                                    <!-- QR Code Display Box -->
                                    <div class="qr-container-outer mb-4 d-flex justify-center align-center">
                                        <div class="qr-container-inner" :class="{ 'transparent-checkerboard': transparentBg }">
                                            <!-- Canvas for rendering QR -->
                                            <canvas ref="qrCanvas" class="qr-canvas-preview d-block" />
                                        </div>
                                    </div>

                                    <!-- Export Actions -->
                                    <div class="w-100 px-2">
                                        <v-row dense>
                                            <v-col cols="12" sm="6">
                                                <v-btn
                                                    color="primary"
                                                    block
                                                    prepend-icon="mdi-download"
                                                    class="mb-2"
                                                    @click="downloadImage('png')"
                                                >
                                                    {{ t('download_png') }}
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-btn
                                                    color="secondary"
                                                    variant="outlined"
                                                    block
                                                    prepend-icon="mdi-xml"
                                                    class="mb-2"
                                                    @click="downloadSvg"
                                                >
                                                    {{ t('download_svg') }}
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-btn
                                                    variant="outlined"
                                                    block
                                                    prepend-icon="mdi-image"
                                                    class="mb-2"
                                                    @click="downloadImage('jpeg')"
                                                >
                                                    {{ t('download_jpeg') }}
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-btn
                                                    variant="outlined"
                                                    block
                                                    prepend-icon="mdi-content-copy"
                                                    class="mb-2"
                                                    @click="copyToClipboard"
                                                >
                                                    {{ t('copy_image') }}
                                                </v-btn>
                                            </v-col>
                                            <v-col v-if="canShare" cols="12">
                                                <v-btn
                                                    color="info"
                                                    variant="tonal"
                                                    block
                                                    prepend-icon="mdi-share-variant"
                                                    class="mb-2"
                                                    @click="shareQrCode"
                                                >
                                                    {{ t('share_qr') }}
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Snackbar notification -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            timeout="3000"
            elevation="24"
        >
            {{ snackbar.text }}
            <template #actions>
                <v-btn
                    color="white"
                    variant="text"
                    @click="snackbar.show = false"
                >
                    {{ t('close') }}
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import QRCode from "qrcode"

definePageMeta({
    layout: "single-page",
})

const { t } = useI18n()

// Core Reactive States
const qrText = ref<string>("https://zepiawork.github.io")
const foregroundColor = ref<string>("#000000")
const backgroundColor = ref<string>("#FFFFFF")
const transparentBg = ref<boolean>(false)
const margin = ref<number>(4)
const size = ref<number>(512)
const errorCorrectionLevel = ref<"L" | "M" | "Q" | "H">("M")

// Logo States
const showLogo = ref<boolean>(false)
const logoImage = ref<HTMLImageElement | null>(null)
const logoSizePercent = ref<number>(15)
const clearLogoMargin = ref<boolean>(true)

// DOM Ref
const qrCanvas = ref<HTMLCanvasElement | null>(null)

// Sharing Check
const canShare = ref<boolean>(false)

// Debouncing mechanism to prevent redundant drawing calls on fast slider values
let timeoutId: ReturnType<typeof setTimeout> | null = null
const debouncedGenerate = () => {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
        generateQrCode()
    }, 150)
}

// Handles direct typing change
const onInputChange = () => {
    debouncedGenerate()
}

// Load custom logo
const onLogoFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) {
        logoImage.value = null
        generateQrCode()
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
            logoImage.value = img
            generateQrCode()
        }
        img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

const clearLogoFile = () => {
    logoImage.value = null
    generateQrCode()
}

// Render QR code & paint Logo overlays
const generateQrCode = async () => {
    const canvas = qrCanvas.value
    if (!canvas) return

    try {
        const options = {
            errorCorrectionLevel: errorCorrectionLevel.value,
            margin: margin.value,
            width: size.value,
            color: {
                dark: foregroundColor.value,
                light: transparentBg.value ? "#00000000" : backgroundColor.value,
            },
        }

        const textToEncode = qrText.value || " "
        await QRCode.toCanvas(canvas, textToEncode, options)

        // Overlay central logo if activated
        if (showLogo.value && logoImage.value) {
            await drawLogoOverlay()
        }
    } catch (err) {
        console.error("QR Code generation error:", err)
    }
}

const drawLogoOverlay = async () => {
    const canvas = qrCanvas.value
    if (!canvas || !logoImage.value) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const qrSize = canvas.width
    const logoScale = logoSizePercent.value / 100
    const logoWidth = qrSize * logoScale
    const logoHeight = (logoImage.value.height / logoImage.value.width) * logoWidth

    const x = (qrSize - logoWidth) / 2
    const y = (qrSize - logoHeight) / 2

    if (clearLogoMargin.value) {
        const padding = logoWidth * 0.2
        ctx.fillStyle = transparentBg.value ? "#00000000" : backgroundColor.value
        
        if (transparentBg.value) {
            ctx.clearRect(x - padding, y - padding, logoWidth + padding * 2, logoHeight + padding * 2)
        } else {
            ctx.fillRect(x - padding, y - padding, logoWidth + padding * 2, logoHeight + padding * 2)
        }
    }

    ctx.drawImage(logoImage.value, x, y, logoWidth, logoHeight)
}

// Download exports
const downloadImage = (format: "png" | "jpeg") => {
    const canvas = qrCanvas.value
    if (!canvas) return

    const mimeType = format === "png" ? "image/png" : "image/jpeg"
    const dataUrl = canvas.toDataURL(mimeType)

    const link = document.createElement("a")
    link.download = `qrcode_${Date.now()}.${format}`
    link.href = dataUrl
    link.click()
    showSnackbar(t("download_success"), "success")
}

const downloadSvg = async () => {
    try {
        const options = {
            errorCorrectionLevel: errorCorrectionLevel.value,
            margin: margin.value,
            width: size.value,
            color: {
                dark: foregroundColor.value,
                light: transparentBg.value ? "#00000000" : backgroundColor.value,
            },
        }

        const textToEncode = qrText.value || " "
        let svgString = await QRCode.toString(textToEncode, {
            ...options,
            type: "svg",
        })

        // Embed custom logo into SVG
        if (showLogo.value && logoImage.value) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(svgString, "image/svg+xml")
            const svgElement = doc.documentElement

            const widthAttr = parseFloat(svgElement.getAttribute("width") || size.value.toString())
            const heightAttr = parseFloat(svgElement.getAttribute("height") || size.value.toString())

            const logoScale = logoSizePercent.value / 100
            const logoWidth = widthAttr * logoScale
            const logoHeight = (logoImage.value.height / logoImage.value.width) * logoWidth

            const x = (widthAttr - logoWidth) / 2
            const y = (heightAttr - logoHeight) / 2

            if (clearLogoMargin.value) {
                const padding = logoWidth * 0.2
                const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect")
                rect.setAttribute("x", (x - padding).toString())
                rect.setAttribute("y", (y - padding).toString())
                rect.setAttribute("width", (logoWidth + padding * 2).toString())
                rect.setAttribute("height", (logoHeight + padding * 2).toString())
                rect.setAttribute("fill", transparentBg.value ? "none" : backgroundColor.value)
                if (transparentBg.value) {
                    rect.setAttribute("style", "mix-blend-mode: destination-out;")
                }
                rect.setAttribute("rx", (padding * 0.5).toString())
                rect.setAttribute("ry", (padding * 0.5).toString())
                svgElement.appendChild(rect)
            }

            // Draw to a temp canvas to convert uploaded image to Base64
            const tempCanvas = document.createElement("canvas")
            tempCanvas.width = logoImage.value.width
            tempCanvas.height = logoImage.value.height
            const tempCtx = tempCanvas.getContext("2d")
            if (tempCtx) {
                tempCtx.drawImage(logoImage.value, 0, 0)
                const imgDataUrl = tempCanvas.toDataURL()

                const imageSvg = doc.createElementNS("http://www.w3.org/2000/svg", "image")
                imageSvg.setAttribute("x", x.toString())
                imageSvg.setAttribute("y", y.toString())
                imageSvg.setAttribute("width", logoWidth.toString())
                imageSvg.setAttribute("height", logoHeight.toString())
                imageSvg.setAttribute("href", imgDataUrl)

                svgElement.appendChild(imageSvg)
            }

            svgString = new XMLSerializer().serializeToString(doc)
        }

        const blob = new Blob([svgString], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = `qrcode_${Date.now()}.svg`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        showSnackbar(t("download_success"), "success")
    } catch (err) {
        console.error("SVG generation failed:", err)
        showSnackbar(t("download_error"), "error")
    }
}

// Clipboard integration
const copyToClipboard = () => {
    const canvas = qrCanvas.value
    if (!canvas) return

    try {
        canvas.toBlob(async (blob) => {
            if (!blob) {
                showSnackbar(t("copied_error"), "error")
                return
            }
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob,
                    }),
                ])
                showSnackbar(t("copied_success"), "success")
            } catch (err) {
                console.error("ClipboardItem write failed:", err)
                showSnackbar(t("copied_error"), "error")
            }
        }, "image/png")
    } catch (err) {
        console.error("Canvas toBlob failed:", err)
        showSnackbar(t("copied_error"), "error")
    }
}

// Web Share API
const shareQrCode = () => {
    const canvas = qrCanvas.value
    if (!canvas) return

    canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], "qrcode.png", { type: "image/png" })
        try {
            await navigator.share({
                title: t("share_title"),
                text: t("share_text"),
                files: [file],
            })
        } catch (err) {
            console.error("Web Share failed:", err)
        }
    }, "image/png")
}

// Toast System
const snackbar = ref({
    show: false,
    text: "",
    color: "success",
})

const showSnackbar = (text: string, color: string = "success") => {
    snackbar.value.text = text
    snackbar.value.color = color
    snackbar.value.show = true
}

onMounted(() => {
    // Detect Web Share compatibility for files
    if (navigator.share && navigator.canShare) {
        const testFile = new File([""], "test.png", { type: "image/png" })
        canShare.value = navigator.canShare({ files: [testFile] })
    }
    
    // Initial draw
    generateQrCode()
})
</script>

<style scoped>
.header-gradient {
    background: linear-gradient(135deg, var(--v-theme-primary) 0%, #8a2387 50%, #e94057 100%);
}

.card-glow {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background-color: var(--v-theme-surface);
}

.card-glow:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--v-theme-primary);
}

.color-preview-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.color-preview-btn:hover {
    transform: scale(1.1);
}

.qr-container-outer {
    width: 280px;
    height: 280px;
    border-radius: 12px;
    padding: 12px;
    background: var(--v-theme-surface);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.qr-container-inner {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-center: center;
}

.qr-canvas-preview {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.transparent-checkerboard {
    background-color: #ffffff;
    background-image: 
        linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
        linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);
    background-size: 16px 16px;
    background-position: 0 0, 8px 8px;
}
</style>
