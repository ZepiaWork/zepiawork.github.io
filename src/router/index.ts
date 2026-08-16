import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '../plugins/i18n'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { titleKey: 'app_title' }
  },
  {
    path: '/percentagecalculator',
    name: 'percentage-calculator',
    component: () => import('../views/PercentageCalculator.vue'),
    meta: { titleKey: 'percentage_calculator' }
  },
  {
    path: '/byteconverter',
    name: 'byte-converter',
    component: () => import('../views/ByteConverter.vue'),
    meta: { titleKey: 'byte_converter' }
  },
  {
    path: '/cardetailgenerator',
    name: 'car-detail-generator',
    component: () => import('../views/CarDetailGenerator.vue'),
    meta: { titleKey: 'car_detail_generator' }
  },
  {
    path: '/thaiidgenerator',
    name: 'thai-id-generator',
    component: () => import('../views/ThaiIDGenerator.vue'),
    meta: { titleKey: 'thai_id_generator' }
  },
  {
    path: '/expenseoverview',
    name: 'expense-overview',
    component: () => import('../views/ExpenseOverview.vue'),
    meta: { titleKey: 'expense_overview' }
  },
  {
    path: '/kanjitoromanji',
    name: 'kanji-to-romanji',
    component: () => import('../views/KanjiToRomanji.vue'),
    meta: { titleKey: 'kanji_to_romanji' }
  },
  {
    path: '/qrcodegenerator',
    name: 'qr-code-generator',
    component: () => import('../views/QrCodeGenerator.vue'),
    meta: { titleKey: 'qr_code_generator' }
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

export function updatePageTitle() {
  const currentRoute = router.currentRoute.value
  const titleKey = currentRoute.meta?.titleKey as string | undefined
  const appName = i18n.global.t('app_title')

  if (titleKey && titleKey !== 'app_title') {
    const pageTitle = i18n.global.t(titleKey)
    document.title = `${pageTitle} - ${appName}`
  } else {
    document.title = `${appName} - Multi-utility Toolbox`
  }
}

router.afterEach(() => {
  updatePageTitle()
})
