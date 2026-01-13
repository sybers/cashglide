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
  <div class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded group">
    <template v-if="isEditing">
      <input
        v-model="editName"
        type="text"
        placeholder="Item name"
        class="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
      />
      <div class="w-32">
        <CurrencyInput
          v-model="editAmount"
          :currency="currency"
        />
      </div>
      <button
        @click="saveEdit"
        class="px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded"
      >
        Save
      </button>
      <button
        @click="cancelEdit"
        class="px-2 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
      >
        Cancel
      </button>
    </template>
    <template v-else>
      <span class="flex-1 text-sm text-gray-700">{{ item.name }}</span>
      <span class="w-32 text-sm text-gray-900 font-medium text-right">
        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(item.amount) }}
      </span>
      <div class="opacity-0 group-hover:opacity-100 flex gap-1">
        <button
          @click="startEdit"
          class="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          Edit
        </button>
        <button
          @click="handleDelete"
          class="px-2 py-1 text-xs text-red-600 hover:text-red-800"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </template>
  </div>
</template>
