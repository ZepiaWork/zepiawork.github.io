<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col
        cols="12"
        lg="11"
        xl="10"
      >
        <v-card class="elevation-3 rounded-xl overflow-hidden">
          <!-- Premium Header -->
          <div class="header-gradient text-white py-6 px-6 text-center position-relative">
            <h1 class="text-h4 font-weight-bold mb-2">{{ t('qr_code_generator_title') }}</h1>
            <p class="text-subtitle-1 opacity-80">{{ t('qr_code_generator_subtitle') }}</p>
          </div>

          <v-card-text class="pa-4 pa-md-6">
            <v-row>
              <!-- Left Column: Settings and Inputs -->
              <v-col cols="12" md="7">
                <!-- Preset Mode Tabs -->
                <v-card variant="outlined" class="pa-4 mb-4 rounded-lg card-glow">
                  <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0 d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-form-select</v-icon>
                    {{ t('qr_text_title') }}
                  </v-card-title>

                  <v-tabs v-model="activeInputTab" color="primary" class="mb-4" density="comfortable" show-arrows>
                    <v-tab value="text">{{ t('tab_text') }}</v-tab>
                    <v-tab value="wifi">{{ t('tab_wifi') }}</v-tab>
                    <v-tab value="vcard">{{ t('tab_vcard') }}</v-tab>
                    <v-tab value="email">{{ t('tab_email') }}</v-tab>
                    <v-tab value="sms">{{ t('tab_sms') }}</v-tab>
                  </v-tabs>

                  <!-- 1. Text / URL Tab -->
                  <div v-show="activeInputTab === 'text'">
                    <v-textarea
                      v-model="rawText"
                      :label="t('qr_text_label')"
                      :placeholder="t('qr_text_placeholder')"
                      variant="outlined"
                      rows="3"
                      counter
                      maxlength="1000"
                      persistent-hint
                      :hint="t('qr_text_hint')"
                      @input="onInputChange"
                    />
                  </div>

                  <!-- 2. Wi-Fi Tab -->
                  <div v-show="activeInputTab === 'wifi'">
                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="wifi.ssid"
                          :label="t('wifi_ssid')"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="wifi.password"
                          :label="t('wifi_password')"
                          type="password"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="wifi.encryption"
                          :items="['WPA', 'WEP', 'nopass']"
                          :label="t('wifi_encryption')"
                          variant="outlined"
                          density="comfortable"
                          @update:model-value="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-checkbox
                          v-model="wifi.hidden"
                          :label="t('wifi_hidden')"
                          density="compact"
                          hide-details
                          @update:model-value="onPresetChange"
                        />
                      </v-col>
                    </v-row>
                  </div>

                  <!-- 3. vCard Tab -->
                  <div v-show="activeInputTab === 'vcard'">
                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="vcard.name"
                          :label="t('vcard_name')"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="vcard.phone"
                          :label="t('vcard_phone')"
                          type="tel"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="vcard.email"
                          :label="t('vcard_email')"
                          type="email"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="vcard.company"
                          :label="t('vcard_company')"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                    </v-row>
                  </div>

                  <!-- 4. Email Tab -->
                  <div v-show="activeInputTab === 'email'">
                    <v-row dense>
                      <v-col cols="12">
                        <v-text-field
                          v-model="emailPreset.to"
                          :label="t('email_address')"
                          type="email"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="emailPreset.subject"
                          :label="t('email_subject')"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="emailPreset.body"
                          :label="t('email_body')"
                          rows="2"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                    </v-row>
                  </div>

                  <!-- 5. SMS Tab -->
                  <div v-show="activeInputTab === 'sms'">
                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="smsPreset.phone"
                          :label="t('sms_phone')"
                          type="tel"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="smsPreset.message"
                          :label="t('sms_message')"
                          rows="2"
                          variant="outlined"
                          density="comfortable"
                          @input="onPresetChange"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-card>

                <!-- Design & Colors -->
                <v-card variant="outlined" class="pa-4 mb-4 rounded-lg card-glow">
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
                        density="comfortable"
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
                <v-card variant="outlined" class="pa-4 rounded-lg card-glow">
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
                  class="pa-4 w-100 d-flex flex-column align-center justify-center rounded-lg card-glow mb-4"
                  style="min-height: 420px;"
                >
                  <v-card-subtitle class="text-subtitle-1 mb-4 text-center font-weight-bold">
                    {{ t('qr_preview_title') }}
                  </v-card-subtitle>

                  <!-- QR Code Display Box -->
                  <div class="qr-container-outer mb-4 d-flex justify-center align-center">
                    <div class="qr-container-inner" :class="{ 'transparent-checkerboard': transparentBg }">
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

                <!-- Recent Saved History -->
                <v-card v-if="qrHistory.length > 0" variant="outlined" class="pa-4 w-100 rounded-lg card-glow">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption font-weight-bold text-medium-emphasis">{{ t('recent_qr') }}</span>
                    <v-btn size="x-small" variant="text" color="error" @click="clearQrHistory">{{ t('clear_history') }}</v-btn>
                  </div>
                  <v-list density="compact" class="pa-0">
                    <v-list-item
                      v-for="(item, idx) in qrHistory.slice(0, 5)"
                      :key="idx"
                      class="px-2 py-1 rounded"
                    >
                      <v-list-item-title class="text-caption text-truncate" style="max-width: 180px;">
                        {{ item }}
                      </v-list-item-title>
                      <template #append>
                        <v-btn
                          size="x-small"
                          variant="text"
                          color="primary"
                          @click="loadFromHistory(item)"
                        >
                          {{ t('load_qr') }}
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
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
import { ref, computed, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import PageHeader from "@/components/Core/PageHeader.vue"
import QRCode from "qrcode"

const { t } = useI18n()

const HISTORY_KEY = 'zepia_qr_history'

// Tabs
const activeInputTab = ref<string>('text')
const rawText = ref<string>("https://zepiawork.github.io")

// Presets State
const wifi = ref({
  ssid: '',
  password: '',
  encryption: 'WPA',
  hidden: false,
})

const vcard = ref({
  name: '',
  phone: '',
  email: '',
  company: '',
})

const emailPreset = ref({
  to: '',
  subject: '',
  body: '',
})

const smsPreset = ref({
  phone: '',
  message: '',
})

// QR Design States
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

// History & DOM
const qrHistory = ref<string[]>([])
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const canShare = ref<boolean>(false)

// Computed active text to encode
const activeEncodedText = computed(() => {
  switch (activeInputTab.value) {
    case 'wifi': {
      const { ssid, password, encryption, hidden } = wifi.value
      if (!ssid) return 'WIFI:S:;;'
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`
    }
    case 'vcard': {
      const { name, phone, email, company } = vcard.value
      return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nORG:${company}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`
    }
    case 'email': {
      const { to, subject, body } = emailPreset.value
      const params = new URLSearchParams()
      if (subject) params.append('subject', subject)
      if (body) params.append('body', body)
      const query = params.toString()
      return `mailto:${to}${query ? '?' + query : ''}`
    }
    case 'sms': {
      const { phone, message } = smsPreset.value
      return `SMSTO:${phone}:${message}`
    }
    default:
      return rawText.value || ' '
  }
})

let timeoutId: ReturnType<typeof setTimeout> | null = null
const debouncedGenerate = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    generateQrCode()
    saveToHistory(activeEncodedText.value)
  }, 150)
}

