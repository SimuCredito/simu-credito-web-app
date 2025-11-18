<template>
  <div class="space-y-4">
    <!-- Seguro de desgravamen -->
    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="desgravamen"
            v-model="desgravamenEnabled"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="desgravamen" class="ml-3 text-sm font-medium text-gray-900">
            Seguro de desgravamen (?)
          </label>
        </div>
        <div v-if="desgravamenEnabled" class="flex items-center space-x-2">
          <input
            v-model="desgravamenRate"
            type="number"
            step="0.0001"
            class="w-20 rounded-lg border border-gray-200 bg-gray-50 py-1 px-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span class="text-sm text-gray-500">%</span>
        </div>
      </div>
    </div>

    <!-- Seguro contra todo riesgo -->
    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="riesgo"
            v-model="riesgoEnabled"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="riesgo" class="ml-3 text-sm font-medium text-gray-900">
            Seguro contra todo riesgo (?)
          </label>
        </div>
        <div v-if="riesgoEnabled" class="flex items-center space-x-2">
          <input
            v-model="riesgoRate"
            type="number"
            step="0.0001"
            class="w-20 rounded-lg border border-gray-200 bg-gray-50 py-1 px-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span class="text-sm text-gray-500">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedEntity: {
    type: Object,
    default: null
  }
})

const desgravamenEnabled = ref(true)
const desgravamenRate = ref(0.03) // Default as decimal (0.03%)
const riesgoEnabled = ref(true)
const riesgoRate = ref(0.025) // Default as decimal (0.025%)

const emit = defineEmits(['update:insurance'])

// Pre-load insurance rates from selected entity
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity) {
    // Pre-load life insurance rate (desgravamen) - convert from percentage to decimal
    if (newEntity.lifeInsurancePercentage) {
      desgravamenRate.value = newEntity.lifeInsurancePercentage / 100
    }

    // Pre-load property insurance rate - convert from percentage to decimal
    if (newEntity.propertyInsurancePercentage) {
      riesgoRate.value = newEntity.propertyInsurancePercentage / 100
    }

    emit('update:insurance', {
      desgravamen: { enabled: desgravamenEnabled.value, rate: desgravamenRate.value / 100 }, // Convert percentage to decimal
      propertyInsurance: { enabled: riesgoEnabled.value, rate: riesgoRate.value / 100, value: 0 } // Convert percentage to decimal
    })
  }
}, { immediate: true })

// Función para emitir el estado actual
const emitUpdate = () => {
  emit('update:insurance', {
    desgravamen: { enabled: desgravamenEnabled.value, rate: desgravamenEnabled.value ? (desgravamenRate.value / 100) : 0 },
    // El 'value' se actualiza en el padre, lo dejamos en 0 aquí
    propertyInsurance: { enabled: riesgoEnabled.value, rate: riesgoEnabled.value ? (riesgoRate.value / 100) : 0, value: 0 }
  })
}

// ... (watch props.selectedEntity) ...
// (El watch de selectedEntity ya actualiza los refs locales,
// los nuevos watchers de abajo capturarán ese cambio)

// Observar cambios locales y emitirlos al padre
watch([desgravamenEnabled, desgravamenRate, riesgoEnabled, riesgoRate], () => {
  emitUpdate()
})

// Emitir estado inicial
emitUpdate()

emit('update:insurance', {
  desgravamen: { enabled: desgravamenEnabled.value, rate: desgravamenRate.value / 100 }, // Convert percentage to decimal
  propertyInsurance: { enabled: riesgoEnabled.value, rate: riesgoRate.value / 100, value: 0 } // Convert percentage to decimal
})
</script>