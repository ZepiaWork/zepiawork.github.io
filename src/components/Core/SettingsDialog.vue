<template>
  <div>
    <!-- Floating Quick Settings Trigger -->
    <v-tooltip :text="$t('settings')" location="left">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-cog"
          position="fixed"
          location="bottom right"
          class="ma-4 settings-fab"
          color="primary"
          elevation="6"
          size="large"
          aria-label="Settings"
          @click="dialog = true"
        />
      </template>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="360" transition="dialog-transition">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex align-center pt-3 px-4">
          <v-icon color="primary" class="mr-2">mdi-tune</v-icon>
          <span class="text-h6 font-weight-bold">{{ $t('settings') }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" @click="dialog = false" />
        </v-card-title>

        <v-card-text class="px-4 py-3">
          <!-- Theme selector with colored preview dots -->
          <div class="mb-4">
            <v-label class="text-caption font-weight-bold mb-2 d-block">{{ $t('theme') }}</v-label>
            <v-select
              v-model="selectedTheme"
              :items="themes"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="changeTheme"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :title="$t(item.raw.value)">
                  <template #prepend>
                    <div
                      class="theme-color-dot mr-3"
                      :style="{ backgroundColor: getThemePreviewColor(item.raw.value) }"
                    />
                  </template>
                </v-list-item>
              </template>
              <template #selection="{ item }">
                <div class="d-flex align-center">
                  <div
                    class="theme-color-dot mr-2"
                    :style="{ backgroundColor: getThemePreviewColor(item.raw.value) }"
                  />
                  <span>{{ $t(item.raw.value) }}</span>
                </div>
              </template>
            </v-select>
          </div>

          <!-- Language Selector -->
          <div class="mb-2">
            <v-label class="text-caption font-weight-bold mb-2 d-block">{{ $t('language') }}</v-label>
            <v-select
              v-model="language"
              :items="localesList"
              item-title="name"
              item-value="code"
              variant="outlined"
              density="comfortable"
              hide-details
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :title="item.raw.name">
                  <template #prepend>
                    <span class="text-h6 mr-3">{{ item.raw.flag }}</span>
                  </template>
                </v-list-item>
              </template>
              <template #selection="{ item }">
                <div class="d-flex align-center">
                  <span class="mr-2">{{ item.raw.flag }}</span>
                  <span>{{ item.raw.name }}</span>
                </div>
              </template>
            </v-select>
          </div>
        </v-card-text>

        <v-card-actions class="px-4 pb-3">
          <v-spacer />
          <v-btn color="primary" variant="tonal" rounded="pill" class="px-6" @click="dialog = false">
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { updatePageTitle } from '@/router'

const theme = useTheme()
const { locale } = useI18n()
const dialog = ref(false)
const selectedTheme = ref(theme.global.name.value)

const themes = [
  { title: 'Light', value: 'light' },
  { title: 'Dark', value: 'dark' },
  { title: 'Red', value: 'red' },
  { title: 'Green', value: 'green' },
  { title: 'Blue', value: 'blue' },
]

const localesList = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

const language = ref(locale.value)

function getThemePreviewColor(themeKey: string): string {
  switch (themeKey) {
    case 'light': return '#6200EE'
    case 'dark': return '#BB86FC'
    case 'red': return '#D32F2F'
    case 'green': return '#388E3C'
    case 'blue': return '#1976D2'
    default: return '#6200EE'
  }
}

function changeTheme(newTheme: string) {
  theme.global.name.value = newTheme
  localStorage.setItem('zepia_theme', newTheme)
}

watch(language, (newVal) => {
  if (newVal !== locale.value) {
    locale.value = newVal
    localStorage.setItem('zepia_locale', newVal)
    updatePageTitle()
  }
})

watch(locale, (newVal) => {
  language.value = newVal
  updatePageTitle()
})

onMounted(() => {
  const savedTheme = localStorage.getItem('zepia_theme')
  if (savedTheme && themes.some(t => t.value === savedTheme)) {
    selectedTheme.value = savedTheme
    theme.global.name.value = savedTheme
  }
  const savedLocale = localStorage.getItem('zepia_locale')
  if (savedLocale && localesList.some(l => l.code === savedLocale)) {
    language.value = savedLocale
    locale.value = savedLocale
  }
  updatePageTitle()
})

defineExpose({
  open: () => { dialog.value = true }
})
</script>

<style scoped>
.settings-fab {
  z-index: 1000;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.settings-fab:hover {
  transform: rotate(30deg) scale(1.05);
}
.theme-color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
}
</style>
