<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col cols="12" lg="11" xl="10">
        <v-card class="elevation-3 rounded-xl overflow-hidden">
          <v-card-title class="text-h5 text-md-h4 text-center py-6 font-weight-bold">
            {{ t('expense_overview') }}
          </v-card-title>

          <v-card-text class="pa-4 pa-md-6">
            <!-- Controls Bar: View Toggle, Currency, Filter, Actions -->
            <div class="d-flex justify-space-between align-center mb-6 flex-wrap ga-3">
              <div class="d-flex align-center flex-wrap ga-2">
                <v-btn-toggle v-model="viewType" mandatory color="primary" rounded="pill" variant="outlined" density="comfortable">
                  <v-btn value="monthly">{{ t('monthly') }}</v-btn>
                  <v-btn value="yearly">{{ t('yearly') }}</v-btn>
                </v-btn-toggle>

                <v-select
                  v-model="currency"
                  :items="currencies"
                  :label="t('currency')"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="width: 100px;"
                />
              </div>

              <!-- Export & Clear Actions -->
              <div class="d-flex align-center flex-wrap ga-2">
                <v-menu location="bottom end">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="outlined" prepend-icon="mdi-download" density="comfortable" rounded="pill">
                      Export
                    </v-btn>
                  </template>
                  <v-list density="compact" class="rounded-lg elevation-4">
                    <v-list-item prepend-icon="mdi-code-json" @click="exportJson">
                      <v-list-item-title>{{ t('export_json') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item prepend-icon="mdi-file-delimited-outline" @click="exportCsv">
                      <v-list-item-title>{{ t('export_csv') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-upload"
                  density="comfortable"
                  rounded="pill"
                  @click="triggerFileInput"
                >
                  {{ t('import_json') }}
                </v-btn>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".json"
                  class="d-none"
                  @change="handleFileImport"
                >

                <v-btn
                  v-if="expenses.length > 0"
                  color="error"
                  variant="text"
                  icon="mdi-delete-sweep-outline"
                  density="comfortable"
                  :title="t('clear_all')"
                  @click="confirmClearDialog = true"
                />
              </div>
            </div>

            <!-- Add Expense Form -->
            <v-card variant="outlined" class="pa-4 mb-6 rounded-lg bg-surface">
              <v-form @submit.prevent="addExpense">
                <v-row align="center">
                  <v-col cols="12" sm="4" md="3">
                    <v-text-field
                      v-model="newExpense.name"
                      :label="t('expense_name')"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="3">
                    <v-text-field
                      v-model.number="newExpense.amount"
                      :label="t('amount')"
                      type="number"
                      min="0.01"
                      step="any"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="2">
                    <v-select
                      v-model="newExpense.category"
                      :items="categories"
                      :label="t('category')"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-select
                      v-model="newExpense.type"
                      :items="expenseTypes"
                      :label="t('type')"
                      item-title="text"
                      item-value="value"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-btn
                      type="submit"
                      color="primary"
                      block
                      height="44"
                      prepend-icon="mdi-plus"
                      rounded="lg"
                    >
                      {{ t('add') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>

            <!-- Total Banner & Category Breakdown Chips -->
            <div v-if="displayExpenses.length > 0" class="mb-4">
              <div class="d-flex justify-space-between align-center pa-4 bg-primary text-white rounded-lg mb-3">
                <span class="text-subtitle-1 font-weight-bold">{{ t('total_expenses') }} ({{ t(viewType) }})</span>
                <span class="text-h5 font-weight-bold">{{ currency }} {{ formatAmount(totalAmount) }}</span>
              </div>

              <!-- Category Filter Chips -->
              <div class="d-flex flex-wrap ga-1 align-center">
                <v-chip
                  size="small"
                  :variant="selectedCategory === 'all' ? 'flat' : 'outlined'"
                  :color="selectedCategory === 'all' ? 'primary' : undefined"
                  class="cursor-pointer"
                  @click="selectedCategory = 'all'"
                >
                  {{ t('category_all') }} ({{ displayExpenses.length }})
                </v-chip>
                <v-chip
                  v-for="cat in availableCategories"
                  :key="cat.value"
                  size="small"
                  :variant="selectedCategory === cat.value ? 'flat' : 'outlined'"
                  :color="cat.color"
                  class="cursor-pointer"
                  @click="selectedCategory = selectedCategory === cat.value ? 'all' : cat.value"
                >
                  {{ t(cat.titleKey) }}: {{ currency }} {{ formatAmount(cat.total) }}
                </v-chip>
              </div>
            </div>

            <!-- Visualization Area -->
            <v-sheet
              class="d-flex flex-wrap align-content-start pa-4 rounded-xl visualization-sheet border overflow-y-auto"
              style="min-height: 380px; max-height: 520px;"
            >
              <template v-if="filteredDisplayExpenses.length > 0">
                <template v-for="(expense, index) in filteredDisplayExpenses" :key="index">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :color="getExpenseColor(expense.category, index)"
                      class="ma-1 d-flex flex-column justify-center align-center text-center text-white position-relative rounded-lg expense-tile"
                      :style="getExpenseStyle(expense.convertedAmount)"
                      :elevation="isHovering ? 8 : 2"
                    >
                      <!-- Delete Button -->
                      <v-btn
                        icon="mdi-close-circle"
                        size="x-small"
                        variant="text"
                        color="white"
                        class="position-absolute top-0 right-0 ma-1 tile-delete-btn"
                        :title="t('delete')"
                        @click.stop="deleteExpense(expense.originalIndex)"
                      />

                      <div class="text-caption font-weight-bold text-truncate w-100 px-2">
                        {{ expense.name }}
                      </div>
                      <div class="text-body-2 font-weight-bold">
                        {{ currency }} {{ formatAmount(expense.convertedAmount) }}
                      </div>
                      <div class="text-caption opacity-80 font-weight-medium">
                        {{ t(getCategoryTitleKey(expense.category)) }}
                      </div>
                      <div v-if="expense.type !== viewType" class="text-caption opacity-70">
                        ({{ t(expense.type) }})
                      </div>
                    </v-card>
                  </v-hover>
                </template>
              </template>

              <div v-else class="d-flex flex-column w-100 h-100 justify-center align-center py-12 text-medium-emphasis">
                <v-icon icon="mdi-chart-box-outline" size="48" class="mb-2 opacity-50" />
                <p class="text-body-1">{{ t('no_expenses_added') }}</p>
              </div>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Clear Confirmation Dialog -->
    <v-dialog v-model="confirmClearDialog" max-width="380">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="text-h6 font-weight-bold">{{ t('clear_all') }}</v-card-title>
        <v-card-text>{{ t('clear_confirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmClearDialog = false">{{ t('cancel') }}</v-btn>
          <v-btn color="error" variant="tonal" rounded="pill" @click="clearAllExpenses">{{ t('confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2500" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from "@/components/Core/PageHeader.vue"

const { t } = useI18n()

type ExpenseType = 'monthly' | 'yearly'
type ExpenseCategory = 'housing' | 'food' | 'transport' | 'utilities' | 'entertainment' | 'shopping' | 'health' | 'other'

interface Expense {
  name: string
  amount: number
  type: ExpenseType
  category: ExpenseCategory
}

const STORAGE_KEY = 'zepia_expenses'
const CURRENCY_KEY = 'zepia_currency'

const expenses = ref<Expense[]>([])
const viewType = ref<ExpenseType>('monthly')
const currency = ref<string>('$')
const currencies = ['$', '฿', '€', '¥', '£']
const selectedCategory = ref<string>('all')

const confirmClearDialog = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const fileInputRef = ref<HTMLInputElement | null>(null)

const categories: { title: string; value: ExpenseCategory; titleKey: string; color: string }[] = [
  { title: 'Housing', value: 'housing', titleKey: 'cat_housing', color: 'indigo' },
  { title: 'Food & Dining', value: 'food', titleKey: 'cat_food', color: 'orange-darken-1' },
  { title: 'Transport', value: 'transport', titleKey: 'cat_transport', color: 'blue-darken-1' },
  { title: 'Utilities', value: 'utilities', titleKey: 'cat_utilities', color: 'teal' },
  { title: 'Entertainment', value: 'entertainment', titleKey: 'cat_entertainment', color: 'purple' },
  { title: 'Shopping', value: 'shopping', titleKey: 'cat_shopping', color: 'pink' },
  { title: 'Health', value: 'health', titleKey: 'cat_health', color: 'green' },
  { title: 'Other', value: 'other', titleKey: 'cat_other', color: 'blue-grey' },
]

const newExpense = ref<Expense>({
  name: '',
  amount: 0,
  type: 'monthly',
  category: 'food',
})

const expenseTypes = computed(() => [
  { text: t('monthly'), value: 'monthly' },
  { text: t('yearly'), value: 'yearly' },
])

const displayExpenses = computed(() => {
  return expenses.value.map((e, index) => {
    let convertedAmount = e.amount
    if (viewType.value === 'monthly' && e.type === 'yearly') {
      convertedAmount = e.amount / 12
    } else if (viewType.value === 'yearly' && e.type === 'monthly') {
      convertedAmount = e.amount * 12
    }

    return {
      ...e,
      category: e.category || 'other',
      convertedAmount,
      originalIndex: index
    }
  }).sort((a, b) => b.convertedAmount - a.convertedAmount)
})

const filteredDisplayExpenses = computed(() => {
  if (selectedCategory.value === 'all') return displayExpenses.value
  return displayExpenses.value.filter(e => e.category === selectedCategory.value)
})

const totalAmount = computed(() => {
  return displayExpenses.value.reduce((sum, e) => sum + e.convertedAmount, 0)
})

const availableCategories = computed(() => {
  const map: Record<string, number> = {}
  displayExpenses.value.forEach(e => {
    map[e.category] = (map[e.category] || 0) + e.convertedAmount
  })

  return categories
    .filter(c => map[c.value] !== undefined && map[c.value] > 0)
    .map(c => ({
      ...c,
      total: map[c.value]
    }))
})

function getCategoryTitleKey(catValue: ExpenseCategory): string {
  const cat = categories.find(c => c.value === catValue)
  return cat ? cat.titleKey : 'cat_other'
}

function getExpenseColor(catValue: ExpenseCategory, index: number): string {
  const cat = categories.find(c => c.value === catValue)
  if (cat) return cat.color
  const fallbackColors = ['red', 'indigo', 'teal', 'orange', 'purple', 'blue']
  return fallbackColors[index % fallbackColors.length]
}

const addExpense = () => {
  if (!newExpense.value.name.trim() || newExpense.value.amount <= 0) return

  expenses.value.push({
    name: newExpense.value.name.trim(),
    amount: newExpense.value.amount,
    type: newExpense.value.type,
    category: newExpense.value.category,
  })

  saveExpenses()
  newExpense.value.name = ''
  newExpense.value.amount = 0
}

const deleteExpense = (originalIndex: number) => {
  expenses.value.splice(originalIndex, 1)
  saveExpenses()
}

const clearAllExpenses = () => {
  expenses.value = []
  saveExpenses()
  confirmClearDialog.value = false
}

const saveExpenses = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses.value))
}

const formatAmount = (amount: number) => {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const getExpenseStyle = (amount: number) => {
  if (totalAmount.value === 0) return { width: '100px', height: '100px' }
  const referenceDimension = 400
  const referenceArea = referenceDimension * referenceDimension
  const share = amount / totalAmount.value
  const itemArea = share * referenceArea
  let size = Math.sqrt(itemArea)
  size = Math.max(size, 90)
  size = Math.min(size, 450)

  return {
    width: `${size}px`,
    height: `${size}px`,
  }
}

// Export / Import
const exportJson = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses.value, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `expenses_${Date.now()}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

const exportCsv = () => {
  const headers = ['Name', 'Amount', 'Type', 'Category']
  const rows = expenses.value.map(e => [
    `"${e.name.replace(/"/g, '""')}"`,
    e.amount,
    e.type,
    e.category
  ])
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", encodeURI(csvContent))
  downloadAnchor.setAttribute("download", `expenses_${Date.now()}.csv`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        expenses.value = parsed.map(item => ({
          name: String(item.name || 'Expense'),
          amount: Number(item.amount) || 0,
          type: item.type === 'yearly' ? 'yearly' : 'monthly',
          category: item.category || 'other'
        }))
        saveExpenses()
        showToast(t('imported_success'), 'success')
      }
    } catch {
      showToast(t('import_error'), 'error')
    }
  }
  reader.readAsText(file)
  target.value = ''
}

const showToast = (msg: string, color = 'success') => {
  snackbarText.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

watch(currency, (newVal) => {
  localStorage.setItem(CURRENCY_KEY, newVal)
})

onMounted(() => {
  const savedExpenses = localStorage.getItem(STORAGE_KEY)
  if (savedExpenses) {
    try {
      expenses.value = JSON.parse(savedExpenses)
    } catch (e) {
      console.error('Failed to parse saved expenses', e)
    }
  }
  const savedCurrency = localStorage.getItem(CURRENCY_KEY)
  if (savedCurrency && currencies.includes(savedCurrency)) {
    currency.value = savedCurrency
  }
})
</script>

<style scoped>
.visualization-sheet {
  background-color: rgba(var(--v-theme-on-surface), 0.03);
  border-color: rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.expense-tile {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tile-delete-btn {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.tile-delete-btn:hover {
  opacity: 1;
}
</style>
