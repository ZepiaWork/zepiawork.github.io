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
                },
                red: {
                    dark: false,
                    colors: {
                        primary: '#D32F2F',
                        secondary: '#FFCDD2',
                        background: '#FFEBEE',
                        surface: '#FFEBEE',
                    }
                },
                green: {
                    dark: false,
                    colors: {
                        primary: '#388E3C',
                        secondary: '#C8E6C9',
                        background: '#E8F5E9',
                        surface: '#E8F5E9',
                    }
                },
                blue: {
                    dark: false,
                    colors: {
                        primary: '#1976D2',
                        secondary: '#BBDEFB',
                        background: '#E3F2FD',
                        surface: '#E3F2FD',
                    }
                }
            }
        }
    })
    app.vueApp.use(vuetify)
})
