import { computed } from "vue";
import type {
  CashflowData,
  Category,
  SubCategory,
  CashflowItem,
  InvestmentStats,
  SankeyData,
} from "@/types";
import {
  calculateCategoryTotal,
  calculateInvestmentStats,
  generateSankeyData,
} from "@/utils/calculations";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

const DEFAULT_CURRENCY = "EUR";
const STORAGE_KEY = "cashflow-data";

function getDefaultCashflowData(): CashflowData {
  return {
    categories: [
      {
        id: crypto.randomUUID(),
        name: "Revenues",
        type: "revenue",
        subCategories: [],
      },
      {
        id: crypto.randomUUID(),
        name: "Investments",
        type: "investment",
        subCategories: [],
      },
      {
        id: crypto.randomUUID(),
        name: "Expenses",
        type: "expense",
        subCategories: [],
      },
    ],
    currency: DEFAULT_CURRENCY,
  };
}

export const useCashflowStore = defineStore("cashflow", () => {
  const cashflowData = useLocalStorage<CashflowData>(STORAGE_KEY, getDefaultCashflowData());

  // Computed
  const revenues = computed(() =>
    cashflowData.value.categories.filter((c) => c.type === "revenue"),
  );

  const investments = computed(() =>
    cashflowData.value.categories.filter((c) => c.type === "investment"),
  );

  const expenses = computed(() =>
    cashflowData.value.categories.filter((c) => c.type === "expense"),
  );

  const totalRevenue = computed(() => calculateCategoryTotal(revenues.value));
  const totalInvestments = computed(() => calculateCategoryTotal(investments.value));
  const totalExpenses = computed(() => calculateCategoryTotal(expenses.value));

  const investmentStats = computed<InvestmentStats>(() =>
    calculateInvestmentStats(totalRevenue.value, totalInvestments.value, totalExpenses.value),
  );

  const sankeyData = computed<SankeyData>(() => generateSankeyData(cashflowData.value));

  // Actions
  function addCategory(type: Category["type"], name: string) {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      type,
      subCategories: [],
    };
    cashflowData.value.categories.push(newCategory);
  }

  function addSubCategory(categoryId: string, name: string) {
    const category = cashflowData.value.categories.find((c) => c.id === categoryId);
    if (!category) {
      return;
    }
    const newSubCategory: SubCategory = {
      id: crypto.randomUUID(),
      name,
      items: [],
    };
    category.subCategories.push(newSubCategory);
  }

  function addItem(categoryId: string, subCategoryId: string, name: string, amount: number) {
    const category = cashflowData.value.categories.find((c) => c.id === categoryId);
    if (!category) {
      return;
    }

    const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId);
    if (!subCategory) {
      return;
    }

    const newItem: CashflowItem = {
      id: crypto.randomUUID(),
      name,
      amount,
    };
    subCategory.items.push(newItem);
  }

  function updateItem(
    categoryId: string,
    subCategoryId: string,
    itemId: string,
    updates: Partial<CashflowItem>,
  ) {
    const category = cashflowData.value.categories.find((c) => c.id === categoryId);
    if (!category) {
      return;
    }

    const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId);
    if (!subCategory) {
      return;
    }

    const item = subCategory.items.find((i) => i.id === itemId);
    if (!item) {
      return;
    }

    Object.assign(item, updates);
  }

  function deleteItem(categoryId: string, subCategoryId: string, itemId: string) {
    const category = cashflowData.value.categories.find((c) => c.id === categoryId);
    if (!category) {
      return;
    }

    const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId);
    if (!subCategory) {
      return;
    }

    const index = subCategory.items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      subCategory.items.splice(index, 1);
    }
  }

  function updateSubCategory(categoryId: string, subCategoryId: string, name: string) {
    const category = cashflowData.value.categories.find((c) => c.id === categoryId);
    if (!category) {
      return;
    }

    const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId);
    if (!subCategory) {
      return;
    }

    subCategory.name = name;
  }

  function deleteSubCategory(categoryId: string, subCategoryId: string) {
    const category = cashflowData.value.categories.find((c) => c.id === categoryId);
    if (!category) {
      return;
    }

    const index = category.subCategories.findIndex((sc) => sc.id === subCategoryId);
    if (index === -1) {
      return;
    }

    category.subCategories.splice(index, 1);
  }

  function setCurrency(currency: string) {
    cashflowData.value.currency = currency;
  }

  return {
    // State
    cashflowData,
    currency: computed(() => cashflowData.value.currency),

    // Computed
    revenues,
    investments,
    expenses,
    totalRevenue,
    totalInvestments,
    totalExpenses,
    investmentStats,
    sankeyData,

    // Actions
    addCategory,
    addSubCategory,
    addItem,
    updateItem,
    deleteItem,
    updateSubCategory,
    deleteSubCategory,
    setCurrency,
  };
});
