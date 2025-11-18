<template>
  <div class="space-y-10">
    <div v-if="isLoading" class="text-center py-20">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-500 mt-4">Cargando parámetros de bonos...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-sm">
      <p><strong>Error al cargar:</strong> {{ error }}</p>
    </div>

    <template v-else>
      <section>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Gestión de Bonos del Buen Pagador (Crédito MiVivienda)
        </h3>
        <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mb-6 shadow-sm">
          <p>Estos valores deben ser actualizados periódicamente según las publicaciones oficiales del Fondo MiVivienda. Los rangos de vivienda se ajustan una vez al año para compensar la inflación.</p>
        </div>

        <div class="flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="th-cell pl-4 sm:pl-6">Rango</th>
                    <th scope="col" class="th-cell">Valor de Vivienda</th>
                    <th scope="col" class="th-cell text-right">BBP Tradicional</th>
                    <th scope="col" class="th-cell text-right">BBP Sostenible</th>
                    <th scope="col" class="th-cell text-right">BBP Integrador</th>
                    <th scope="col" class="th-cell text-right">BBP Integrador Sostenible</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Editar</span></th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-if="groupedBbpParameters.length === 0">
                    <td colspan="7" class="py-6 text-center text-gray-500">No se encontraron parámetros BBP configurados.</td>
                  </tr>
                  <tr v-for="range in groupedBbpParameters" :key="range.rangeName" class="hover:bg-gray-50/50 transition-colors duration-150">
                    <td class="td-cell-main pl-4 sm:pl-6">{{ range.rangeName }}</td>
                    <td class="td-cell">{{ range.valueRangeText }}</td>
                    <td class="td-cell text-right">{{ formatCurrency(range.tradicional?.bonusAmount) }}</td>
                    <td class="td-cell text-right">{{ formatCurrency(range.sostenible?.bonusAmount) }}</td>
                    <td class="td-cell text-right">{{ formatCurrency(range.integrador?.bonusAmount) }}</td>
                    <td class="td-cell text-right">{{ formatCurrency(range.integradorSostenible?.bonusAmount) }}</td>
                    <td class="td-cell-action">
                      <button @click="openEditBbpModal(range)" class="text-indigo-600 hover:text-indigo-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!range.tradicional" title="Editar valores de este rango">
                        Editar
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-t border-gray-200 pt-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            Parámetros del Programa Techo Propio (AVN)
          </h3>
          <button @click="openEditTechoPropioModal" class="btn-secondary" :disabled="!techoPropioParameters.bfh_avn" title="Editar parámetros de Techo Propio">
            Editar Parámetros
          </button>
        </div>

        <div v-if="!techoPropioParameters.bfh_avn && !techoPropioParameters.ifm_max && !techoPropioParameters.viv_max" class="text-center bg-gray-50 rounded-xl border border-gray-200 py-10 px-6">
          <p class="text-gray-500">No se encontraron parámetros de Techo Propio configurados.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card">
            <span class="card-label">Bono Familiar Habitacional (BFH)</span>
            <span class="card-value">{{ formatCurrency(techoPropioParameters.bfh_avn?.bonusAmount) }}</span>
          </div>
          <div class="card">
            <span class="card-label">Ingreso Familiar Mensual (Máx.)</span>
            <span class="card-value">{{ formatCurrency(techoPropioParameters.ifm_max?.maxPropertyValue) }}</span>
          </div>
          <div class="card">
            <span class="card-label">Valor de Vivienda (Máx.)</span>
            <span class="card-value">{{ formatCurrency(techoPropioParameters.viv_max?.maxPropertyValue) }}</span>
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
        :techo-propio-params="techoPropioParametersForModal"
        @close="closeEditTechoPropioModal"
        @save="handleSaveTechoPropio"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration'
import { useNotifications } from '~/composables/useNotifications'

