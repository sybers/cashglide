<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCashflowStore } from "@/composables/useCashflow";
import { formatCurrency, formatPercentage } from "@/utils/formatting";

const { totalRevenue, totalInvestments, totalExpenses, investmentStats, currency } =
  storeToRefs(useCashflowStore());

const net = computed(() => totalRevenue.value - totalInvestments.value - totalExpenses.value);
</script>

<template>
  <div
    v-if="totalRevenue > 0"
    class="px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm text-slate-600 leading-relaxed"
  >
    You earn
    <strong>{{ formatCurrency(totalRevenue, currency) }}</strong>

    <template v-if="totalExpenses > 0 && totalInvestments > 0">
      , of which
      <strong>{{ formatCurrency(totalExpenses, currency) }}</strong>
      goes to expenses and
      <strong>{{ formatCurrency(totalInvestments, currency) }}</strong>
      to investments
    </template>
    <template v-else-if="totalExpenses > 0">
      , with
      <strong>{{ formatCurrency(totalExpenses, currency) }}</strong>
      in expenses
    </template>
    <template v-else-if="totalInvestments > 0">
      , with
      <strong>{{ formatCurrency(totalInvestments, currency) }}</strong>
      invested
    </template>

    <template v-if="net > 0">
      , leaving
      <strong>{{ formatCurrency(net, currency) }}</strong>
      unallocated.
    </template>
    <template v-else-if="net < 0">
      ,
      <strong>{{ formatCurrency(Math.abs(net), currency) }}</strong>
      over budget.
    </template>
    <template v-else>.</template>

    Current investment rate:
    <strong>{{ formatPercentage(investmentStats.currentPercentage) }}</strong
    >, possible: <strong>{{ formatPercentage(investmentStats.possiblePercentage) }}</strong
    >.
  </div>
</template>
