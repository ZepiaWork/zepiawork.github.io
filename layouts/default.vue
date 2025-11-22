<template>
    <v-app>
        <v-main>
            <slot />
        </v-main>

        <v-btn
            icon="mdi-cog"
            position="fixed"
            location="bottom right"
            class="ma-4"
            color="primary"
            elevation="8"
            @click="dialog = true"
        ></v-btn>

        <v-dialog v-model="dialog" width="300">
            <v-card>
                <v-card-title>Select Theme</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="selectedTheme"
                        :items="themes"
                        item-title="title"
                        item-value="value"
                        label="Theme"
                        @update:model-value="changeTheme"
                    ></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const dialog = ref(false)
const selectedTheme = ref(theme.global.name.value)
const themes = [
    { title: 'Light', value: 'light' },
    { title: 'Dark', value: 'dark' },
    { title: 'Red', value: 'red' },
    { title: 'Green', value: 'green' },
    { title: 'Blue', value: 'blue' },
]

function changeTheme(newTheme: string) {
    theme.change(newTheme)
}
</script>

<style></style>
