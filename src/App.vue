<script setup lang="ts">
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import HowItWorks from "./components/common/HowItWorks.vue";
import CategoryTabs from "./components/category/CategoryTabs.vue";
import InvestmentStats from "./components/stats/InvestmentStats.vue";
import SankeyChart from "./components/charts/SankeyChart.vue";
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div class="flex flex-col lg:flex-row gap-6 mb-8">
        <div class="w-full lg:flex-[2] min-w-0">
          <CategoryTabs />
        </div>
        <HowItWorks />
      </div>

      <div class="mb-8">
        <InvestmentStats />
      </div>

      <div>
        <SankeyChart />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
