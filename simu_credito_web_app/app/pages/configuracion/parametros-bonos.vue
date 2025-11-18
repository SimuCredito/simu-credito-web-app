<template>
  <div class="space-y-8">

    <div v-if="isLoading" class="text-center py-20">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-500 mt-4">Cargando parámetros de bonos...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>

    <template v-else>
      <section>
        <h3 class="text-lg font-semibold text-gray-900">
          Gestión de Bonos del Buen Pagador (Crédito MiVivienda)
        </h3>

        <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mt-4">
          <p>Estos valores deben ser actualizados periódicamente según las publicaciones oficiales del Fondo MiVivienda. Los rangos de vivienda se ajustan una vez al año para compensar la inflación.</p>
        </div>

        <div class="mt-6 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="th-cell pl-4 sm:pl-6">Rango</th>
                    <th scope="col" class="th-cell">Valor de Vivienda</th>
                    <th scope="col" class="th-cell">BBP Tradicional</th>
                    <th scope="col" class="th-cell">BBP Sostenible</th>
                    <th scope="col" class="th-cell">BBP Integrador</th>
                    <th scope="col" class="th-cell">BBP Integrador Sostenible</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Editar</span></th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="range in groupedBbpParameters" :key="range.rangeName">
                    <td class="td-cell-main pl-4 sm:pl-6">{{ range.rangeName }}</td>
                    <td class="td-cell">{{ range.valueRangeText }}</td>
                    <td class="td-cell">{{ formatCurrency(range.tradicional?.bonusAmount) }}</td>
                    <td class="td-cell">{{ formatCurrency(range.sostenible?.bonusAmount) }}</td>
                    <td class="td-cell">{{ formatCurrency(range.integrador?.bonusAmount) }}</td>
                    <td class="td-cell">{{ formatCurrency(range.integradorSostenible?.bonusAmount) }}</td>
                    <td class="td-cell-action">
                      <button @click="openEditBbpModal(range)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            Parámetros del Programa Techo Propio
          </h3>
          <button @click="openEditTechoPropioModal" class="btn-secondary">
            Editar Parámetros
          </button>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card">
            <span class="card-label">Bono Familiar Habitacional (BFH) - AVN</span>
            <span class="card-value">{{ formatCurrency(techoPropioParameters.bfh_avn?.numericValue) }}</span>
          </div>
          <div class="card">
            <span class="card-label">Ingreso Familiar Mensual (Máx.)</span>
            <span class="card-value">{{ formatCurrency(techoPropioParameters.ifm_max?.numericValue) }}</span>
          </div>
          <div class="card">
            <span class="card-label">Valor de Vivienda (Máx.)</span>
            <span class="card-value">{{ formatCurrency(techoPropioParameters.viv_max?.numericValue) }}</span>
          </div>
        </div>
      </section>
    </template>

    <BonusBbpModal
        :is-open="isBbpModalOpen"
        :is-loading="isSubmitting"
        :range-data="selectedBbpRange"
        @close="closeEditBbpModal"
        @save="handleSaveBbp"
    />

    <BonusTechoPropioModal
        :is-open="isTechoPropioModalOpen"
        :is-loading="isSubmitting"
        :techo-propio-params="techoPropioParameters"
        @close="closeEditTechoPropioModal"
        @save="handleSaveTechoPropio"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration'
import { useNotifications } from '~/composables/useNotifications'
import BonusBbpModal from '~/components/BonusBdpModal.vue'
import BonusTechoPropioModal from "~/components/BonusTechoPropioModal.vue";

// --- Inyección de Composables ---
const { listBonusParameters, updateBonusParameter, getTechoPropioParameters, updateGlobalValue } = useConfiguration()
const { showSuccess, showError } = useNotifications()

// --- Estado de la UI ---
const allParameters = ref([])
const techoPropioParams = ref({})
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

// --- Estado de Modales ---
const isBbpModalOpen = ref(false)
const isTechoPropioModalOpen = ref(false)
const selectedBbpRange = ref(null)

// --- Funciones de Carga de Datos ---
const fetchParameters = async () => {
  try {
    isLoading.value = true
    error.value = null
    allParameters.value = await listBonusParameters()
  } catch (err) {
    console.error('Error cargando parámetros:', err)
    error.value = 'No se pudieron cargar los parámetros. ' + err.message
    showError(error.value)
  } finally {
    isLoading.value = false
  }
}

const fetchTechoPropio = async () => {
  try {
    techoPropioParams.value = await getTechoPropioParameters()
  } catch (err) {
    console.error('Error cargando parámetros de Techo Propio:', err)
    showError('Error cargando parámetros de Techo Propio: ' + err.message)
  }
}

onMounted(async () => {
  await Promise.all([fetchParameters(), fetchTechoPropio()])
})

