<template>
    <v-container class="fill-height pb-0" fluid>
        <v-row justify="center" class="fill-height">
            <v-col cols="12" md="10" lg="8" class="d-flex flex-column h-100">
                <v-card class="elevation-3 d-flex flex-column flex-grow-1 overflow-hidden">
                    <v-card-title class="text-h5 text-center py-4 flex-shrink-0">
                        {{ $t('expense_overview') }}
                    </v-card-title>
                    <v-card-text class="d-flex flex-column flex-grow-1 overflow-hidden">
                        <!-- View Toggle -->
                        <div class="d-flex justify-center mb-6 flex-shrink-0">
                            <v-btn-toggle v-model="viewType" mandatory color="primary" rounded="xl" variant="outlined">
                                <v-btn value="monthly">{{ $t('monthly') }}</v-btn>
                                <v-btn value="yearly">{{ $t('yearly') }}</v-btn>
                            </v-btn-toggle>
                        </div>

                        <!-- Add Expense Form -->
                        <v-form class="mb-6 flex-shrink-0" @submit.prevent="addExpense">
                            <v-row align="center">
                                <v-col cols="12" sm="4">
                                    <v-text-field
                                        v-model="newExpense.name"
                                        :label="$t('expense_name')"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                    />
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model.number="newExpense.amount"
                                        :label="$t('amount')"
                                        type="number"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                    />
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-select
                                        v-model="newExpense.type"
                                        :items="expenseTypes"
                                        :label="$t('type')"
                                        item-title="text"
                                        item-value="value"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                    />
                                </v-col>
                                <v-col cols="12" sm="2">
                                    <v-btn type="submit" color="primary" block height="48">
                                        {{ $t('add') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>

                        <!-- Visualization Area -->
                        <v-sheet
                            class="d-flex flex-wrap align-content-start pa-4 rounded-lg bg-grey-lighten-4 flex-grow-1 overflow-y-auto"
                            border
                        >
                            <template v-if="displayExpenses.length > 0">
                                <v-hover
                                    v-for="(expense, index) in displayExpenses"
                                    :key="index"
                                    v-slot="{ props }"
                                >
                                    <v-card
                                        v-bind="props"
                                        :color="getExpenseColor(index)"
                                        class="ma-1 d-flex flex-column justify-center align-center text-center text-white position-relative"
                                        :style="getExpenseStyle(expense.convertedAmount)"
                                        elevation="2"
                                    >
                                        <!-- Delete Button -->
                                        <v-btn
                                            :title="$t('delete')"
                                            icon="mdi-delete"
                                            size="x-small"
                                            variant="text"
                                            color="white"
                                            class="position-absolute top-0 right-0 ma-1"
                                            style="z-index: 1;"
                                            @click.stop="deleteExpense(expense.originalIndex)"
                                        />

                                        <div class="text-caption font-weight-bold text-truncate w-100 px-1">
                                            {{ expense.name }}
                                        </div>
                                        <div class="text-body-2">
                                            {{ formatAmount(expense.convertedAmount) }}
                                        </div>
                                        <div v-if="expense.type !== viewType" class="text-caption opacity-70">
                                            ({{ $t(expense.type) }})
                                        </div>
                                    </v-card>
                                </v-hover>
                            </template>
                            <div v-else class="d-flex w-100 h-100 justify-center align-center text-grey">
                                {{ $t('no_expenses_added') }}
                            </div>
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from '#imports'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type ExpenseType = 'monthly' | 'yearly'

interface Expense {
    name: string
    amount: number
    type: ExpenseType
}

const expenses = ref<Expense[]>([])
const viewType = ref<ExpenseType>('monthly')

const newExpense = ref<Expense>({
    name: '',
    amount: 0,
    type: 'monthly',
})

const expenseTypes = computed(() => [
    { text: t('monthly'), value: 'monthly' },
    { text: t('yearly'), value: 'yearly' },
])

// Transform expenses for display based on current viewType
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
            convertedAmount,
            originalIndex: index
        }
    }).sort((a, b) => b.convertedAmount - a.convertedAmount)
})

const totalAmount = computed(() => {
    return displayExpenses.value.reduce((sum, e) => sum + e.convertedAmount, 0)
})

const addExpense = () => {
    if (!newExpense.value.name || newExpense.value.amount <= 0) return

    expenses.value.push({ ...newExpense.value })
    
    // Reset form but keep the type user just selected
    newExpense.value.name = ''
    newExpense.value.amount = 0
}

const deleteExpense = (originalIndex: number) => {
    expenses.value.splice(originalIndex, 1)
}

const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const getExpenseStyle = (amount: number) => {
    if (totalAmount.value === 0) return { width: '100px', height: '100px' }
    
    // We calculate the size based on the item's share of the total.
    // We target a reference area (e.g., 400x400) for the 100% case.
    const referenceDimension = 400
    const referenceArea = referenceDimension * referenceDimension
    
    const share = amount / totalAmount.value
    const itemArea = share * referenceArea
    
    // Size is the square root of the area
    let size = Math.sqrt(itemArea)
    
    // Clamp values for better UI
    size = Math.max(size, 85)  // Ensure minimum size for text readability
    size = Math.min(size, 450) // Prevent a single huge item from taking over the whole view
    
    return {
        width: `${size}px`,
        height: `${size}px`,
    }
}

const colors = [
    'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 
    'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 
    'yellow-darken-2', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey'
]

const getExpenseColor = (index: number) => {
    return colors[index % colors.length]
}
</script>

<style scoped>
.v-card {
    transition: all 0.3s ease;
}
/* Ensure the delete button is clickable */
.v-btn--icon {
    opacity: 0.7;
}
.v-btn--icon:hover {
    opacity: 1;
}
</style>
