<script setup lang="ts">
export interface TabItem {
  key: string;
  label: string;
  activeClass: string;
  dotClass: string;
}

defineProps<{
  tabs: TabItem[];
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [key: string];
}>();
</script>

<template>
  <div>
    <div
      class="flex gap-1 mb-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 p-1"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="emit('update:modelValue', tab.key)"
        :class="[
          'flex-1 flex items-center justify-center gap-1.5 px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border',
          modelValue === tab.key
            ? tab.activeClass
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/60',
        ]"
      >
        <span
          :class="[
            'shrink-0 w-2 h-2 rounded-full',
            modelValue === tab.key ? tab.dotClass : 'bg-slate-300',
          ]"
        ></span>
        {{ tab.label }}
      </button>
    </div>

    <slot />
  </div>
</template>
