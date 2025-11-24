<template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h3 class="text-lg font-semibold text-gray-900">Costo de Oportunidad para el Capital (COK)</h3>
      <button class="ml-2 text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Tipo</label>
        <div class="flex rounded-lg border border-gray-200 p-1 bg-white">
          <button
              v-for="type in rateTypes"
              :key="type.id"
              @click="selectedRateType = type.id"
              :class="['flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors', selectedRateType === type.id ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50']"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Período</label>
        <select v-model="selectedPeriod" class="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 sm:text-sm">
          <option v-for="period in periods" :key="period.id" :value="period.id">{{ period.label }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Valor de Tasa (%)</label>
        <div class="relative">
          <input v-model="opportunityRate" type="number" step="0.01" class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
          <div class="absolute inset-y-0 right-0 flex items-center pr-2">
            <button @click="opportunityRate = Math.max(0, opportunityRate - 0.01)" class="text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </button>
            <button @click="opportunityRate += 0.01" class="text-gray-400 hover:text-gray-600 ml-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </div>
        </div>
        <p v-if="selectedEntity" class="text-xs text-indigo-600 mt-1">
          Sugerida por {{ selectedEntity.entityName }}: {{ opportunityRate }}%
        </p>
      </div>

      <div v-if="selectedRateType === 'TN'">
        <label class="block text-sm font-medium text-gray-900 mb-2">Capitalización</label>
        <select v-model="selectedCapitalization" class="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 sm:text-sm">
          <option v-for="cap in capitalizations" :key="cap.id" :value="cap.id">{{ cap.label }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedEntity: { type: Object, default: null }, // AGREGADO: Recibir la entidad seleccionada
  initialRate: { type: Number, default: 8.50 },
  initialType: { type: String, default: 'TE' },
  initialPeriod: { type: String, default: 'annual' }, // CORREGIDO: 'annual' por defecto para evitar error 166%
  initialCap: { type: String, default: 'daily' }
})

const rateTypes = [ { id: 'TE', label: 'TE' }, { id: 'TN', label: 'TN' } ]
const periods = [ { id: 'daily', label: 'Diario' }, { id: 'weekly', label: 'Semanal' }, { id: 'biweekly', label: 'Quincenal' }, { id: 'monthly', label: 'Mensual' }, { id: 'bimonthly', label: 'Bimestral' }, { id: 'quarterly', label: 'Trimestral' }, { id: 'semiannual', label: 'Semestral' }, { id: 'annual', label: 'Anual' } ]
const capitalizations = [ { id: 'daily', label: 'Diaria' }, { id: 'weekly', label: 'Semanal' }, { id: 'biweekly', label: 'Quincenal' }, { id: 'monthly', label: 'Mensual' }, { id: 'bimonthly', label: 'Bimestral' }, { id: 'quarterly', label: 'Trimestral' }, { id: 'semiannual', label: 'Semestral' }, { id: 'annual', label: 'Anual' } ]

const selectedRateType = ref(props.initialType)
const selectedPeriod = ref(props.initialPeriod)
const selectedCapitalization = ref(props.initialCap)
const opportunityRate = ref(props.initialRate)

const emit = defineEmits(['update:opportunityRate', 'update:rateType', 'update:period', 'update:capitalization'])

// Watchers para recibir datos del padre (edición manual / carga de borrador)
watch(() => props.initialRate, (val) => opportunityRate.value = val)
watch(() => props.initialType, (val) => selectedRateType.value = val)
watch(() => props.initialPeriod, (val) => selectedPeriod.value = val)
watch(() => props.initialCap, (val) => selectedCapitalization.value = val)

// AGREGADO: Watcher para Precarga desde Entidad
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity) {
    // Usamos la tasa de la entidad como referencia para el COK si existe
    if (newEntity.interestRateTea) {
      opportunityRate.value = newEntity.interestRateTea
    }

    // Precargamos la capitalización si la entidad tiene preferencia
    if (newEntity.capitalizationPeriod) {
      selectedCapitalization.value = newEntity.capitalizationPeriod.toLowerCase()
    }

    // Emitimos los cambios para actualizar el estado global
    emit('update:opportunityRate', opportunityRate.value)
    emit('update:rateType', selectedRateType.value)
    emit('update:period', selectedPeriod.value)
    emit('update:capitalization', selectedCapitalization.value)
  }
}, { immediate: true })

// Watchers para emitir cambios al padre cuando el usuario edita
watch(opportunityRate, (val) => emit('update:opportunityRate', val))
watch(selectedRateType, (val) => emit('update:rateType', val))
watch(selectedPeriod, (val) => emit('update:period', val))
watch(selectedCapitalization, (val) => emit('update:capitalization', val))

// Emitir valores iniciales
emit('update:opportunityRate', opportunityRate.value)
emit('update:rateType', selectedRateType.value)
emit('update:period', selectedPeriod.value)
emit('update:capitalization', selectedCapitalization.value)
</script>