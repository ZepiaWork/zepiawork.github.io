// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        // ... your configuration
        ssr: false,
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: '#6200EE',
                        secondary: '#03DAC6',
                        background: '#FFFFFF',
                        surface: '#FFFFFF',
                    }
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: '#BB86FC',
                        secondary: '#03DAC6',
                        background: '#121212',
                        surface: '#1E1E1E',
                    }
                }
            }
        }
    })
    app.vueApp.use(vuetify)
})
