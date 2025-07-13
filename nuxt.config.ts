import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        layoutTransition: { name: "layout", mode: "out-in" },
    },
    build: {
        transpile: ["vuetify"],
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }))
            })
        },
        "@nuxt/eslint",
    ],
})
