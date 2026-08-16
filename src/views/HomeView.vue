<template>
  <v-container class="pa-4 pa-md-6">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="9"
        xl="8"
      >
        <v-card class="elevation-3 rounded-xl overflow-hidden">
          <!-- Hero Header -->
          <div class="hero-banner pa-6 pa-md-8 text-center text-white">
            <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
              {{ $t('available_tools') }}
            </h1>
            <p class="text-subtitle-1 opacity-80 mb-6 mx-auto" style="max-width: 600px;">
              {{ $t('app_title') }} &bull; Fast, offline-capable developer & everyday utilities
            </p>

            <!-- Search Bar -->
            <v-text-field
              v-model="searchQuery"
              :placeholder="$t('search_tools')"
              prepend-inner-icon="mdi-magnify"
              variant="solo"
              density="comfortable"
              rounded="pill"
              clearable
              hide-details
              class="mx-auto search-bar"
              style="max-width: 500px;"
            />
          </div>

          <v-card-text class="pa-4 pa-md-6">
            <!-- Category Filter Chips -->
            <div class="d-flex flex-wrap justify-center ga-2 mb-6">
              <v-chip
                v-for="cat in categories"
                :key="cat.value"
                :color="selectedCategory === cat.value ? 'primary' : undefined"
                :variant="selectedCategory === cat.value ? 'flat' : 'outlined'"
                filter
                rounded="pill"
                class="px-3"
                @click="selectedCategory = cat.value"
              >
                <v-icon :icon="cat.icon" size="small" class="mr-1" />
                {{ $t(cat.titleKey) }}
              </v-chip>
            </div>

            <!-- Tool Cards Grid -->
            <v-row v-if="filteredTools.length > 0">
              <v-col
                v-for="(item, index) in filteredTools"
                :key="index"
                cols="12"
                sm="6"
              >
                <v-card
                  :to="item.path"
                  variant="outlined"
                  class="tool-card pa-4 h-100 d-flex flex-column rounded-lg"
                  elevation="0"
                >
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <div class="icon-avatar mr-3 d-flex align-center justify-center rounded-lg bg-primary text-white">
                        <v-icon :icon="item.icon" size="24" />
                      </div>
                      <h2 class="text-subtitle-1 font-weight-bold mb-0">
                        {{ $t(item.name) }}
                      </h2>
                    </div>
                    <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-medium">
                      {{ $t(item.category) }}
                    </v-chip>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-0 flex-grow-1">
                    {{ $t(item.descKey) }}
                  </p>
                </v-card>
              </v-col>
            </v-row>

            <!-- Empty Search State -->
            <div v-else class="text-center py-10 text-medium-emphasis">
              <v-icon icon="mdi-magnify-remove-outline" size="48" class="mb-2 opacity-60" />
              <p class="text-body-1">{{ $t('no_tools_found') }}</p>
              <v-btn variant="text" color="primary" size="small" @click="searchQuery = ''; selectedCategory = 'all'">
                Reset Filters
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { value: 'all', titleKey: 'all', icon: 'mdi-view-grid' },
  { value: 'generators', titleKey: 'generators', icon: 'mdi-creation' },
  { value: 'calculators', titleKey: 'calculators', icon: 'mdi-calculator' },
  { value: 'converters', titleKey: 'converters', icon: 'mdi-swap-horizontal' },
  { value: 'language_media', titleKey: 'language_media', icon: 'mdi-translate' },
]

const menuList = [
  {
    name: 'percentage_calculator',
    descKey: 'percentage_calculator_desc',
    path: '/percentagecalculator',
    icon: 'mdi-percent',
    category: 'calculators',
  },
  {
    name: 'byte_converter',
    descKey: 'byte_converter_desc',
    path: '/byteconverter',
    icon: 'mdi-harddisk',
    category: 'converters',
  },
  {
    name: 'car_detail_generator',
    descKey: 'car_detail_generator_desc',
    path: '/cardetailgenerator',
    icon: 'mdi-car',
    category: 'generators',
  },
  {
    name: 'thai_id_generator',
    descKey: 'thai_id_generator_desc',
    path: '/thaiidgenerator',
    icon: 'mdi-card-account-details',
    category: 'generators',
  },
  {
    name: 'expense_overview',
    descKey: 'expense_overview_desc',
    path: '/expenseoverview',
    icon: 'mdi-chart-box-outline',
    category: 'calculators',
  },
  {
    name: 'kanji_to_romanji',
    descKey: 'kanji_to_romanji_desc',
    path: '/kanjitoromanji',
    icon: 'mdi-translate',
    category: 'language_media',
  },
  {
    name: 'qr_code_generator',
    descKey: 'qr_code_generator_desc',
    path: '/qrcodegenerator',
    icon: 'mdi-qrcode',
    category: 'language_media',
  },
]

const filteredTools = computed(() => {
  return menuList.filter((item) => {
    // Category match
    const categoryMatch = selectedCategory.value === 'all' || item.category === selectedCategory.value

    // Search query match
    if (!searchQuery.value.trim()) {
      return categoryMatch
    }

    const query = searchQuery.value.toLowerCase().trim()
    const translatedName = t(item.name).toLowerCase()
    const translatedDesc = t(item.descKey).toLowerCase()

    const textMatch = translatedName.includes(query) || translatedDesc.includes(query) || item.name.toLowerCase().includes(query)

    return categoryMatch && textMatch
  })
})
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, rgba(98, 0, 238, 0.8) 100%);
}

.search-bar :deep(.v-field) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

.icon-avatar {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}

.tool-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
  border-color: rgb(var(--v-theme-primary));
}
</style>
