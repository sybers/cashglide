<script setup lang="ts">
import { useCashflowStore } from './composables/useCashflow'
import CategorySection from './components/category/CategorySection.vue'
import InvestmentStats from './components/stats/InvestmentStats.vue'
import SankeyChart from './components/charts/SankeyChart.vue'
import { storeToRefs } from 'pinia';

const cashflowStore = useCashflowStore();

const {
  currency,
  revenues,
  investments,
  expenses,
} = storeToRefs(cashflowStore);

const {
  setCurrency,
  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
  addItem,
  updateItem,
  deleteItem
} = cashflowStore

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY']

function getCurrencySymbol(currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value || currencyCode
  } catch {
    return currencyCode
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
    <header class="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            CashGlide
          </h1>
          <div class="flex items-center gap-3">
            <label for="currency" class="text-sm font-medium text-slate-600">Currency:</label>
            <select
              id="currency"
              :value="currency"
              @change="setCurrency(($event.target as HTMLSelectElement).value)"
              class="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-transparent text-slate-700 transition-all"
            >
              <option v-for="curr in currencies" :key="curr" :value="curr">
                {{ getCurrencySymbol(curr) }} {{ curr }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <InvestmentStats />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CategorySection
          v-for="category in revenues"
          :key="category.id"
          :category="category"
          @add-sub-category="(name) => addSubCategory(category.id, name)"
          @update-sub-category="(subId, name) => updateSubCategory(category.id, subId, name)"
          @delete-sub-category="(subId) => deleteSubCategory(category.id, subId)"
          @add-item="(subId, name, amount) => addItem(category.id, subId, name, amount)"
          @update-item="(subId, itemId, updates) => updateItem(category.id, subId, itemId, updates)"
          @delete-item="(subId, itemId) => deleteItem(category.id, subId, itemId)"
        />
        <CategorySection
          v-for="category in investments"
          :key="category.id"
          :category="category"
          @add-sub-category="(name) => addSubCategory(category.id, name)"
          @update-sub-category="(subId, name) => updateSubCategory(category.id, subId, name)"
          @delete-sub-category="(subId) => deleteSubCategory(category.id, subId)"
          @add-item="(subId, name, amount) => addItem(category.id, subId, name, amount)"
          @update-item="(subId, itemId, updates) => updateItem(category.id, subId, itemId, updates)"
          @delete-item="(subId, itemId) => deleteItem(category.id, subId, itemId)"
        />
        <CategorySection
          v-for="category in expenses"
          :key="category.id"
          :category="category"
          @add-sub-category="(name) => addSubCategory(category.id, name)"
          @update-sub-category="(subId, name) => updateSubCategory(category.id, subId, name)"
          @delete-sub-category="(subId) => deleteSubCategory(category.id, subId)"
          @add-item="(subId, name, amount) => addItem(category.id, subId, name, amount)"
          @update-item="(subId, itemId, updates) => updateItem(category.id, subId, itemId, updates)"
          @delete-item="(subId, itemId) => deleteItem(category.id, subId, itemId)"
        />
      </div>

      <div>
        <SankeyChart />
      </div>
    </main>
  </div>
</template>
