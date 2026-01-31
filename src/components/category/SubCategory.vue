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
  <div class="border border-slate-200/50 rounded-xl overflow-hidden bg-white/50">
    <!-- Subcategory Header -->
    <div 
      class="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2.5 px-3 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-2 min-w-0">
        <svg 
          class="w-4 h-4 text-slate-400 transition-transform shrink-0" 
          :class="{ 'rotate-90': isExpanded }" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>

        <template v-if="isEditingName">
          <input
            v-model="editName"
            type="text"
            class="flex-1 min-w-0 px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
            @click.stop
            @keyup.enter="saveNameEdit"
            @keyup.esc="cancelNameEdit"
          />
          <div class="flex gap-1" @click.stop>
            <button
              @click="saveNameEdit"
              class="p-1.5 text-white bg-emerald-400 hover:bg-emerald-500 rounded-lg transition-colors"
              title="Save"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              @click="cancelNameEdit"
              class="p-1.5 text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              title="Cancel"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>
        <template v-else>
          <h4 class="font-medium text-slate-700 truncate">{{ subCategory.name }}</h4>
        </template>
      </div>

      <span class="text-sm font-semibold text-slate-600 tabular-nums w-28 text-right">
        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(total) }}
      </span>

      <div class="flex gap-1" @click.stop>
        <button
          v-if="!isEditingName"
          @click="startEditName"
          class="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
          title="Rename"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete subcategory"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Subcategory Content -->
    <div v-show="isExpanded" class="border-t border-slate-200/50">
      <!-- Items List -->
      <div v-if="subCategory.items.length > 0" class="divide-y divide-slate-100/50">
        <CategoryItem
          v-for="item in subCategory.items"
          :key="item.id"
          :item="item"
          :currency="currency"
          @update="(updates) => emit('updateItem', item.id, updates)"
          @delete="emit('deleteItem', item.id)"
        />
      </div>
      <div v-else class="py-4 text-center text-sm text-slate-400">
        No items yet
      </div>

      <!-- Add Item Form -->
      <div class="grid grid-cols-[1fr_auto_auto] gap-2 items-center p-3 bg-slate-50/50 border-t border-slate-200/50">
        <input
          v-model="newItemName"
          type="text"
          placeholder="New item name"
          class="min-w-0 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
          @keyup.enter="addItem"
        />
        <input
          v-model.number="newItemAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-28 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent tabular-nums text-right transition-all"
          @keyup.enter="addItem"
        />
        <button
          @click="addItem"
          class="p-1.5 text-white bg-sky-400 hover:bg-sky-500 rounded-lg transition-colors"
          title="Add item"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
