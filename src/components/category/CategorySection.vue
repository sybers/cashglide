<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Category, CashflowItem } from '@/types'
import SubCategory from './SubCategory.vue'
import { calculateSubCategoriesTotal } from '@/utils/calculations'
import { useCashflowStore } from '../../composables/useCashflow'
import { storeToRefs } from 'pinia'

interface Props {
  category: Category
}

interface Emits {
  addSubCategory: [name: string]
  updateSubCategory: [subCategoryId: string, name: string]
  deleteSubCategory: [subCategoryId: string]
  addItem: [subCategoryId: string, name: string, amount: number]
  updateItem: [subCategoryId: string, itemId: string, updates: Partial<CashflowItem>]
  deleteItem: [subCategoryId: string, itemId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cashflowStore = useCashflowStore();
const { currency } = storeToRefs(cashflowStore);

const newSubCategoryName = ref('')
const total = computed(() => calculateSubCategoriesTotal(props.category.subCategories))

const colorClasses = computed(() => {
  switch (props.category.type) {
    case 'revenue':
      return {
        header: 'bg-emerald-50/80 border-emerald-200/50',
        title: 'text-emerald-600',
        button: 'bg-emerald-400 hover:bg-emerald-500',
        total: 'text-emerald-500'
      }
    case 'investment':
      return {
        header: 'bg-sky-50/80 border-sky-200/50',
        title: 'text-sky-600',
        button: 'bg-sky-400 hover:bg-sky-500',
        total: 'text-sky-500'
      }
    case 'expense':
      return {
        header: 'bg-rose-50/80 border-rose-200/50',
        title: 'text-rose-500',
        button: 'bg-rose-400 hover:bg-rose-500',
        total: 'text-rose-500'
      }
  }
})

function addSubCategory() {
  if (newSubCategoryName.value.trim()) {
    emit('addSubCategory', newSubCategoryName.value.trim())
    newSubCategoryName.value = ''
  }
}
</script>

<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 h-full flex flex-col">
    <!-- Category Header -->
    <div class="mb-4 p-4 rounded-xl border" :class="colorClasses.header">
      <h2 class="text-lg font-semibold mb-2" :class="colorClasses.title">
        {{ category.name }}
      </h2>
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-500">Total:</span>
        <span class="text-xl font-bold" :class="colorClasses.total">
          {{ new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(total) }}
        </span>
      </div>
    </div>

    <!-- Subcategories List -->
    <div class="flex-1 overflow-y-auto mb-4 space-y-3">
      <SubCategory
        v-for="subCategory in category.subCategories"
        :key="subCategory.id"
        :category-type="category.type"
        :sub-category="subCategory"
        :category-id="category.id"
        :currency="currency"
        @update-name="(name) => emit('updateSubCategory', subCategory.id, name)"
        @delete="emit('deleteSubCategory', subCategory.id)"
        @add-item="(name, amount) => emit('addItem', subCategory.id, name, amount)"
        @update-item="(itemId, updates) => emit('updateItem', subCategory.id, itemId, updates)"
        @delete-item="(itemId) => emit('deleteItem', subCategory.id, itemId)"
      />

      <div v-if="category.subCategories.length === 0" class="text-center text-slate-400 py-8">
        No subcategories yet. Add one below!
      </div>
    </div>

    <!-- Add Subcategory Form -->
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
        class="p-2.5 text-white rounded-xl transition-colors"
        :class="colorClasses.button"
        title="Add subcategory"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>
