<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col cols="12" lg="11" xl="10">
        <v-card class="elevation-3 rounded-xl overflow-hidden" :loading="isInitializing">
          <v-card-title class="text-h5 text-md-h4 py-6 px-6 font-weight-bold d-flex align-center">
            <v-icon icon="mdi-translate" class="mr-3" color="primary" />
            {{ t('kanji_to_romanji') }}
          </v-card-title>

          <!-- Initialization Banner -->
          <v-alert
            v-if="isInitializing"
            type="info"
            variant="tonal"
            class="mx-6 mb-4 rounded-lg"
          >
            <div class="d-flex align-center">
              <v-progress-circular indeterminate size="20" width="2" color="primary" class="mr-3" />
              <span>{{ t('initializing_translator') }}</span>
            </div>
          </v-alert>

          <!-- Error Banner with Retry -->
          <v-alert
            v-if="initError"
            type="error"
            variant="tonal"
            class="mx-6 mb-4 rounded-lg"
          >
            <div class="d-flex align-center justify-space-between flex-wrap ga-2">
              <span>{{ t('dict_error') }}</span>
              <v-btn
                size="small"
                color="error"
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="initTranslator"
              >
                {{ t('retry') }}
              </v-btn>
            </div>
          </v-alert>

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
                  rows="12"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="6">
                <div class="d-flex flex-column h-100">
                  <v-textarea
                    v-if="targetMode !== 'furigana_ruby'"
                    v-model="outputText"
                    :label="t('romanji_result')"
                    variant="outlined"
                    rows="12"
                    readonly
                    hide-details
                  />

                  <!-- Ruby Furigana Rendered Card -->
                  <v-card
                    v-else
                    variant="outlined"
                    class="pa-4 h-100 overflow-y-auto rounded-lg"
                    style="min-height: 280px;"
                  >
                    <div class="text-caption text-medium-emphasis mb-2 font-weight-bold">
                      {{ t('furigana_ruby') }} Preview
                    </div>
                    <div
                      v-if="outputText"
                      class="ruby-preview text-body-1"
                      v-html="outputText"
                    />
                    <div v-else class="text-medium-emphasis text-caption">
                      {{ t('romanji_result') }}
                    </div>
                  </v-card>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex justify-center flex-wrap ga-3 mt-4">
                <v-btn
                  color="primary"
                  size="x-large"
                  prepend-icon="mdi-swap-horizontal"
                  rounded="lg"
                  :loading="isTranslating"
                  :disabled="isInitializing || !inputText.trim() || initError"
                  @click="translateText"
                >
                  {{ t('translate') }}
                </v-btn>

                <v-btn
                  variant="outlined"
                  color="secondary"
                  size="x-large"
                  prepend-icon="mdi-content-copy"
                  rounded="lg"
                  :disabled="!outputText"
                  @click="copyResult"
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
import { useI18n } from 'vue-i18n'
import PageHeader from "@/components/Core/PageHeader.vue"
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

const { t } = useI18n()

const inputText = ref('日本語のテキストを入力してローマ字やふりがなに変換します。\n東京は日本の首都です。')
const outputText = ref('')
const isInitializing = ref(true)
const initError = ref(false)
const isTranslating = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

type TargetMode = 'romaji' | 'hiragana' | 'katakana' | 'furigana_ruby' | 'furigana_bracket'
const targetMode = ref<TargetMode>('romaji')

const targetModes = computed(() => [
  { title: t('romaji'), value: 'romaji' },
  { title: t('hiragana'), value: 'hiragana' },
  { title: t('katakana'), value: 'katakana' },
  { title: t('furigana_ruby'), value: 'furigana_ruby' },
  { title: t('furigana_bracket'), value: 'furigana_bracket' },
])

let kuroshiro: Kuroshiro | null = null

async function initTranslator() {
  isInitializing.value = true
  initError.value = false
  try {
    kuroshiro = new Kuroshiro()
    await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict' }))
    isInitializing.value = false
  } catch (error) {
    console.error("Failed to initialize Kuroshiro:", error)
    initError.value = true
    isInitializing.value = false
  }
}

onMounted(() => {
  initTranslator()
})

async function translateText() {
  if (!inputText.value.trim() || !kuroshiro) return
  isTranslating.value = true
  try {
    if (targetMode.value === 'furigana_ruby') {
      outputText.value = await kuroshiro.convert(inputText.value, { to: 'hiragana', mode: 'furigana' })
    } else if (targetMode.value === 'furigana_bracket') {
      outputText.value = await kuroshiro.convert(inputText.value, { to: 'hiragana', mode: 'okurigana' })
    } else {
      outputText.value = await kuroshiro.convert(inputText.value, { to: targetMode.value, mode: 'spaced' })
    }
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
.ruby-preview :deep(ruby) {
  font-size: 1.25rem;
  line-height: 2.2rem;
  margin-right: 4px;
}
.ruby-preview :deep(rt) {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-primary));
}
</style>
