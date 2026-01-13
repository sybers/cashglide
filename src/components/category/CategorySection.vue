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
        header: 'bg-green-50 border-green-200',
        title: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700',
        total: 'text-green-600'
      }
    case 'investment':
      return {
        header: 'bg-blue-50 border-blue-200',
        title: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700',
        total: 'text-blue-600'
      }
    case 'expense':
      return {
        header: 'bg-red-50 border-red-200',
        title: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700',
        total: 'text-red-600'
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
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
    <!-- Category Header -->
    <div class="mb-4 pb-3 border-b" :class="colorClasses.header">
      <h2 class="text-lg font-semibold mb-2" :class="colorClasses.title">
        {{ category.name }}
      </h2>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Total:</span>
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
        :sub-category="subCategory"
        :category-id="category.id"
        :currency="currency"
        @update-name="(name) => emit('updateSubCategory', subCategory.id, name)"
        @delete="emit('deleteSubCategory', subCategory.id)"
        @add-item="(name, amount) => emit('addItem', subCategory.id, name, amount)"
        @update-item="(itemId, updates) => emit('updateItem', subCategory.id, itemId, updates)"
        @delete-item="(itemId) => emit('deleteItem', subCategory.id, itemId)"
      />

      <div v-if="category.subCategories.length === 0" class="text-center text-gray-400 py-8">
        No subcategories yet. Add one below!
      </div>
    </div>

    <!-- Add Subcategory Form -->
    <div class="flex gap-2 pt-3 border-t border-gray-200">
      <input
        v-model="newSubCategoryName"
        type="text"
        :placeholder="`Add ${category.name.toLowerCase()} subcategory`"
        class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @keyup.enter="addSubCategory"
      />
      <button
        @click="addSubCategory"
        class="px-4 py-2 text-sm text-white rounded"
        :class="colorClasses.button"
      >
        Add
      </button>
    </div>
  </div>
</template>
