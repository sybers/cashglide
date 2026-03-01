<script setup lang="ts">
import type { CashflowItem } from "@/types";
import { getCurrencySymbol, formatCurrency } from "@/utils/formatting";
import { useInlineEdit } from "@/composables/useInlineEdit";
import { useCashflowStore } from "@/composables/useCashflow";
import { storeToRefs } from "pinia";

interface Props {
  item: CashflowItem;
  categoryId: string;
  subCategoryId: string;
}

const props = defineProps<Props>();

const store = useCashflowStore();
const { currency } = storeToRefs(store);

const {
  isEditing: isEditingName,
  editValue: editName,
  inputRef: nameInput,
  startEdit: startEditName,
  save: saveName,
  cancel: cancelEditName,
} = useInlineEdit(
  () => props.item.name,
  (value) => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== props.item.name) {
      store.updateItem(props.categoryId, props.subCategoryId, props.item.id, { name: trimmed });
    }
  },
);

const {
  isEditing: isEditingAmount,
  editValue: editAmount,
  inputRef: amountInput,
  startEdit: startEditAmount,
  save: saveAmount,
  cancel: cancelEditAmount,
} = useInlineEdit(
  () => props.item.amount,
  (value) => {
    if (value !== props.item.amount) {
      store.updateItem(props.categoryId, props.subCategoryId, props.item.id, { amount: value });
    }
  },
);

function handleDelete() {
  if (confirm(`Delete "${props.item.name}"?`)) {
    store.deleteItem(props.categoryId, props.subCategoryId, props.item.id);
  }
}
</script>

<template>
  <div
    class="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-1.5 px-3 hover:bg-slate-50/50 rounded-xl transition-colors group"
  >
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

    <div class="relative">
      <template v-if="isEditingAmount">
        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{{
          getCurrencySymbol(currency)
        }}</span>
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
        {{ formatCurrency(item.amount, currency) }}
      </span>
    </div>

    <button
      @click="handleDelete"
      class="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      title="Delete"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
</template>
