<template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h3 class="text-lg font-semibold text-gray-900">Costos Fijos Mensuales</h3>
      <button
          @click="showHelp = true"
          type="button"
          class="ml-2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none rounded-full p-1 hover:bg-gray-100"
          aria-label="Más información sobre costos mensuales"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex items-center space-x-3">
        <div class="text-gray-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-900">Comisiones constantes</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500 font-medium">{{ currencySymbol }}</span>
            <input
                v-model="constantCommissions"
                type="number"
                step="0.01"
                class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <div class="text-gray-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-900">Gastos de administración</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500 font-medium">{{ currencySymbol }}</span>
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

    <Teleport to="body">
      <div v-if="showHelp" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showHelp = false"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Cargos Adicionales en tu Cuota</h3>
                  <div class="mt-4 text-sm text-gray-500 space-y-4">
                    <p>Además de pagar el capital y los intereses, tu cuota mensual incluye estos conceptos:</p>

                    <div class="grid grid-cols-1 gap-3">
                      <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p class="font-bold text-gray-900 text-xs uppercase mb-1">Comisiones y Gastos Adm.</p>
                        <p>Cobros fijos mensuales que realiza la entidad financiera por el mantenimiento y operatividad del crédito.</p>
                      </div>

                      <div class="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                        <p class="font-bold text-indigo-900 text-xs uppercase mb-1">Seguro de Desgravamen</p>
                        <p>Es obligatorio. Cubre el pago total de la deuda en caso de fallecimiento o invalidez total y permanente del titular.</p>
                      </div>

                      <div class="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                        <p class="font-bold text-indigo-900 text-xs uppercase mb-1">Seguro Contra Todo Riesgo</p>
                        <p>Es obligatorio. Protege el inmueble frente a daños físicos como incendios, terremotos, inundaciones, etc.</p>
                      </div>

                      <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p class="font-bold text-gray-900 text-xs uppercase mb-1">Portes (Envío de Estado de Cuenta)</p>
                        <p>Costo por el envío físico del documento a tu domicilio. <span class="text-indigo-600 font-medium">¡Es gratis si eliges el envío virtual!</span></p>
                      </div>
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
import { ref, watch, computed } from 'vue'

const props = defineProps({
  initialCommissions: { type: Number, default: 0 },
  initialAdminCosts: { type: Number, default: 0 },
  currency: { type: String, default: 'PEN' }
})

// Estado del modal
const showHelp = ref(false)

const constantCommissions = ref(props.initialCommissions)
const administrationCosts = ref(props.initialAdminCosts)

const currencySymbol = computed(() => props.currency === 'USD' ? '$' : 'S/')

const emit = defineEmits(['update:constantCommissions', 'update:administrationCosts'])

watch(() => props.initialCommissions, (val) => constantCommissions.value = val)
watch(() => props.initialAdminCosts, (val) => administrationCosts.value = val)

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