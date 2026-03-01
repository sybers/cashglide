<script setup lang="ts">
import { computed } from "vue";
import { useCashflowStore } from "@/composables/useCashflow";
import { formatCurrency, formatPercentage } from "@/utils/formatting";
import { storeToRefs } from "pinia";

const cashflowStore = useCashflowStore();
const { investmentStats, totalRevenue, totalInvestments, totalExpenses, currency } =
  storeToRefs(cashflowStore);

const canInvestMore = computed(
  () => investmentStats.value.possiblePercentage > investmentStats.value.currentPercentage,
);
</script>

<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
    <h2 class="text-lg font-semibold text-slate-700 mb-4">Investment Overview</h2>

    <div class="flex flex-col lg:flex-row gap-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:flex-[1]">
        <div class="p-4 rounded-xl bg-teal-50/80 border border-teal-200/50">
          <p class="text-sm mb-1 text-teal-600">Total Revenue</p>
          <p class="text-xl font-bold text-teal-500">
            {{ formatCurrency(totalRevenue, currency) }}
          </p>
        </div>
        <div class="p-4 rounded-xl bg-violet-50/80 border border-violet-200/50">
          <p class="text-sm mb-1 text-violet-600">Total Investments</p>
          <p class="text-xl font-bold text-violet-500">
            {{ formatCurrency(totalInvestments, currency) }}
          </p>
        </div>
        <div class="p-4 rounded-xl bg-orange-50/80 border border-orange-200/50">
          <p class="text-sm mb-1 text-orange-600">Total Expenses</p>
          <p class="text-xl font-bold text-orange-500">
            {{ formatCurrency(totalExpenses, currency) }}
          </p>
        </div>
        <div class="p-4 rounded-xl bg-yellow-50/80 border border-yellow-200/50">
          <p class="text-sm mb-1 text-yellow-600">Net Cashflow</p>
          <p class="text-xl font-bold text-yellow-500">
            {{ formatCurrency(totalRevenue - totalInvestments - totalExpenses, currency) }}
          </p>
        </div>
      </div>

      <div class="flex flex-col justify-center gap-4 lg:flex-[1]">
        <div class="space-y-3">
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm font-medium text-slate-600">Current Investment</span>
              <span class="text-sm font-semibold text-teal-500">
                {{ formatPercentage(investmentStats.currentPercentage) }} of revenue
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5">
              <div
                class="bg-gradient-to-r from-teal-400 to-teal-500 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(investmentStats.currentPercentage, 100)}%` }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm font-medium text-slate-600">Possible Investment</span>
              <span class="text-sm font-semibold text-violet-500">
                {{ formatPercentage(investmentStats.possiblePercentage) }} of revenue
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5">
              <div
                class="bg-gradient-to-r from-violet-400 to-violet-500 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(investmentStats.possiblePercentage, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div v-if="canInvestMore" class="p-4 rounded-xl border bg-teal-50/80 border-teal-200/50">
          <p class="text-sm text-teal-700">
            <span class="font-semibold">Tip:</span> You could invest an additional
            {{
              formatCurrency(
                investmentStats.possibleAmount - investmentStats.currentAmount,
                currency,
              )
            }}
            ({{
              formatPercentage(
                investmentStats.possiblePercentage - investmentStats.currentPercentage,
              )
            }}) based on your current revenue and expenses.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
