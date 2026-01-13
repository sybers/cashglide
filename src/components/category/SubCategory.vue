<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SubCategory, CashflowItem } from '@/types'
import CategoryItem from './CategoryItem.vue'
import { calculateItemsTotal } from '@/utils/calculations'

interface Props {
  subCategory: SubCategory
  categoryId: string
  currency: string
}

interface Emits {
  updateName: [name: string]
  delete: []
  addItem: [name: string, amount: number]
  updateItem: [itemId: string, updates: Partial<CashflowItem>]
  deleteItem: [itemId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isExpanded = ref(true)
const isEditingName = ref(false)
const editName = ref(props.subCategory.name)
const newItemName = ref('')
const newItemAmount = ref(0)

const total = computed(() => calculateItemsTotal(props.subCategory.items))

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function startEditName() {
  isEditingName.value = true
  editName.value = props.subCategory.name
}

function saveNameEdit() {
  if (editName.value.trim()) {
    emit('updateName', editName.value.trim())
  }
  isEditingName.value = false
}

function cancelNameEdit() {
  isEditingName.value = false
  editName.value = props.subCategory.name
}

function addItem() {
  if (newItemName.value.trim() && newItemAmount.value > 0) {
    emit('addItem', newItemName.value.trim(), newItemAmount.value)
    newItemName.value = ''
    newItemAmount.value = 0
  }
}

function handleDelete() {
  if (confirm(`Delete subcategory "${props.subCategory.name}" and all its items?`)) {
    emit('delete')
  }
}
</script>

<template>
  <div class="border border-gray-200 rounded-lg mb-3">
    <!-- Subcategory Header -->
    <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center gap-2 flex-1">
        <button
          @click="toggleExpand"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-90': isExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <template v-if="isEditingName">
          <input
            v-model="editName"
            type="text"
            class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            @keyup.enter="saveNameEdit"
            @keyup.esc="cancelNameEdit"
          />
          <button
            @click="saveNameEdit"
            class="px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded"
          >
            Save
          </button>
          <button
            @click="cancelNameEdit"
            class="px-2 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
        </template>
        <template v-else>
          <h4 class="font-medium text-gray-900">{{ subCategory.name }}</h4>
          <button
            @click="startEditName"
            class="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100"
          >
            Rename
          </button>
        </template>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-gray-700">
          {{ new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(total) }}
        </span>
        <button
          @click="handleDelete"
          class="px-2 py-1 text-xs text-red-600 hover:text-red-800"
          title="Delete subcategory"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Subcategory Content -->
    <div v-show="isExpanded" class="p-3">
      <!-- Items List -->
      <div v-if="subCategory.items.length > 0" class="mb-3 space-y-1">
        <CategoryItem
          v-for="item in subCategory.items"
          :key="item.id"
          :item="item"
          :currency="currency"
          @update="(updates) => emit('updateItem', item.id, updates)"
          @delete="emit('deleteItem', item.id)"
        />
      </div>

      <!-- Add Item Form -->
      <div class="flex gap-2 items-center pt-2 border-t border-gray-200">
        <input
          v-model="newItemName"
          type="text"
          placeholder="Item name"
          class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="addItem"
        />
        <input
          v-model.number="newItemAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount"
          class="w-32 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="addItem"
        />
        <button
          @click="addItem"
          class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add Item
        </button>
      </div>
    </div>
  </div>
</template>
