<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCashflowStore } from "./composables/useCashflow";
import { getCurrencySymbol } from "./utils/formatting";
import CategorySection from "./components/category/CategorySection.vue";
import InvestmentStats from "./components/stats/InvestmentStats.vue";
import SankeyChart from "./components/charts/SankeyChart.vue";

const cashflowStore = useCashflowStore();

const { currency, revenues, investments, expenses } = storeToRefs(cashflowStore);
const {
  setCurrency,
  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
  addItem,
  updateItem,
  deleteItem,
} = cashflowStore;

const allCategories = computed(() => [...revenues.value, ...investments.value, ...expenses.value]);

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex flex-col">
    <header class="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex justify-between items-center">
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent"
          >
            CashGlide
          </h1>
          <div class="flex items-center gap-4">
            <select
              id="currency"
              aria-label="Select currency"
              :value="currency"
              @change="setCurrency(($event.target as HTMLSelectElement).value)"
              class="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-transparent text-slate-700 transition-all"
            >
              <option v-for="curr in currencies" :key="curr" :value="curr">
                {{ getCurrencySymbol(curr) }} {{ curr }}
              </option>
            </select>
            <div class="flex items-center gap-2">
              <a
                href="https://github.com/sybers"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
              <a
                href="https://ko-fi.com/sybers"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Support on Ko-fi"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Introduction Section -->
      <div class="mb-8 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50">
        <h2 class="text-lg font-semibold text-slate-700 mb-3">How it works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div class="flex gap-3">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"
            >
              1
            </div>
            <div>
              <p class="font-medium text-slate-700">Add your income</p>
              <p class="mt-1 text-slate-500">
                Enter your revenue sources like salary, freelancing, or side projects.
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold"
            >
              2
            </div>
            <div>
              <p class="font-medium text-slate-700">Track investments & expenses</p>
              <p class="mt-1 text-slate-500">
                Categorize your spending and investments to see where your money goes.
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold"
            >
              3
            </div>
            <div>
              <p class="font-medium text-slate-700">Visualize your cashflow</p>
              <p class="mt-1 text-slate-500">
                See your financial flow in an interactive diagram and discover optimization
                opportunities.
              </p>
            </div>
          </div>
        </div>
        <p class="mt-4 text-xs text-slate-400">
          Tip: Click on any value to edit it directly. Your data is saved locally in your browser.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CategorySection
          v-for="category in allCategories"
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

      <div class="mb-8">
        <InvestmentStats />
      </div>

      <div>
        <SankeyChart />
      </div>
    </main>

    <footer class="bg-white/80 backdrop-blur-sm border-t border-slate-200/50 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-sm text-slate-500">
          Made with ❤️ by
          <a
            href="https://github.com/sybers"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-slate-700 hover:text-sky-500 transition-colors"
            >sybers</a
          >
        </p>
      </div>
    </footer>
  </div>
</template>
