<template>
    <div>
        <v-btn
            icon="mdi-cog"
            position="fixed"
            location="bottom right"
            class="ma-4"
            color="primary"
            elevation="8"
            style="z-index: 1000;"
            @click="dialog = true"
        />

        <v-dialog v-model="dialog" width="300">
            <v-card>
                <v-card-title>{{ $t('select_theme') }}</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="selectedTheme"
                        :items="themes"
                        item-title="title"
                        item-value="value"
                        :label="$t('theme')"
                        @update:model-value="changeTheme"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props" :title="$t(item.raw.value)" />
                        </template>
                        <template #selection="{ item }">
                            {{ $t(item.raw.value) }}
                        </template>
                    </v-select>

                    <v-select
                        v-model="language"
                        :items="localesList"
                        item-title="name"
                        item-value="code"
                        :label="$t('language')"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" variant="text" @click="dialog = false">{{ $t('close') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

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
    { code: 'en', name: 'English' },
    { code: 'th', name: 'ไทย' },
    { code: 'ja', name: '日本語' },
    { code: 'de', name: 'Deutsch' },
]

const language = ref(locale.value)

function changeTheme(newTheme: string) {
    theme.global.name.value = newTheme
    localStorage.setItem('zepia_theme', newTheme)
}

watch(language, (newVal) => {
    if (newVal !== locale.value) {
        locale.value = newVal
        localStorage.setItem('zepia_locale', newVal)
    }
})

watch(locale, (newVal) => {
    language.value = newVal
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
})
</script>

<style scoped></style>
