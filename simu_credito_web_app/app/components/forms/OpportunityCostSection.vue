<template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h3 class="text-lg font-semibold text-gray-900">Costo de Oportunidad para el Capital (COK)</h3>
      <button
          @click="showHelp = true"
          type="button"
          class="ml-2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none rounded-full p-1 hover:bg-gray-100"
          aria-label="Más información sobre el COK"
      >
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

    <Teleport to="body">
      <div v-if="showHelp" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showHelp = false"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">¿Qué es el COK?</h3>
                  <div class="mt-2 text-sm text-gray-500 space-y-4">
                    <p>El <strong>Costo de Oportunidad de Capital</strong> es la tasa de rentabilidad que dejarías de ganar si invirtieras tu dinero en otra alternativa de riesgo similar (ej. un depósito a plazo o un fondo mutuo).</p>

                    <div class="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                      <p class="font-semibold text-indigo-900">¿Para qué sirve aquí?</p>
                      <p class="mt-1">Se utiliza como <strong>tasa de descuento</strong> para calcular el VAN (Valor Actual Neto) de tu crédito. Sirve para evaluar si financieramente te conviene tomar este crédito o invertir tu dinero en otra cosa.</p>
                    </div>

                    <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p class="font-semibold text-gray-900">Tipos de Tasa</p>
                      <ul class="mt-1 list-disc list-inside">
                        <li><strong>TE (Efectiva):</strong> Tasa real que incluye capitalización.</li>
                        <li><strong>TN (Nominal):</strong> Tasa referencial, requiere capitalización.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="showHelp = false"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedEntity: { type: Object, default: null },
  initialRate: { type: Number, default: 8.50 },
  initialType: { type: String, default: 'TE' },
  initialPeriod: { type: String, default: 'annual' },
  initialCap: { type: String, default: 'daily' }
})

// Estado para controlar el modal
const showHelp = ref(false)

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

// Watcher para Precarga desde Entidad
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity) {
    if (newEntity.interestRateTea) {
      opportunityRate.value = newEntity.interestRateTea
    }
    if (newEntity.capitalizationPeriod) {
      selectedCapitalization.value = newEntity.capitalizationPeriod.toLowerCase()
    }
    emit('update:opportunityRate', opportunityRate.value)
    emit('update:rateType', selectedRateType.value)
    emit('update:period', selectedPeriod.value)
    emit('update:capitalization', selectedCapitalization.value)
  }
}, { immediate: true })

// Watchers para emitir cambios al padre
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