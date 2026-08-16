<template>
  <v-app-bar flat border class="px-2 px-md-4 app-header" density="comfortable">
    <!-- Brand / Home Link -->
    <v-btn
      to="/"
      variant="text"
      class="text-none px-2 font-weight-bold d-flex align-center brand-btn"
      rounded="lg"
    >
      <v-icon icon="mdi-toolbox-outline" color="primary" size="28" class="mr-2" />
      <span class="text-subtitle-1 text-md-h6 font-weight-bold text-primary brand-text">
        {{ $t('app_title') }}
      </span>
    </v-btn>

    <!-- Active Tool Breadcrumb -->
    <template v-if="currentToolName">
      <v-icon icon="mdi-chevron-right" size="small" class="text-medium-emphasis mx-1" />
      <v-chip
        size="small"
        color="primary"
        variant="tonal"
        class="font-weight-medium text-truncate"
        style="max-width: 180px;"
      >
        {{ $t(currentToolName) }}
      </v-chip>
    </template>

    <v-spacer />

    <!-- Action Buttons -->
    <div class="d-flex align-center ga-1">
      <!-- Quick Language Switcher Menu -->
      <v-menu location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            variant="text"
            rounded="pill"
            density="comfortable"
            class="text-none px-2"
          >
            <span class="mr-1">{{ currentLanguageFlag }}</span>
            <span class="d-none d-sm-inline text-caption font-weight-bold">{{ currentLanguageCode.toUpperCase() }}</span>
            <v-icon icon="mdi-menu-down" size="small" />
          </v-btn>
        </template>
        <v-list density="compact" class="rounded-lg elevation-4">
          <v-list-item
            v-for="item in languages"
            :key="item.code"
            :active="item.code === currentLanguageCode"
            @click="setLanguage(item.code)"
          >
            <template #prepend>
              <span class="text-body-1 mr-2">{{ item.flag }}</span>
            </template>
            <v-list-item-title class="text-caption font-weight-medium">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Quick Theme Switcher -->
      <v-menu location="bottom end">
        <template #activator="{ props: themeProps }">
          <v-btn
            v-bind="themeProps"
            icon="mdi-palette-outline"
            variant="text"
            density="comfortable"
            :title="$t('select_theme')"
          />
        </template>
        <v-list density="compact" class="rounded-lg elevation-4">
          <v-list-item
            v-for="item in themes"
            :key="item.value"
            :active="item.value === currentTheme"
            @click="setTheme(item.value)"
          >
            <template #prepend>
              <div
                class="theme-mini-dot mr-2"
                :style="{ backgroundColor: item.color }"
              />
            </template>
            <v-list-item-title class="text-caption">
              {{ $t(item.value) }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- GitHub Link -->
      <v-btn
        icon="mdi-github"
        variant="text"
        density="comfortable"
        href="https://github.com/ZepiaWork/zepiawork.github.io"
        target="_blank"
        rel="noopener noreferrer"
        :title="$t('github')"
      />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { updatePageTitle } from '@/router'

const route = useRoute()
const { locale } = useI18n()
const theme = useTheme()

const currentToolName = computed(() => {
  const titleKey = route.meta?.titleKey as string | undefined
  if (titleKey && titleKey !== 'app_title') {
    return titleKey
  }
  return null
})

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

const themes = [
  { value: 'light', color: '#6200EE' },
  { value: 'dark', color: '#BB86FC' },
  { value: 'red', color: '#D32F2F' },
  { value: 'green', color: '#388E3C' },
  { value: 'blue', color: '#1976D2' },
]

const currentLanguageCode = computed(() => locale.value)
const currentLanguageFlag = computed(() => {
  return languages.find(l => l.code === locale.value)?.flag || '🌐'
})
const currentTheme = computed(() => theme.global.name.value)

function setLanguage(code: string) {
  locale.value = code
  localStorage.setItem('zepia_locale', code)
  updatePageTitle()
}

function setTheme(themeName: string) {
  theme.global.name.value = themeName
  localStorage.setItem('zepia_theme', themeName)
}
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
  background-color: var(--v-theme-surface);
  position: sticky;
  top: 0;
  z-index: 100;
}
.brand-btn:hover {
  background-color: transparent !important;
  opacity: 0.85;
}
.theme-mini-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
}
</style>
