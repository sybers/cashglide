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
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
    <h2 class="text-lg font-semibold text-slate-700 mb-6">Investment Overview</h2>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="p-4 bg-emerald-50/80 border border-emerald-200/50 rounded-xl">
        <p class="text-sm text-emerald-600 mb-1">Total Revenue</p>
        <p class="text-2xl font-bold text-emerald-500">
          {{ formatCurrency(totalRevenue) }}
        </p>
      </div>
      <div class="p-4 bg-sky-50/80 border border-sky-200/50 rounded-xl">
        <p class="text-sm text-sky-600 mb-1">Total Investments</p>
        <p class="text-2xl font-bold text-sky-500">
          {{ formatCurrency(totalInvestments) }}
        </p>
      </div>
      <div class="p-4 bg-rose-50/80 border border-rose-200/50 rounded-xl">
        <p class="text-sm text-rose-500 mb-1">Total Expenses</p>
        <p class="text-2xl font-bold text-rose-400">
          {{ formatCurrency(totalExpenses) }}
        </p>
      </div>
      <div class="p-4 bg-violet-50/80 border border-violet-200/50 rounded-xl">
        <p class="text-sm text-violet-600 mb-1">Net Cashflow</p>
        <p class="text-2xl font-bold text-violet-500">
          {{ formatCurrency(totalRevenue - totalInvestments - totalExpenses) }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-slate-600">Current Investment</span>
          <span class="text-sm font-semibold text-sky-500">
            {{ formatPercentage(investmentStats.currentPercentage) }} of revenue
          </span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-sky-400 to-sky-500 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(investmentStats.currentPercentage, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          {{ formatCurrency(investmentStats.currentAmount) }} invested out of {{ formatCurrency(totalRevenue) }} revenue
        </p>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-slate-600">Possible Investment</span>
          <span class="text-sm font-semibold text-violet-500">
            {{ formatPercentage(investmentStats.possiblePercentage) }} of revenue
          </span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-violet-400 to-violet-500 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(investmentStats.possiblePercentage, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          {{ formatCurrency(Math.max(0, investmentStats.possibleAmount)) }} available after expenses
        </p>
      </div>
    </div>

    <div v-if="canInvestMore" class="mt-4 p-4 bg-sky-50/80 border border-sky-200/50 rounded-xl">
      <p class="text-sm text-sky-700">
        <span class="font-semibold">Tip:</span> You could invest an additional
        {{ formatCurrency(investmentStats.possibleAmount - investmentStats.currentAmount) }}
        ({{ formatPercentage(investmentStats.possiblePercentage - investmentStats.currentPercentage) }})
        based on your current revenue and expenses.
      </p>
    </div>
  </div>
</template>
