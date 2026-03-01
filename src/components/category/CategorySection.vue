<script setup lang="ts">
import { ref, computed } from "vue";
import type { Category } from "@/types";
import SubCategory from "./SubCategory.vue";
import { calculateSubCategoriesTotal } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatting";
import { getCategoryStyles } from "@/utils/categoryStyles";
import { useCashflowStore } from "@/composables/useCashflow";
import { storeToRefs } from "pinia";

const props = defineProps<{
  category: Category;
}>();

const store = useCashflowStore();
const { currency } = storeToRefs(store);

const newSubCategoryName = ref("");
const total = computed(() => calculateSubCategoriesTotal(props.category.subCategories));
const colorClasses = getCategoryStyles(props.category.type);

function addSubCategory() {
  if (newSubCategoryName.value.trim()) {
    store.addSubCategory(props.category.id, newSubCategoryName.value.trim());
    newSubCategoryName.value = "";
  }
}
</script>

<template>
  <div
    class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 flex flex-col"
  >
    <div class="mb-4 p-4 rounded-xl border" :class="colorClasses.header">
      <h2 class="text-lg font-semibold mb-2" :class="colorClasses.title">
        {{ category.name }}
      </h2>
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-500">Total:</span>
        <span class="text-xl font-bold" :class="colorClasses.total">
          {{ formatCurrency(total, currency) }}
        </span>
      </div>
    </div>

    <div class="mb-4 space-y-3">
      <SubCategory
        v-for="subCategory in category.subCategories"
        :key="subCategory.id"
        :category-type="category.type"
        :sub-category="subCategory"
        :category-id="category.id"
      />

      <div v-if="category.subCategories.length === 0" class="text-center text-slate-400 py-8">
        No subcategories yet. Add one below!
      </div>
    </div>

    <div class="flex gap-2 pt-3 border-t border-slate-200/50">
      <input
        v-model="newSubCategoryName"
        type="text"
        :placeholder="`Add ${category.name.toLowerCase()} subcategory`"
        class="flex-1 px-4 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
        @keyup.enter="addSubCategory"
      />
      <button
        @click="addSubCategory"
        class="p-2.5 rounded-xl transition-colors"
        :class="colorClasses.button"
        title="Add subcategory"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
