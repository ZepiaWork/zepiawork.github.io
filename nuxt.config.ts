import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        layoutTransition: { name: "layout", mode: "out-in" }
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        optimizeDeps: {
            include: ["@headlessui/vue", "@heroicons/vue"],
            exclude: ["vue-demi"]
        },
        plugins: [tailwindcss()]
    },
    modules: ["@nuxt/eslint"]
})
