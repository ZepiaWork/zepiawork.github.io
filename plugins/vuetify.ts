// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import {
    VApp,
    VBtn,
    VCard,
    VCardText,
    VCardTitle,
    VCardSubtitle,
    VCol,
    VContainer,
    VRow,
    VTextField,
    VSelect,
} from "vuetify/components"

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        // ... your configuration
        ssr: false,
        components: {
            VApp,
        },
    })
    app.vueApp.use(vuetify)
})