// --- Funciones de Formato y Ayuda ---
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'No aplica'
  return `S/ ${value.toLocaleString('es-PE')}`
}

const formatRangeText = (min, max) => {
  if (!min && !max) return 'N/A'
  if (min && !max) return `Mayores a ${formatCurrency(min)}`
  if (!min && max) return `Hasta ${formatCurrency(max)}`
  return `Desde ${formatCurrency(min)} hasta ${formatCurrency(max)}`
}

// --- Lógica de Agrupación (Computed) ---

const groupedBbpParameters = computed(() => {
  const bbpParams = allParameters.value.filter(p => p.bonusType === 'BBP')

  // Agrupamos por el valor máximo de propiedad
  const groups = bbpParams.reduce((acc, param) => {
    const key = param.maxPropertyValue || 0
    if (!acc[key]) {
      acc[key] = {
        rangeName: '', // Lo asignaremos después
        valueRangeText: formatRangeText(param.minPropertyValue, param.maxPropertyValue),
        min: param.minPropertyValue,
        max: param.maxPropertyValue,
        tradicional: null,
        sostenible: null,
        integrador: null,
        integradorSostenible: null,
      }
    }

    // Asignamos el parámetro a su subtipo
    if (param.bonusSubtype === 'TRADITIONAL') acc[key].tradicional = param
    if (param.bonusSubtype === 'SUSTAINABLE') acc[key].sostenible = param
    if (param.bonusSubtype === 'INTEGRATOR') acc[key].integrador = param
    if (param.bonusSubtype === 'INTEGRATOR_SUSTAINABLE') acc[key].integradorSostenible = param

    return acc
  }, {})

  // Convertimos el objeto a array, lo ordenamos por 'max' y asignamos nombres R1-R5
  return Object.values(groups)
      .sort((a, b) => a.max - b.max)
      .map((group, index) => ({
        ...group,
        rangeName: `R${index + 1}`
      }))
})

const techoPropioParameters = computed(() => {
  return techoPropioParams.value
})

// --- Lógica de Modales BBP ---
const openEditBbpModal = (range) => {
  selectedBbpRange.value = range
  isBbpModalOpen.value = true
}
const closeEditBbpModal = () => {
  isBbpModalOpen.value = false
  selectedBbpRange.value = null
}
const handleSaveBbp = async (formData) => {
  isSubmitting.value = true
  try {
    const updates = []

    // Creamos un array de promesas de actualización con el objeto completo
    if (formData.tradicional?.id) updates.push(updateBonusParameter(formData.tradicional.id, formData.tradicional))
    if (formData.sostenible?.id) updates.push(updateBonusParameter(formData.sostenible.id, formData.sostenible))
    if (formData.integrador?.id) updates.push(updateBonusParameter(formData.integrador.id, formData.integrador))
    if (formData.integradorSostenible?.id) updates.push(updateBonusParameter(formData.integradorSostenible.id, formData.integradorSostenible))

    await Promise.all(updates)

    showSuccess('Rango BBP actualizado exitosamente')
    closeEditBbpModal()
    await fetchParameters() // Recargamos
  } catch (err) {
    console.error('Error guardando BBP:', err)
    showError('Error al guardar: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

// --- Lógica de Modales Techo Propio ---
const openEditTechoPropioModal = () => {
  isTechoPropioModalOpen.value = true
}
const closeEditTechoPropioModal = () => {
  isTechoPropioModalOpen.value = false
}
const handleSaveTechoPropio = async (formData) => {
  isSubmitting.value = true
  try {
    const updates = []

    // Creamos un array de promesas de actualización con el objeto completo
    if (formData.bfh_avn?.id) updates.push(updateGlobalValue(formData.bfh_avn.id, formData.bfh_avn))
    if (formData.ifm_max?.id) updates.push(updateGlobalValue(formData.ifm_max.id, formData.ifm_max))
    if (formData.viv_max?.id) updates.push(updateGlobalValue(formData.viv_max.id, formData.viv_max))

    await Promise.all(updates)

    showSuccess('Parámetros de Techo Propio actualizados')
    closeEditTechoPropioModal()
    await fetchTechoPropio() // Recargamos
  } catch (err) {
    console.error('Error guardando Techo Propio:', err)
    showError('Error al guardar: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
/* Estilos de la Tabla */
.th-cell {
  @apply py-3.5 px-3 text-left text-sm font-semibold text-gray-900;
}
.td-cell {
  @apply whitespace-nowrap px-3 py-4 text-sm text-gray-500;
}
.td-cell-main {
  @apply whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900;
}
.td-cell-action {
  @apply relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6;
}

/* Estilos de las Tarjetas */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-5 flex flex-col;
}
.card-label {
  @apply text-sm font-medium text-gray-500;
}
.card-value {
  @apply mt-1 text-3xl font-bold text-gray-900;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150;
}
</style>