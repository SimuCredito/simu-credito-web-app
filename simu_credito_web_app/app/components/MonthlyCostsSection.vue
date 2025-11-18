<template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h3 class="text-lg font-semibold text-gray-900">Costos Fijos Mensuales</h3>
      <button class="ml-2 text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Comisiones constantes -->
      <div class="flex items-center space-x-3">
        <div class="text-gray-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-900">Comisiones constantes</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">S/</span>
            <input
              v-model="constantCommissions"
              type="number"
              step="0.01"
              class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Gastos de administración -->
      <div class="flex items-center space-x-3">
        <div class="text-gray-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-900">Gastos de administración</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">S/</span>
            <input
              v-model="administrationCosts"
              type="number"
              step="0.01"
              class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const constantCommissions = ref(0)
const administrationCosts = ref(0)

const emit = defineEmits(['update:constantCommissions', 'update:administrationCosts'])

// Observar cambios locales y emitirlos al padre
watch(constantCommissions, (newValue) => {
  emit('update:constantCommissions', newValue)
})
watch(administrationCosts, (newValue) => {
  emit('update:administrationCosts', newValue)
})

// Emitir valores iniciales
emit('update:constantCommissions', constantCommissions.value)
emit('update:administrationCosts', administrationCosts.value)

</script>