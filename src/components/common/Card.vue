<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-4">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>
