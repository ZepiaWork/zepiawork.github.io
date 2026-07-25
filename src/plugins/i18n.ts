import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import th from '../locales/th.json'
import ja from '../locales/ja.json'
import de from '../locales/de.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    th,
    ja,
    de
  }
})
