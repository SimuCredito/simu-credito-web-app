<template>
  <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
    <div class="text-center">
      <p class="text-sm text-indigo-700 mb-2">Monto a Financiar por el Banco</p>
      <p class="text-2xl font-bold text-indigo-600 mb-2">S/ {{ amount?.toLocaleString() }}</p>
      <p class="text-xs text-gray-600">{{ formula }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  amount: {
    type: Number,
    required: true
  },
  formula: {
    type: String,
    default: ''
  }
})
</script>