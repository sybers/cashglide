<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  currency?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'USD',
  placeholder: '0.00'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = computed({
  get: () => props.modelValue || '',
  set: (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    emit('update:modelValue', isNaN(numValue) ? 0 : numValue)
  }
})

const currencySymbol = computed(() => {
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
})
</script>

<template>
  <div class="relative">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {{ currencySymbol }}
    </span>
    <input
      v-model="displayValue"
      type="number"
      step="0.01"
      min="0"
      :placeholder="placeholder"
      class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-transparent text-sm transition-all"
    />
  </div>
</template>