// Importar Modales
const BonusBbpModal = defineAsyncComponent(() => import('@/components/BonusBbpModal.vue'))
const BonusTechoPropioModal = defineAsyncComponent(() => import('@/components/BonusTechoPropioModal.vue'))

// Composables
const { listBonusParameters, updateBonusParameter } = useConfiguration()
const { showSuccess, showError } = useNotifications()

// Estado
const allParameters = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false) // Para los modales
const error = ref(null)
const isBbpModalOpen = ref(false)
const isTechoPropioModalOpen = ref(false)
const selectedBbpRange = ref(null) // Para pasar datos al modal BBP

// Carga Inicial
onMounted(fetchParameters)

async function fetchParameters() {
  try {
    isLoading.value = true
    error.value = null
    const data = await listBonusParameters()
    allParameters.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error cargando parámetros:', err)
    error.value = 'No se pudieron cargar los parámetros. ' + (err.data?.message || err.message)
    showError(error.value)
    allParameters.value = []
  } finally {
    isLoading.value = false
  }
}

// Helpers
const formatCurrency = (value) => {
  if (value === null || value === undefined || value < 0) return 'No aplica'
  // Formato S/ con dos decimales, incluso si son .00
  return `S/ ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatRangeText = (min, max) => {
  const minF = min ? `S/ ${min.toLocaleString('es-PE')}` : null
  const maxF = max ? `S/ ${max.toLocaleString('es-PE')}` : null
  if (!minF && !maxF) return 'N/A'
  if (minF && !maxF) return `Mayores a ${minF}`
  if (!minF && maxF) return `Hasta ${maxF}`
  return `Desde ${minF} hasta ${maxF}`
}

// Agrupación de datos BBP (Computed)
const groupedBbpParameters = computed(() => {
  const bbpParams = allParameters.value.filter(p => p.bonusType === 'BBP')
  const groups = bbpParams.reduce((acc, param) => {
    const key = param.maxPropertyValue ?? Infinity // Agrupa por valor máximo, usa Infinity si es null (R5)
    if (!acc[key]) {
      acc[key] = {
        rangeName: '',
        valueRangeText: formatRangeText(param.minPropertyValue, param.maxPropertyValue),
        min: param.minPropertyValue,
        max: param.maxPropertyValue,
        // Inicializa todos los subtipos como null
        tradicional: null, sostenible: null, integrador: null, integradorSostenible: null,
      }
    }
    // Asigna el parámetro completo al subtipo correcto
    if (param.bonusSubtype === 'TRADICIONAL') acc[key].tradicional = param
    else if (param.bonusSubtype === 'SOSTENIBLE') acc[key].sostenible = param
    else if (param.bonusSubtype === 'INTEGRADOR') acc[key].integrador = param
    else if (param.bonusSubtype === 'INTEGRADOR_SOSTENIBLE') acc[key].integradorSostenible = param
    return acc
  }, {})

  return Object.values(groups)
      .sort((a, b) => (a.max ?? Infinity) - (b.max ?? Infinity))
      .map((group, index) => ({ ...group, rangeName: `R${index + 1}` }))
})

// Datos Techo Propio (Computed)
const techoPropioParameters = computed(() => {
  const tpParams = allParameters.value.filter(p => p.bonusType === 'TECHO_PROPIO')
  // Encuentra cada parámetro por su subtipo esperado
  return {
    bfh_avn: tpParams.find(p => p.bonusSubtype === 'BFH_AVN') || null,
    ifm_max: tpParams.find(p => p.bonusSubtype === 'IFM_MAX') || null,
    viv_max: tpParams.find(p => p.bonusSubtype === 'VIVIENDA_MAX') || null,
  }
})

// Datos formateados para el modal de Techo Propio, evitando nulls
const techoPropioParametersForModal = computed(() => ({
  // Asume que la API devuelve bonusAmount para BFH, pero maxPropertyValue para los límites
  bfh_avn: techoPropioParameters.value.bfh_avn ?? { id: null, bonusAmount: 0 },
  ifm_max: techoPropioParameters.value.ifm_max ?? { id: null, maxPropertyValue: 0 },
  viv_max: techoPropioParameters.value.viv_max ?? { id: null, maxPropertyValue: 0 }
}))

// Lógica Modales BBP
const openEditBbpModal = (range) => {
  if (!range.tradicional) {
    showError("No se pueden editar los valores para este rango (datos incompletos).")
    return;
  }
  selectedBbpRange.value = range
  isBbpModalOpen.value = true
}
const closeEditBbpModal = () => isBbpModalOpen.value = false

async function handleSaveBbp(formData) {
  isSubmitting.value = true
  try {
    const updates = []
    // Verifica existencia de ID antes de añadir a updates
    if (formData.tradicional?.id) updates.push(updateBonusParameter(formData.tradicional.id, { bonusAmount: Number(formData.tradicional.bonusAmount) || 0 }))
    if (formData.sostenible?.id) updates.push(updateBonusParameter(formData.sostenible.id, { bonusAmount: Number(formData.sostenible.bonusAmount) || 0 }))
    if (formData.integrador?.id) updates.push(updateBonusParameter(formData.integrador.id, { bonusAmount: Number(formData.integrador.bonusAmount) || 0 }))
    if (formData.integradorSostenible?.id) updates.push(updateBonusParameter(formData.integradorSostenible.id, { bonusAmount: Number(formData.integradorSostenible.bonusAmount) || 0 }))

    await Promise.all(updates)
    showSuccess('Rango BBP actualizado exitosamente')
    closeEditBbpModal()
    await fetchParameters()
  } catch (err) {
    console.error('Error guardando BBP:', err)
    showError(`Error al guardar BBP: ${err.data?.message || err.message}`)
  } finally {
    isSubmitting.value = false
  }
}

// Lógica Modales Techo Propio
const openEditTechoPropioModal = () => {
  if (!techoPropioParameters.value.bfh_avn) {
    showError("No se pueden editar los parámetros de Techo Propio (datos incompletos).")
    return;
  }
  isTechoPropioModalOpen.value = true
}
const closeEditTechoPropioModal = () => isTechoPropioModalOpen.value = false

async function handleSaveTechoPropio(formData) {
  isSubmitting.value = true
  try {
    const updates = []
    // Verifica ID y usa el campo correcto para actualizar (bonusAmount o maxPropertyValue)
    if (formData.bfh_avn?.id) updates.push(updateBonusParameter(formData.bfh_avn.id, { bonusAmount: Number(formData.bfh_avn.bonusAmount) || 0 }))
    if (formData.ifm_max?.id) updates.push(updateBonusParameter(formData.ifm_max.id, { maxPropertyValue: Number(formData.ifm_max.maxPropertyValue) || 0 }))
    if (formData.viv_max?.id) updates.push(updateBonusParameter(formData.viv_max.id, { maxPropertyValue: Number(formData.viv_max.maxPropertyValue) || 0 }))

    await Promise.all(updates)
    showSuccess('Parámetros de Techo Propio actualizados')
    closeEditTechoPropioModal()
    await fetchParameters()
  } catch (err) {
    console.error('Error guardando Techo Propio:', err)
    showError(`Error al guardar Techo Propio: ${err.data?.message || err.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Estilos de la Tabla */
.th-cell { @apply py-3.5 px-3 text-left text-sm font-semibold text-gray-900; }
.td-cell { @apply whitespace-nowrap px-3 py-4 text-sm text-gray-500; }
.td-cell-main { @apply whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900; }
.td-cell-action { @apply relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6; }

/* Estilos de las Tarjetas (Techo Propio) */
.card { @apply bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-5 flex flex-col items-center text-center; }
.card-label { @apply text-sm font-medium text-gray-500 mb-1; }
.card-value { @apply text-2xl font-bold text-gray-900; }

.btn-secondary { @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50; }
</style>