const onInputChange = () => {
  debouncedGenerate()
}

const onPresetChange = () => {
  debouncedGenerate()
}

watch(activeInputTab, () => {
  debouncedGenerate()
})

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

    const textToEncode = activeEncodedText.value || " "
    await QRCode.toCanvas(canvas, textToEncode, options)

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

    const textToEncode = activeEncodedText.value || " "
    let svgString = await QRCode.toString(textToEncode, {
      ...options,
      type: "svg",
    })

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
          new ClipboardItem({ [blob.type]: blob }),
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

const saveToHistory = (text: string) => {
  if (!text || text.trim() === '' || text.length > 200) return
  const current = qrHistory.value.filter(item => item !== text)
  current.unshift(text)
  qrHistory.value = current.slice(0, 10)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(qrHistory.value))
}

const clearQrHistory = () => {
  qrHistory.value = []
  localStorage.removeItem(HISTORY_KEY)
}

const loadFromHistory = (text: string) => {
  activeInputTab.value = 'text'
  rawText.value = text
  debouncedGenerate()
}

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
})

const showSnackbar = (text: string, color = "success") => {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}

onMounted(() => {
  if (typeof navigator.canShare === 'function') {
    const testFile = new File([""], "test.png", { type: "image/png" })
    canShare.value = navigator.canShare({ files: [testFile] })
  }

  const savedHistory = localStorage.getItem(HISTORY_KEY)
  if (savedHistory) {
    try {
      qrHistory.value = JSON.parse(savedHistory)
    } catch (e) {
      console.error(e)
    }
  }

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
  align-items: center;
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
