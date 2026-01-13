<script setup lang="ts">
import { computed } from 'vue'
import { useCashflowStore } from '../../composables/useCashflow';
import * as formatting from '../../utils/formatting';
import { storeToRefs } from 'pinia';

const cashflowStore = useCashflowStore();

const {
  investmentStats,
  totalRevenue,
  totalInvestments,
  totalExpenses,
  currency,
} = storeToRefs(cashflowStore);

const canInvestMore = computed(() => investmentStats.value.possiblePercentage > investmentStats.value.currentPercentage)

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

function formatCurrency(amount: number): string {
  return formatting.formatCurrency(amount, currency.value)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">Investment Overview</h2>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-sm text-green-700 mb-1">Total Revenue</p>
        <p class="text-2xl font-bold text-green-600">
          {{ formatCurrency(totalRevenue) }}
        </p>
      </div>
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-700 mb-1">Total Investments</p>
        <p class="text-2xl font-bold text-blue-600">
          {{ formatCurrency(totalInvestments) }}
        </p>
      </div>
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700 mb-1">Total Expenses</p>
        <p class="text-2xl font-bold text-red-600">
          {{ formatCurrency(totalExpenses) }}
        </p>
      </div>
      <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p class="text-sm text-purple-700 mb-1">Net Cashflow</p>
        <p class="text-2xl font-bold text-purple-600">
          {{ formatCurrency(totalRevenue - totalInvestments - totalExpenses) }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Current Investment</span>
          <span class="text-sm font-semibold text-blue-600">
            {{ formatPercentage(investmentStats.currentPercentage) }} of revenue
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-blue-600 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(investmentStats.currentPercentage, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ formatCurrency(investmentStats.currentAmount) }} invested out of {{ formatCurrency(totalRevenue) }} revenue
        </p>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Possible Investment</span>
          <span class="text-sm font-semibold text-purple-600">
            {{ formatPercentage(investmentStats.possiblePercentage) }} of revenue
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-purple-600 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(investmentStats.possiblePercentage, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ formatCurrency(Math.max(0, investmentStats.possibleAmount)) }} available after expenses
        </p>
      </div>
    </div>

    <div v-if="canInvestMore" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-800">
        <span class="font-semibold">Tip:</span> You could invest an additional
        {{ formatCurrency(investmentStats.possibleAmount - investmentStats.currentAmount) }}
        ({{ formatPercentage(investmentStats.possiblePercentage - investmentStats.currentPercentage) }})
        based on your current revenue and expenses.
      </p>
    </div>
  </div>
</template>
