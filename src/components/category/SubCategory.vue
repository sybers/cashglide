<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import type { SubCategory } from "@/types";
import CategoryItem from "./CategoryItem.vue";
import { calculateItemsTotal } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatting";
import { getCategoryStyles } from "@/utils/categoryStyles";
import { useCashflowStore } from "@/composables/useCashflow";
import { storeToRefs } from "pinia";

interface Props {
  subCategory: SubCategory;
  categoryId: string;
  categoryType: "revenue" | "investment" | "expense";
}

const props = defineProps<Props>();

const store = useCashflowStore();
const { button: buttonClass } = getCategoryStyles(props.categoryType);
const { currency } = storeToRefs(store);

const isExpanded = ref(true);
const isEditingName = ref(false);
const editName = ref(props.subCategory.name);
const newItemName = ref("");
const newItemAmount = ref(0);
const nameInput = ref<HTMLInputElement | null>(null);

const total = computed(() => calculateItemsTotal(props.subCategory.items));

function toggleExpand() {
  if (!isEditingName.value) {
    isExpanded.value = !isExpanded.value;
  }
}

async function startEditName() {
  editName.value = props.subCategory.name;
  isEditingName.value = true;
  await nextTick();
  nameInput.value?.focus();
  nameInput.value?.select();
}

function saveNameEdit() {
  const trimmed = editName.value.trim();
  if (trimmed && trimmed !== props.subCategory.name) {
    store.updateSubCategory(props.categoryId, props.subCategory.id, trimmed);
  }
  isEditingName.value = false;
}

function cancelNameEdit() {
  isEditingName.value = false;
  editName.value = props.subCategory.name;
}

function addItem() {
  if (newItemName.value.trim() && newItemAmount.value > 0) {
    store.addItem(
      props.categoryId,
      props.subCategory.id,
      newItemName.value.trim(),
      newItemAmount.value,
    );
    newItemName.value = "";
    newItemAmount.value = 0;
  }
}

function handleDelete() {
  if (confirm(`Delete subcategory "${props.subCategory.name}" and all its items?`)) {
    store.deleteSubCategory(props.categoryId, props.subCategory.id);
  }
}
</script>

<template>
  <div class="border border-slate-200/50 rounded-xl overflow-hidden bg-white/50 group/sub">
    <div
      class="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2 px-3 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors"
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

        <input
          v-if="isEditingName"
          ref="nameInput"
          v-model="editName"
          type="text"
          class="flex-1 min-w-0 px-2 py-0.5 -my-0.5 bg-white border border-sky-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-sky-300 focus:outline-none"
          @click.stop
          @blur="saveNameEdit"
          @keyup.enter="saveNameEdit"
          @keyup.esc="cancelNameEdit"
        />
        <h4
          v-else
          class="font-medium text-slate-700 truncate cursor-text hover:text-slate-900 border-b border-dashed border-slate-300 hover:border-sky-400 transition-colors"
          @click.stop="startEditName"
        >
          {{ subCategory.name }}
        </h4>
      </div>

      <span class="text-sm font-semibold text-slate-600 tabular-nums w-28 text-right">
        {{ formatCurrency(total, currency) }}
      </span>

      <button
        @click.stop="handleDelete"
        class="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover/sub:opacity-100"
        title="Delete subcategory"
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

    <div v-show="isExpanded" class="border-t border-slate-200/50">
      <div v-if="subCategory.items.length > 0" class="divide-y divide-slate-100/50">
        <CategoryItem
          v-for="item in subCategory.items"
          :key="item.id"
          :item="item"
          :category-id="categoryId"
          :sub-category-id="subCategory.id"
        />
      </div>
      <div v-else class="py-4 text-center text-sm text-slate-400">No items yet</div>

      <div
        class="grid grid-cols-[1fr_auto_auto] gap-2 items-center p-3 bg-slate-50/50 border-t border-slate-200/50"
      >
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
          class="w-20 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent tabular-nums text-right transition-all"
          @keyup.enter="addItem"
        />
        <button
          @click="addItem"
          class="p-1.5 rounded-lg transition-colors"
          :class="buttonClass"
          title="Add item"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  </div>
</template>
