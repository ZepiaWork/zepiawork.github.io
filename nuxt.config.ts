import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        layoutTransition: { name: "layout", mode: "out-in" },
        baseURL: process.env.NUXT_APP_BASE_URL || "/",
        head: {
            title: "Zepia Playground", // default fallback title
            htmlAttrs: {
                lang: "en",
            },
        },
    },
    build: {
        transpile: ["vuetify"],
    },
    compatibilityDate: "2024-11-01",
    css: ["~/assets/css/main.css"],

    // SSG Configuration for GitHub Pages
    nitro: {
        preset: "static",
    },

    // TypeScript configuration
    typescript: {
        strict: true,
        typeCheck: true,
    },

    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
        define: {
            "process.env.DEBUG": false,
        },
        plugins: [vuetify({ autoImport: true })],
        optimizeDeps: {
            include: ["vuetify"],
        },
    },
    plugins: ['~/plugins/vuetify.client'],
    modules: ["@nuxt/eslint", "@nuxtjs/i18n"],

    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'th', name: 'Thai', file: 'th.json' },
            { code: 'ja', name: 'Japanese', file: 'ja.json' },
            { code: 'de', name: 'German', file: 'de.json' },
        ],
        defaultLocale: 'en',
        langDir: 'locales',
        strategy: 'no_prefix',
        vueI18n: {
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
        },
    },

    // Runtime config for environment variables
    runtimeConfig: {
        public: {
            baseURL: process.env.NUXT_APP_BASE_URL || "/",
        },
    },
})
