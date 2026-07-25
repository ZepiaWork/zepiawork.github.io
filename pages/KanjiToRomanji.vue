<template>
    <v-container class="pa-4 pa-md-6">
        <v-row justify="center">
            <v-col cols="12">
                <v-card class="elevation-3" :loading="isInitializing">
                    <v-card-title class="text-h5 text-md-h4 py-4 d-flex align-center">
                        <v-icon icon="mdi-translate" class="mr-3" color="primary"></v-icon>
                        {{ t('kanji_to_romanji') }}
                    </v-card-title>
                    <v-card-subtitle v-if="isInitializing" class="text-primary pb-4">
                        {{ t('initializing_translator') }}
                    </v-card-subtitle>

                    <v-card-text class="pa-4 pa-md-6">
                        <v-row class="mb-4">
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="targetMode"
                                    :items="targetModes"
                                    item-title="title"
                                    item-value="value"
                                    :label="t('kanji_output_mode')"
                                    variant="outlined"
                                    density="comfortable"
                                    hide-details
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-textarea
                                    v-model="inputText"
                                    :label="t('japanese_text')"
                                    :placeholder="t('enter_japanese_lyrics')"
                                    variant="outlined"
                                    rows="15"
                                    hide-details
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-textarea
                                    v-model="outputText"
                                    :label="t('romanji_result')"
                                    variant="outlined"
                                    rows="15"
                                    readonly
                                    hide-details
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center mt-4">
                                <v-btn
                                    color="primary"
                                    size="x-large"
                                    prepend-icon="mdi-swap-horizontal"
                                    @click="translateText"
                                    :loading="isTranslating"
                                    :disabled="isInitializing || !inputText.trim()"
                                >
                                    {{ t('translate') }}
                                </v-btn>
                                
                                <v-btn
                                    variant="outlined"
                                    color="secondary"
                                    size="x-large"
                                    prepend-icon="mdi-content-copy"
                                    class="ml-4"
                                    @click="copyResult"
                                    :disabled="!outputText"
                                >
                                    {{ t('copy_result') }}
                                </v-btn>
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

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

definePageMeta({
    layout: "single-page",
})

const { t } = useI18n()

useHead({
    title: t('kanji_to_romanji') + ' | Zepia Playground',
})

useSeoMeta({
    title: t('kanji_to_romanji'),
    description: t('kanji_to_romanji_desc'),
})

const inputText = ref('')
const outputText = ref('')
const isInitializing = ref(true)
const isTranslating = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

type TargetMode = 'romaji' | 'hiragana' | 'katakana'
const targetMode = ref<TargetMode>('romaji')

const targetModes = computed(() => [
    { title: t('romaji'), value: 'romaji' },
    { title: t('hiragana'), value: 'hiragana' },
    { title: t('katakana'), value: 'katakana' },
])

let kuroshiro: any = null

onMounted(async () => {
    try {
        kuroshiro = new Kuroshiro()
        await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict' }))
        isInitializing.value = false
    } catch (error) {
        console.error("Failed to initialize Kuroshiro:", error)
        isInitializing.value = false
    }
})

async function translateText() {
    if (!inputText.value.trim() || !kuroshiro) return
    isTranslating.value = true
    try {
        outputText.value = await kuroshiro.convert(inputText.value, { to: targetMode.value, mode: 'spaced' })
    } catch (error) {
        console.error("Translation error:", error)
        snackbarText.value = t('translation_error')
        snackbar.value = true
    } finally {
        isTranslating.value = false
    }
}

function copyResult() {
    if (outputText.value) {
        navigator.clipboard.writeText(outputText.value)
        snackbarText.value = t('copied_to_clipboard')
        snackbar.value = true
    }
}
</script>

<style scoped>
</style>
