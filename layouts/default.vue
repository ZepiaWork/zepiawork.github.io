<template>
    <v-app>
        <v-main>
            <slot />
        </v-main>

        <v-btn
            icon="mdi-cog"
            position="fixed"
            location="bottom right"
            class="ma-4"
            color="primary"
            elevation="8"
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
                    />

                    <v-select
                        v-model="language"
                        :items="locales"
                        item-title="name"
                        item-value="code"
                        :label="$t('language')"
                        @update:model-value="changeLanguage"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" text @click="dialog = false">{{ $t('close') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

type LocaleCode = 'en' | 'th' | 'ja' | 'de'

const theme = useTheme()
const { locale, locales } = useI18n()
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
}

function changeLanguage(newLocale: LocaleCode) {
    locale.value = newLocale
}

watch(locale, (newLocale) => {
    language.value = newLocale
})
</script>

<style></style>
