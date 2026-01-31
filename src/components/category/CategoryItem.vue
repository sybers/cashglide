<script setup lang="ts">
import { ref } from 'vue'
import type { CashflowItem } from '@/types'
import CurrencyInput from '../common/CurrencyInput.vue'

interface Props {
  item: CashflowItem
  currency: string
}

interface Emits {
  update: [updates: Partial<CashflowItem>]
  delete: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const editName = ref(props.item.name)
const editAmount = ref(props.item.amount)

function startEdit() {
  isEditing.value = true
  editName.value = props.item.name
  editAmount.value = props.item.amount
}

function saveEdit() {
  emit('update', { name: editName.value, amount: editAmount.value })
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  editName.value = props.item.name
  editAmount.value = props.item.amount
}

function handleDelete() {
  if (confirm(`Delete "${props.item.name}"?`)) {
    emit('delete')
  }
}
</script>

<template>
  <div class="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2 px-3 hover:bg-slate-50/50 rounded-xl transition-colors">
    <template v-if="isEditing">
      <input
        v-model="editName"
        type="text"
        placeholder="Item name"
        class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm transition-all"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
      />
      <div class="w-28">
        <CurrencyInput
          v-model="editAmount"
          :currency="currency"
        />
      </div>
      <div class="flex gap-1">
        <button
          @click="saveEdit"
          class="p-1.5 text-white bg-emerald-400 hover:bg-emerald-500 rounded-lg transition-colors"
          title="Save"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          @click="cancelEdit"
          class="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Cancel"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </template>
    <template v-else>
      <span class="text-sm text-slate-600">{{ item.name }}</span>
      <span class="text-sm text-slate-700 font-medium tabular-nums w-28 text-right">
        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(item.amount) }}
      </span>
      <div class="flex gap-1">
        <button
          @click="startEdit"
          class="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>
