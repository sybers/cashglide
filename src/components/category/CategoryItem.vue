<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { CashflowItem } from '@/types'

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

const isEditingName = ref(false)
const isEditingAmount = ref(false)
const editName = ref(props.item.name)
const editAmount = ref(props.item.amount)

const nameInput = ref<HTMLInputElement | null>(null)
const amountInput = ref<HTMLInputElement | null>(null)

async function startEditName() {
  editName.value = props.item.name
  isEditingName.value = true
  await nextTick()
  nameInput.value?.focus()
  nameInput.value?.select()
}

async function startEditAmount() {
  editAmount.value = props.item.amount
  isEditingAmount.value = true
  await nextTick()
  amountInput.value?.focus()
  amountInput.value?.select()
}

function saveName() {
  if (editName.value.trim() && editName.value !== props.item.name) {
    emit('update', { name: editName.value.trim() })
  }
  isEditingName.value = false
}

function saveAmount() {
  if (editAmount.value !== props.item.amount) {
    emit('update', { amount: editAmount.value })
  }
  isEditingAmount.value = false
}

function cancelEditName() {
  editName.value = props.item.name
  isEditingName.value = false
}

function cancelEditAmount() {
  editAmount.value = props.item.amount
  isEditingAmount.value = false
}

function handleDelete() {
  if (confirm(`Delete "${props.item.name}"?`)) {
    emit('delete')
  }
}

function getCurrencySymbol(): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: props.currency,
    })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value || '$'
  } catch {
    return '$'
  }
}
</script>

<template>
  <div class="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-1.5 px-3 hover:bg-slate-50/50 rounded-xl transition-colors group">
    <!-- Name -->
    <input
      v-if="isEditingName"
      ref="nameInput"
      v-model="editName"
      type="text"
      class="px-2 py-1 -mx-2 bg-white border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:outline-none text-sm transition-all"
      @blur="saveName"
      @keyup.enter="saveName"
      @keyup.esc="cancelEditName"
    />
    <span
      v-else
      class="text-sm text-slate-600 cursor-text hover:text-slate-900 border-b border-dashed border-slate-300 hover:border-sky-400 transition-colors truncate min-w-0"
      @click="startEditName"
    >
      {{ item.name }}
    </span>

    <!-- Amount -->
    <div class="relative">
      <template v-if="isEditingAmount">
        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{{ getCurrencySymbol() }}</span>
        <input
          ref="amountInput"
          v-model.number="editAmount"
          type="number"
          step="0.01"
          min="0"
          class="w-full pl-6 pr-2 py-1 bg-white border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:outline-none text-sm text-right tabular-nums transition-all"
          @blur="saveAmount"
          @keyup.enter="saveAmount"
          @keyup.esc="cancelEditAmount"
        />
      </template>
      <span
        v-else
        class="block text-sm text-slate-700 font-medium tabular-nums text-right cursor-text hover:text-slate-900 border-b border-dashed border-slate-300 hover:border-sky-400 transition-colors"
        @click="startEditAmount"
      >
        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(item.amount) }}
      </span>
    </div>

    <!-- Delete button -->
    <button
      @click="handleDelete"
      class="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      title="Delete"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>
