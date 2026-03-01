<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCashflowStore } from "@/composables/useCashflow";
import AppTabs from "@/components/common/AppTabs.vue";
import type { TabItem } from "@/components/common/AppTabs.vue";
import CategorySection from "./CategorySection.vue";

const { revenues, investments, expenses } = storeToRefs(useCashflowStore());

type TabKey = "revenues" | "investments" | "expenses";
const activeTab = ref<TabKey>("revenues");

const tabs: TabItem[] = [
  {
    key: "revenues",
    label: "Revenues",
    activeClass: "border-teal-500 text-teal-600 bg-teal-50/60",
    dotClass: "bg-teal-500",
  },
  {
    key: "investments",
    label: "Investments",
    activeClass: "border-violet-500 text-violet-600 bg-violet-50/60",
    dotClass: "bg-violet-500",
  },
  {
    key: "expenses",
    label: "Expenses",
    activeClass: "border-orange-500 text-orange-600 bg-orange-50/60",
    dotClass: "bg-orange-500",
  },
];
</script>

<template>
  <AppTabs v-model="activeTab" :tabs="tabs">
    <template v-if="activeTab === 'revenues'">
      <CategorySection v-for="category in revenues" :key="category.id" :category="category" />
    </template>
    <template v-else-if="activeTab === 'investments'">
      <CategorySection v-for="category in investments" :key="category.id" :category="category" />
    </template>
    <template v-else-if="activeTab === 'expenses'">
      <CategorySection v-for="category in expenses" :key="category.id" :category="category" />
    </template>
  </AppTabs>
</template>
