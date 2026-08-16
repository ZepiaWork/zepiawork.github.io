# Zepia Playground

Welcome to **Zepia Playground**—a multi-utility toolbox web application built using [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), and [Vuetify 3](https://vuetifyjs.com/). The project is built as a Single Page Application (SPA) optimized for deployment to [GitHub Pages](https://zepiawork.github.io/).

---

## 🛠️ Tech Stack

*   **Framework & Bundler**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) (Composition API, `<script setup>`)
*   **Routing**: [Vue Router 4](https://router.vuejs.org/) (HTML5 history mode)
*   **UI Library**: [Vuetify 3](https://vuetifyjs.com/) (with custom color palettes and Material Design Icons)
*   **Localization (i18n)**: [Vue I18n 11](https://vue-i18n.intlify.dev/) (supports English, Thai, Japanese, and German)
*   **Transliteration Engine**: [Kuroshiro](https://github.com/dodo/kuroshiro) & [Kuromoji Analyzer](https://github.com/takuyaa/kuromoji.js) (for Kanji-to-Romaji / Furigana translations)
*   **QR Code Engine**: [qrcode](https://www.npmjs.com/package/qrcode) (high-resolution canvas & SVG export with custom logo overlay)
*   **Typography & Styling**: Vanilla CSS with custom `InterVariable` typography
*   **Hosting**: Static hosting on GitHub Pages via GitHub Actions workflow

---

## 📂 Project Directory Structure

```text
zepiawork.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow for building & deploying to GitHub Pages
├── public/                  # Public static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/              # Fonts and stylesheets
│   │   ├── css/
│   │   │   ├── fonts.css
│   │   │   └── main.css
│   │   └── fonts/
│   ├── components/          # Shared components
│   │   └── Core/
│   │       ├── AppHeader.vue      # Persistent modern top navigation bar
│   │       ├── PageHeader.vue     # Utility page header / navigation
│   │       └── SettingsDialog.vue # Theme & language customization modal
│   ├── locales/             # i18n translation dictionaries
│   │   ├── de.json          # German
│   │   ├── en.json          # English
│   │   ├── ja.json          # Japanese
│   │   └── th.json          # Thai
│   ├── plugins/             # Application plugins
│   │   ├── i18n.ts          # Vue I18n initialization
│   │   └── vuetify.ts       # Vuetify 3 theme initialization
│   ├── router/
│   │   └── index.ts         # Vue Router routes and dynamic title updates
│   ├── views/               # Utility tool views
│   │   ├── ByteConverter.vue        # Data unit converter (Binary IEC & Decimal SI)
│   │   ├── CarDetailGenerator.vue   # ISO 3779 VIN & Engine generator with checksum
│   │   ├── ExpenseOverview.vue      # Proportional visual budget manager with LocalStorage
│   │   ├── HomeView.vue             # Dashboard hub with search & category filtering
│   │   ├── KanjiToRomanji.vue       # Kanji transliteration & Furigana ruby annotations
│   │   ├── PercentageCalculator.vue # Multi-mode percentage calculator with visual bar
│   │   ├── QrCodeGenerator.vue      # QR code creator with presets, styling & logo overlay
│   │   └── ThaiIDGenerator.vue      # Thai Citizen ID generator, validator & structure guide
│   ├── App.vue              # Main application shell
│   ├── main.ts              # Application entry point
│   ├── auto-imports.d.ts    # Auto-imported Vue & Router types
│   ├── components.d.ts      # Auto-imported component types
│   └── vite-env.d.ts        # Vite environment type declarations
├── eslint.config.mjs        # ESLint flat configuration (Vue 3 + TypeScript)
├── global.d.ts              # Global module declarations
├── index.html               # HTML entry point with OpenGraph & SEO tags
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # TypeScript node configuration
└── vite.config.ts           # Vite configuration
```

---

## 🗺️ Architectural Mapping

```mermaid
graph TD
    App[src/App.vue] --> AppHeader[src/components/Core/AppHeader.vue]
    App --> RouterView[router-view]
    App --> Settings[src/components/Core/SettingsDialog.vue]
    
    RouterView --> Home[src/views/HomeView.vue]
    RouterView --> ToolViews[Tool Views (src/views/)]
    
    subgraph ToolViews
        direction LR
        Byte[ByteConverter]
        Car[CarDetailGenerator]
        Expense[ExpenseOverview]
        Kanji[KanjiToRomanji]
        Percent[PercentageCalculator]
        QR[QrCodeGenerator]
        ThaiID[ThaiIDGenerator]
    end
    
    Plugins[src/plugins/] --> VuetifyPlugin[vuetify.ts]
    Plugins --> I18nPlugin[i18n.ts]
    
    VuetifyPlugin -.-> App
    I18nPlugin -.-> App
```

---

## 📑 Core Utilities & Tools Description

### 1. 🏠 Homepage Dashboard (`src/views/HomeView.vue`)
*   Serves as the navigation hub displaying links to all utility pages as custom-styled cards with icons, search filtering, and category chips.

### 2. 🧮 Percentage Calculator (`src/views/PercentageCalculator.vue`)
*   Features a multi-tab panel for calculations including:
    *   What percent is $X$ of $Y$?
    *   Adding $X\%$ to a number.
    *   Subtracting $X\%$ from a number.
    *   What is $X\%$ of $Y$?
    *   Percentage change from $X$ to $Y$ with color indicators.
    *   Quick presets and visual proportional bar comparison.

### 3. 💾 Byte Unit Converter (`src/views/ByteConverter.vue`)
*   Converts between data units with support for:
    *   Binary mode (IEC base $1024^n$: B, KiB, MiB, GiB, TiB, PiB).
    *   Decimal mode (SI base $1000^n$: B, kB, MB, GB, TB, PB).
    *   Network bit rates (bps, Kbps, Mbps, Gbps, Tbps).

### 4. 🚗 Car Detail Generator (`src/views/CarDetailGenerator.vue`)
*   Generates realistic Vehicle Identification Numbers (VIN) conforming to ISO 3779 standard with weighted modulo-11 check digit verification, engine numbers, and batch CSV export.

### 5. 🪪 Thai ID Card Generator & Validator (`src/views/ThaiIDGenerator.vue`)
*   Generates and validates checksum-compliant Thai Citizen Identification Numbers by province. Includes an ID anatomy breakdown guide and TXT/CSV bulk export.

### 6. 📊 Expense Proportional Overview (`src/views/ExpenseOverview.vue`)
*   Visual budget tracking tool where expense items are scaled proportionally by share of total expenditure. Features LocalStorage persistence, category tagging, and JSON/CSV import & export.

### 7. 💮 Japanese Kanji to Romaji Translator (`src/views/KanjiToRomanji.vue`)
*   Transliterates Japanese Kanji, Hiragana, and Katakana text into spaced Romaji, Hiragana, Katakana, and Furigana (HTML `<ruby>` and bracketed format).

### 8. 📱 QR Code Generator (`src/views/QrCodeGenerator.vue`)
*   Generates styled QR codes with presets (Text, URL, Wi-Fi, vCard, Email, SMS), resolution control, quiet zone margins, error correction, center logo overlays, and export to PNG, JPEG, and SVG.

---

## 🎨 Global Layout & Themes

*   **Vuetify Plugin ([src/plugins/vuetify.ts](file:///f:/Work/zepiawork.github.io/src/plugins/vuetify.ts))**: Registers 5 theme palettes:
    1.  `light` (Default Light)
    2.  `dark` (Default Dark)
    3.  `red` (Warm Red Theme)
    4.  `green` (Soft Green Theme)
    5.  `blue` (Professional Blue Theme)
*   **Localization ([src/locales/](file:///f:/Work/zepiawork.github.io/src/locales))**: Supports English (`en`), Thai (`th`), Japanese (`ja`), and German (`de`).

---

## ⚙️ Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the local Vite development server with HMR. |
| `npm run build` | Runs typecheck and builds production bundle in `dist/`. |
| `npm run preview` | Runs local server to preview production build. |
| `npm run lint` | Inspects code files with ESLint flat config. |
| `npm run lint:fix` | Automatically fixes simple syntax linting issues. |
| `npm run typecheck` | Runs `vue-tsc --noEmit` to verify TypeScript types. |
