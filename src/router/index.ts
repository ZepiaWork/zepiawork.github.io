import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Zepia Playground - Multi-utility Toolbox' }
  },
  {
    path: '/percentagecalculator',
    name: 'percentage-calculator',
    component: () => import('../views/PercentageCalculator.vue'),
    meta: { title: 'Percentage Calculator - Zepia Playground' }
  },
  {
    path: '/byteconverter',
    name: 'byte-converter',
    component: () => import('../views/ByteConverter.vue'),
    meta: { title: 'Byte Converter - Zepia Playground' }
  },
  {
    path: '/cardetailgenerator',
    name: 'car-detail-generator',
    component: () => import('../views/CarDetailGenerator.vue'),
    meta: { title: 'Car Detail Generator - Zepia Playground' }
  },
  {
    path: '/thaiidgenerator',
    name: 'thai-id-generator',
    component: () => import('../views/ThaiIDGenerator.vue'),
    meta: { title: 'Thai ID Generator & Validator - Zepia Playground' }
  },
  {
    path: '/expenseoverview',
    name: 'expense-overview',
    component: () => import('../views/ExpenseOverview.vue'),
    meta: { title: 'Expense Overview - Zepia Playground' }
  },
  {
    path: '/kanjitoromanji',
    name: 'kanji-to-romanji',
    component: () => import('../views/KanjiToRomanji.vue'),
    meta: { title: 'Kanji to Romaji Translator - Zepia Playground' }
  },
  {
    path: '/qrcodegenerator',
    name: 'qr-code-generator',
    component: () => import('../views/QrCodeGenerator.vue'),
    meta: { title: 'QR Code Generator - Zepia Playground' }
  }
]

const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/'

export const router = createRouter({
  history: createWebHistory(baseUrl),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})
