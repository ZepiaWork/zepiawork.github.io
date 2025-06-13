// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
    app: {
        layoutTransition: { name: "layout", mode: "out-in" }
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: false },
    css: ["~/assets/css/main.css"],

    // Remove @nuxtjs/tailwindcss from modules since we're using v4
    modules: ["@nuxt/eslint"],

    nitro: {
        compressPublicAssets: true,
        minify: true,
        preset: process.env.NITRO_PRESET || "node-server"
    },

    vite: {
        optimizeDeps: {
            include: ["@headlessui/vue", "@heroicons/vue"],
            exclude: ["vue-demi"]
        },
        plugins: [tailwindcss()],
        css: {
            postcss: {
                plugins: [
                    // Ensure TailwindCSS is processed correctly
                ]
            }
        }
    },

    typescript: {
        typeCheck: process.env.NODE_ENV === "development" ? "build" : false
    },

    experimental: {
        payloadExtraction: false,
        treeshakeClientOnly: true
    }
})
