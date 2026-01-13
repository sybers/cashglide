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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Cashflow Analysis</h1>
          <div class="flex items-center gap-2">
            <label for="currency" class="text-sm font-medium text-gray-700">Currency:</label>
            <select
              id="currency"
              :value="currency"
              @change="setCurrency(($event.target as HTMLSelectElement).value)"
              class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="curr in currencies" :key="curr" :value="curr">
                {{ curr }}
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

      <div class="mb-8">
        <SankeyChart />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    </main>
  </div>
</template>
