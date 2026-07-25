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
                        :items="locales"
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

const theme = useTheme()
const { locale, locales, setLocale } = useI18n()
const dialog = ref(false)
const selectedTheme = ref(theme.global.name.value)
const themes = [
    { title: 'Light', value: 'light' },
    { title: 'Dark', value: 'dark' },
    { title: 'Red', value: 'red' },
    { title: 'Green', value: 'green' },
    { title: 'Blue', value: 'blue' },
]

const language = ref(locale.value)

function changeTheme(newTheme: string) {
    theme.change(newTheme)
    if (import.meta.client) {
        localStorage.setItem('zepia_theme', newTheme)
    }
}

watch(language, (newVal) => {
    if (newVal !== locale.value) {
        setLocale(newVal)
        if (import.meta.client) {
            localStorage.setItem('zepia_locale', newVal)
        }
    }
})

watch(locale, (newVal) => {
    language.value = newVal
})

type LocaleCode = 'en' | 'th' | 'ja' | 'de'

onMounted(() => {
    if (import.meta.client) {
        const savedTheme = localStorage.getItem('zepia_theme')
        if (savedTheme && themes.some(t => t.value === savedTheme)) {
            selectedTheme.value = savedTheme
            theme.change(savedTheme)
        }
        const savedLocale = localStorage.getItem('zepia_locale')
        if (savedLocale && locales.value.some((l: { code: string }) => l.code === savedLocale)) {
            const loc = savedLocale as LocaleCode
            language.value = loc
            setLocale(loc)
        }
    }
})
</script>

<style scoped></style>
