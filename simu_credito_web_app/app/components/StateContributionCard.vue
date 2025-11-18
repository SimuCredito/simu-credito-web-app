<template>
  <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-indigo-900 mb-2">{{ title }}</h3>
        <div class="space-y-1 mb-4">
          <p class="text-sm text-indigo-700">{{ description }}</p>
          <div v-if="clientInfo" class="text-xs text-indigo-600 space-y-1">
            <p><strong>Cliente:</strong> {{ clientInfo.name }}</p>
            <p><strong>Aplica Integración:</strong> {{ clientInfo.appliesForIntegratorBonus ? 'Sí' : 'No' }}</p>
            <p v-if="clientInfo.conadisCardNumber"><strong>CONADIS:</strong> {{ clientInfo.conadisCardNumber }}</p>
          </div>
          <div v-if="propertyInfo" class="text-xs text-indigo-600 space-y-1">
            <p><strong>Inmueble Sostenible:</strong> {{ propertyInfo.isSustainable ? 'Sí' : 'No' }}</p>
            <p><strong>Rango:</strong> {{ propertyInfo.range }}</p>
          </div>
        </div>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-indigo-600">S/ {{ amount?.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true
  },
  clientInfo: {
    type: Object,
    default: null
  },
  propertyInfo: {
    type: Object,
    default: null
  }
})
</script>