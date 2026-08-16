<template>
  <v-container class="pa-4 pa-md-6">
    <PageHeader />
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <v-card class="elevation-3 rounded-xl overflow-hidden">
          <v-card-title class="text-h5 text-md-h4 text-center py-6 font-weight-bold">
            {{ t('percentage_calculator_title') }}
          </v-card-title>

          <v-card-text class="pa-4 pa-md-6">
            <v-tabs
              v-model="activeTab"
              color="primary"
              class="mb-6"
              density="comfortable"
              show-arrows
            >
              <v-tab value="basic">{{ t('basic_percentage') }}</v-tab>
              <v-tab value="increase">{{ t('percentage_increase') }}</v-tab>
              <v-tab value="decrease">{{ t('percentage_decrease') }}</v-tab>
              <v-tab value="of">{{ t('percentage_of') }}</v-tab>
              <v-tab value="change">{{ t('percentage_change') }}</v-tab>
            </v-tabs>

            <v-tabs-window v-model="activeTab">
              <!-- Basic Percentage: X is what percent of Y? -->
              <v-tabs-window-item value="basic">
                <v-card variant="outlined" class="pa-4 rounded-lg">
                  <v-card-subtitle class="text-h6 font-weight-bold mb-4 px-0">
                    {{ t('what_percent_is_x_of_y') }}
                  </v-card-subtitle>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="basic.value"
                        :label="t('value_x')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="basic.total"
                        :label="t('total_y')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="basicResult"
                        :label="t('result_percent')"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        suffix="%"
                        append-inner-icon="mdi-content-copy"
                        @click:append-inner="copyToClipboard(basicResult + '%')"
                      />
                    </v-col>
                  </v-row>

                  <!-- Visual Proportion Bar -->
                  <div v-if="basic.total > 0" class="mt-4">
                    <div class="d-flex justify-space-between text-caption font-weight-bold mb-1">
                      <span>{{ t('visual_comparison') }}</span>
                      <span>{{ basicResult }}%</span>
                    </div>
                    <v-progress-linear
                      :model-value="Math.min(Math.max(parseFloat(basicResult), 0), 100)"
                      color="primary"
                      height="12"
                      rounded
                    />
                  </div>
                </v-card>
              </v-tabs-window-item>

              <!-- Percentage Increase -->
              <v-tabs-window-item value="increase">
                <v-card variant="outlined" class="pa-4 rounded-lg">
                  <v-card-subtitle class="text-h6 font-weight-bold mb-4 px-0">
                    {{ t('add_x_percent_to_number') }}
                  </v-card-subtitle>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="increase.value"
                        :label="t('original_value')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="increase.percentage"
                        :label="t('percentage_to_add')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                        suffix="%"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="increaseResult"
                        :label="t('result')"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        append-inner-icon="mdi-content-copy"
                        @click:append-inner="copyToClipboard(increaseResult)"
                      />
                    </v-col>
                  </v-row>

                  <!-- Presets -->
                  <div class="mt-2">
                    <span class="text-caption font-weight-bold mr-2 text-medium-emphasis">{{ t('presets') }}:</span>
                    <v-chip
                      v-for="p in [5, 7, 10, 15, 20, 25]"
                      :key="p"
                      size="small"
                      variant="outlined"
                      class="mr-1 mb-1"
                      @click="increase.percentage = p"
                    >
                      +{{ p }}%
                    </v-chip>
                  </div>
                </v-card>
              </v-tabs-window-item>

              <!-- Percentage Decrease -->
              <v-tabs-window-item value="decrease">
                <v-card variant="outlined" class="pa-4 rounded-lg">
                  <v-card-subtitle class="text-h6 font-weight-bold mb-4 px-0">
                    {{ t('subtract_x_percent_from_number') }}
                  </v-card-subtitle>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="decrease.value"
                        :label="t('original_value')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="decrease.percentage"
                        :label="t('percentage_to_subtract')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                        suffix="%"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="decreaseResult"
                        :label="t('result')"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        append-inner-icon="mdi-content-copy"
                        @click:append-inner="copyToClipboard(decreaseResult)"
                      />
                    </v-col>
                  </v-row>

                  <!-- Presets -->
                  <div class="mt-2">
                    <span class="text-caption font-weight-bold mr-2 text-medium-emphasis">{{ t('presets') }}:</span>
                    <v-chip
                      v-for="p in [5, 10, 15, 20, 30, 50]"
                      :key="p"
                      size="small"
                      variant="outlined"
                      class="mr-1 mb-1"
                      @click="decrease.percentage = p"
                    >
                      -{{ p }}%
                    </v-chip>
                  </div>
                </v-card>
              </v-tabs-window-item>

              <!-- Percentage Of -->
              <v-tabs-window-item value="of">
                <v-card variant="outlined" class="pa-4 rounded-lg">
                  <v-card-subtitle class="text-h6 font-weight-bold mb-4 px-0">
                    {{ t('what_is_x_percent_of_y') }}
                  </v-card-subtitle>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="of.percentage"
                        :label="t('percentage')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                        suffix="%"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="of.value"
                        :label="t('value')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="ofResult"
                        :label="t('result')"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        append-inner-icon="mdi-content-copy"
                        @click:append-inner="copyToClipboard(ofResult)"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-tabs-window-item>

              <!-- Percentage Change -->
              <v-tabs-window-item value="change">
                <v-card variant="outlined" class="pa-4 rounded-lg">
                  <v-card-subtitle class="text-h6 font-weight-bold mb-4 px-0">
                    {{ t('percentage_change_from_x_to_y') }}
                  </v-card-subtitle>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="change.oldValue"
                        :label="t('original_value')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="change.newValue"
                        :label="t('new_value')"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        step="any"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="changeResult"
                        :label="t('percentage_change')"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        suffix="%"
                        :color="getChangeColor(changeResult)"
                        append-inner-icon="mdi-content-copy"
                        @click:append-inner="copyToClipboard(changeResult + '%')"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import PageHeader from "@/components/Core/PageHeader.vue"

const { t } = useI18n()

const activeTab = ref("basic")
const snackbar = ref(false)
const snackbarText = ref('')

const copyToClipboard = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  snackbarText.value = t('copied_to_clipboard')
  snackbar.value = true
}

const basic = ref({ value: 25, total: 100 })
const basicResult = computed(() => {
  if (!basic.value.total || basic.value.total === 0) return "0.00"
  return ((basic.value.value / basic.value.total) * 100).toFixed(2)
})

const increase = ref({ value: 100, percentage: 10 })
const increaseResult = computed(() => {
  if (!increase.value.value) return "0.00"
  const result = increase.value.value * (1 + increase.value.percentage / 100)
  return result.toFixed(2)
})

const decrease = ref({ value: 100, percentage: 10 })
const decreaseResult = computed(() => {
  if (!decrease.value.value) return "0.00"
  const result = decrease.value.value * (1 - decrease.value.percentage / 100)
  return result.toFixed(2)
})

const of = ref({ percentage: 20, value: 150 })
const ofResult = computed(() => {
  if (!of.value.value) return "0.00"
  const result = (of.value.percentage / 100) * of.value.value
  return result.toFixed(2)
})

const change = ref({ oldValue: 80, newValue: 100 })
const changeResult = computed(() => {
  if (!change.value.oldValue || change.value.oldValue === 0) return "0.00"
  const result = ((change.value.newValue - change.value.oldValue) / change.value.oldValue) * 100
  return result.toFixed(2)
})

const getChangeColor = (result: string) => {
  const value = parseFloat(result)
  if (value > 0) return "success"
  if (value < 0) return "error"
  return "primary"
}
</script>

<style scoped></style>
