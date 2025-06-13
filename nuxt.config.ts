// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
    app: {
        layoutTransition: { name: "layout", mode: "out-in" }
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: false }, // Disable in production
    css: ["~/assets/css/main.css"],

    // Build optimizations
    nitro: {
        compressPublicAssets: true,
        minify: true,
        preset: process.env.NITRO_PRESET || "node-server"
    },

    // Optimization settings
    optimization: {
        treeShake: {
            composables: {
                // server: true,
                // client: true
            }
        }
    },

    // TypeScript configuration
    typescript: {
        typeCheck: process.env.NODE_ENV === "development" ? "build" : false
    },

    // Build configuration
    build: {
        transpile: ["@headlessui/vue", "@heroicons/vue"]
    },

    vite: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        "vue-vendor": ["vue", "vue-router"],
                        "ui-vendor": ["@headlessui/vue", "@heroicons/vue"]
                    }
                }
            },
            cssCodeSplit: true,
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: process.env.NODE_ENV === "production",
                    drop_debugger: process.env.NODE_ENV === "production"
                }
            }
        },
        optimizeDeps: {
            include: ["@headlessui/vue", "@heroicons/vue"],
            exclude: ["vue-demi"]
        },
        plugins: [tailwindcss()],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "~/assets/css/variables.scss" as *;`
                }
            }
        }
    },

    modules: ["@nuxt/eslint"],

    // Experimental features for better performance
    experimental: {
        payloadExtraction: false,
        treeshakeClientOnly: true
    }
})
