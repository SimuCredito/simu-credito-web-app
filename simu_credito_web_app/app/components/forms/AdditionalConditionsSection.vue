<template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h3 class="text-lg font-semibold text-gray-900">Condiciones Adicionales</h3>
      <button
          @click="showHelp = true"
          type="button"
          class="ml-2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none rounded-full p-1 hover:bg-gray-100"
          aria-label="Más información sobre periodos de gracia"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Período de Gracia</label>
      <div class="flex rounded-lg border border-gray-200 p-1 bg-white">
        <button
            v-for="grace in gracePeriods"
            :key="grace.id"
            @click="selectedGracePeriod = grace.id"
            :class="['flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors', selectedGracePeriod === grace.id ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50']"
        >
          {{ grace.label }}
        </button>
      </div>
      <p v-if="selectedEntity" class="text-xs text-indigo-600 mt-1">
        {{ selectedEntity.entityName }} ofrece hasta {{ selectedEntity.periodoGracia }} meses de gracia.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Duración en meses (max 6 meses)</label>
      <input v-model="graceDuration" type="number" min="0" max="6" class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">¿Qué es el Periodo de Gracia?</h3>
                  <div class="mt-2 text-sm text-gray-500 space-y-4">
                    <p>Es un tiempo inicial donde se te permite posponer el pago del capital. Existen dos tipos:</p>

                    <div class="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                      <p class="font-semibold text-indigo-900">Gracia Parcial (Normal)</p>
                      <p class="mt-1">Pagas <strong>solo los intereses</strong> de ese mes. El capital no disminuye, pero la deuda no crece. Es lo más común en créditos hipotecarios.</p>
                    </div>

                    <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p class="font-semibold text-gray-900">Gracia Total</p>
                      <p class="mt-1">Pagas <strong>S/ 0.00</strong> durante este periodo. ¡Cuidado! Los intereses no pagados se suman a tu deuda (capitalización), por lo que tu cuota futura aumentará.</p>
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
  initialGraceType: { type: String, default: 'none' },
  initialGraceDuration: { type: Number, default: 0 }
})

// Estado para el modal
const showHelp = ref(false)

const gracePeriods = [ { id: 'none', label: 'Sin Gracia' }, { id: 'partial', label: 'Parcial' }, { id: 'total', label: 'Total' } ]

const selectedGracePeriod = ref(props.initialGraceType)
const graceDuration = ref(props.initialGraceDuration)

const emit = defineEmits(['update:gracePeriod', 'update:graceDuration'])

// Watchers para edición
watch(() => props.initialGraceType, (val) => selectedGracePeriod.value = val)
watch(() => props.initialGraceDuration, (val) => graceDuration.value = val)

// Lógica de entidad: Solo aplica si el usuario selecciona una entidad manualmente y NO estamos en modo edición restaurando valores
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity && newEntity.periodoGracia && graceDuration.value === 0) {
    graceDuration.value = newEntity.periodoGracia
    selectedGracePeriod.value = newEntity.periodoGracia > 0 ? 'partial' : 'none'
  }
}, { immediate: true })

watch(selectedGracePeriod, (val) => emit('update:gracePeriod', val))
watch(graceDuration, (val) => emit('update:graceDuration', val))

emit('update:gracePeriod', selectedGracePeriod.value)
emit('update:graceDuration', graceDuration.value)
</script>