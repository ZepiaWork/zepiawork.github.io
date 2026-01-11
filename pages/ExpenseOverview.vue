<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="10" lg="8">
                <v-card class="elevation-3">
                    <v-card-title class="text-h5 text-center py-4">
                        {{ $t('expense_overview') }}
                    </v-card-title>
                    <v-card-text>
                        <!-- View Toggle -->
                        <div class="d-flex justify-center mb-6">
                            <v-btn-toggle v-model="viewType" mandatory color="primary" rounded="xl" variant="outlined">
                                <v-btn value="monthly">{{ $t('monthly') }}</v-btn>
                                <v-btn value="yearly">{{ $t('yearly') }}</v-btn>
                            </v-btn-toggle>
                        </div>

                        <!-- Add Expense Form -->
                        <v-form @submit.prevent="addExpense" class="mb-6">
                            <v-row align="center">
                                <v-col cols="12" sm="4">
                                    <v-text-field
                                        v-model="newExpense.name"
                                        :label="$t('expense_name')"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <v-text-field
                                        v-model.number="newExpense.amount"
                                        :label="$t('amount')"
                                        type="number"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                    ></v-text-field>
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
                                    ></v-select>
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
                            class="d-flex flex-wrap align-content-start pa-4 rounded-lg bg-grey-lighten-4"
                            min-height="400"
                            border
                        >
                            <template v-if="displayExpenses.length > 0">
                                <v-hover v-slot="{ isHovering, props }">
                                    <v-card
                                        v-for="(expense, index) in displayExpenses"
                                        :key="index"
                                        v-bind="props"
                                        :color="getExpenseColor(index)"
                                        class="ma-1 d-flex flex-column justify-center align-center text-center text-white position-relative"
                                        :style="getExpenseStyle(expense.convertedAmount)"
                                        elevation="2"
                                    >
                                        <!-- Delete Button -->
                                        <v-btn
                                            icon="mdi-delete"
                                            size="x-small"
                                            variant="text"
                                            color="white"
                                            class="position-absolute top-0 right-0 ma-1"
                                            style="z-index: 1;"
                                            @click.stop="deleteExpense(index)"
                                            :title="$t('delete')"
                                        ></v-btn>

                                        <div class="text-caption font-weight-bold text-truncate w-100 px-1">
                                            {{ expense.name }}
                                        </div>
                                        <div class="text-body-2">
                                            {{ formatAmount(expense.convertedAmount) }}
                                        </div>
                                        <div class="text-caption opacity-70" v-if="expense.type !== viewType">
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
    return expenses.value.map((e) => {
        let convertedAmount = e.amount
        
        if (viewType.value === 'monthly' && e.type === 'yearly') {
            convertedAmount = e.amount / 12
        } else if (viewType.value === 'yearly' && e.type === 'monthly') {
            convertedAmount = e.amount * 12
        }

        return {
            ...e,
            convertedAmount
        }
    })
})

const addExpense = () => {
    if (!newExpense.value.name || newExpense.value.amount <= 0) return

    expenses.value.push({ ...newExpense.value })
    
    // Reset form but keep the type user just selected
    newExpense.value.name = ''
    newExpense.value.amount = 0
}

const deleteExpense = (index: number) => {
    expenses.value.splice(index, 1)
}

const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const getExpenseStyle = (amount: number) => {
    const baseSize = 50
    // Adjust scale factor: if amount is monthly, it's smaller, so maybe scale differently?
    // Actually, since we convert amounts, relative sizes should be fine.
    // Monthly view: 1000/mo vs 500/yr (41/mo) -> 1000 should be huge, 41 tiny.
    const scaleFactor = 4 
    const dimension = Math.sqrt(amount) * scaleFactor
    
    const size = Math.max(dimension, 70) // Min size to fit text and delete button
    
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
