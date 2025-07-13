import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        layoutTransition: { name: "layout", mode: "out-in" },
        baseURL: process.env.NUXT_APP_BASE_URL || "/",
    },
    build: {
        transpile: ["vuetify"],
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css", "@mdi/font/css/materialdesignicons.css"],

    // SSG Configuration for GitHub Pages
    nitro: {
        prerender: {
            routes: ["/", "/percentagecalculator", "/byteconverter"],
        },
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
    },

    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                config.plugins.push(
                    vuetify({
                        autoImport: true,
                    }),
                )
            })
        },
        "@nuxt/eslint",
    ],

    eslint: {
        // ESLint configuration options
    },

    // Runtime config for environment variables
    runtimeConfig: {
        public: {
            baseURL: process.env.NUXT_APP_BASE_URL || "/",
        },
    },
})
