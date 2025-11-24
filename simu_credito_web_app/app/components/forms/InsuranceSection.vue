<template>
  <div class="space-y-4">
    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="desgravamen" v-model="desgravamenEnabled" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label for="desgravamen" class="ml-3 text-sm font-medium text-gray-900">Seguro de desgravamen (?)</label>
        </div>
        <div v-if="desgravamenEnabled" class="flex items-center space-x-2">
          <input v-model="desgravamenRate" type="number" step="0.0001" class="w-20 rounded-lg border border-gray-200 bg-gray-50 py-1 px-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500" />
          <span class="text-sm text-gray-500">%</span>
        </div>
      </div>
    </div>

    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="riesgo" v-model="riesgoEnabled" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label for="riesgo" class="ml-3 text-sm font-medium text-gray-900">Seguro contra todo riesgo (?)</label>
        </div>
        <div v-if="riesgoEnabled" class="flex items-center space-x-2">
          <input v-model="riesgoRate" type="number" step="0.0001" class="w-20 rounded-lg border border-gray-200 bg-gray-50 py-1 px-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500" />
          <span class="text-sm text-gray-500">%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedEntity: { type: Object, default: null },
  initialInsurance: {
    type: Object,
    default: () => ({
      desgravamen: { enabled: true, rate: 0.03 },
      propertyInsurance: { enabled: true, rate: 0.025 }
    })
  }
})

const desgravamenEnabled = ref(true)
const desgravamenRate = ref(0.03)
const riesgoEnabled = ref(true)
const riesgoRate = ref(0.025)

const emit = defineEmits(['update:insurance'])

// Watcher para restaurar datos de edición
watch(() => props.initialInsurance, (val) => {
  if (val) {
    if (val.desgravamen) {
      desgravamenEnabled.value = val.desgravamen.enabled
      desgravamenRate.value = val.desgravamen.rate;
    }
    if (val.propertyInsurance) {
      riesgoEnabled.value = val.propertyInsurance.enabled
      riesgoRate.value = val.propertyInsurance.rate;
    }
  }
}, { immediate: true, deep: true })

// Watcher para entidad (solo si no estamos editando)
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity) {
    if (newEntity.lifeInsurancePercentage) desgravamenRate.value = newEntity.lifeInsurancePercentage
    if (newEntity.propertyInsurancePercentage) riesgoRate.value = newEntity.propertyInsurancePercentage
  }
})

const emitUpdate = () => {
  emit('update:insurance', {
    desgravamen: { enabled: desgravamenEnabled.value, rate: desgravamenEnabled.value ? (desgravamenRate.value / 100) : 0 },
    propertyInsurance: { enabled: riesgoEnabled.value, rate: riesgoEnabled.value ? (riesgoRate.value / 100) : 0, value: 0 }
  })
}

watch([desgravamenEnabled, desgravamenRate, riesgoEnabled, riesgoRate], emitUpdate)
emitUpdate()
</script>