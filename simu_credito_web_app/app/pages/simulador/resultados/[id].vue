<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex justify-between items-center">
        <button
            @click="goBackToSimulator"
            class="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Simulador
        </button>

        <button
            @click="exportToPDF"
            :disabled="isExporting"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center disabled:opacity-50"
        >
          <svg v-if="!isExporting" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="isExporting">Exportando...</span>
          <span v-else>Exportar a PDF</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 max-w-7xl mx-auto px-4 py-8">
      <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-gray-600">Cargando resultados de la simulación...</p>
    </div>
    <div v-else class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Resumen de la Operación</h1>
        <p class="text-gray-600">{{ clientInfo?.name || 'Cliente' }} - {{ propertyInfo?.name || 'Propiedad' }}</p>
      </div>

      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <dt class="text-sm font-medium text-gray-500">Valor Inmueble</dt>
          <dd class="text-xl font-semibold text-gray-900">S/ {{ summary?.propertyValue?.toLocaleString() || '0' }}</dd>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <dt class="text-sm font-medium text-gray-500">Aporte del Estado</dt>
          <dd class="text-xl font-semibold text-gray-900">S/ {{ summary?.stateContribution?.toLocaleString() || '0' }}</dd>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <dt class="text-sm font-medium text-gray-500">Cuota Inicial</dt>
          <dd class="text-xl font-semibold text-gray-900">S/ {{ summary?.initialPayment?.toLocaleString() || '0' }}</dd>
        </div>
        <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <dt class="text-sm font-medium text-indigo-800">Monto Financiado</dt>
          <dd class="text-xl font-semibold text-indigo-600">S/ {{ summary?.financingAmount?.toLocaleString() || '0' }}</dd>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <div class="text-center">
            <h3 class="text-lg font-medium text-indigo-800 mb-2">Cuota Mensual Total</h3>
            <div class="text-6xl font-bold text-indigo-600 mb-2">
              S/ {{ keyIndicators?.monthlyPayment ? keyIndicators.monthlyPayment.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00' }}
            </div>
            <div class="text-xs text-gray-500">
              Incluye: capital, intereses, seguros y costos
            </div>
          </div>
        </div>

        <div class="col-span-2 grid grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">TCEA</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ keyIndicators?.tcea ? keyIndicators.tcea.toFixed(2) : '0.00' }}%</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">COK</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ keyIndicators?.cok ? keyIndicators.cok.toFixed(2) : '0.00' }}%</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">VAN</dt>
            <dd class="text-3xl font-semibold text-gray-900">S/ {{ keyIndicators?.van?.toLocaleString() || '0' }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">TIR</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ keyIndicators?.tir ? keyIndicators.tir.toFixed(2) : '0.00' }}%</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Total Intereses</dt>
            <dd class="text-3xl font-semibold text-gray-900">S/ {{ keyIndicators?.totalInterest?.toLocaleString() || '0' }}</dd>
          </div>
        </div>
      </div>

      <AmortizationTable
          :simulation-id="simulationId"
          :total-payments="amortizationSchedule?.totalPayments || 0"
          :current-page="amortizationSchedule?.currentPage || 0"
          :page-size="amortizationSchedule?.pageSize || 10"
          :payments="amortizationSchedule?.payments || []"
          @page-change="handlePageChange"
      />

      <div class="text-center mt-8 text-xs text-gray-500">
        Cálculos basados en el método francés vencido ordinario con meses de 30 días.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// --- CAMBIO: Importar la función que acabamos de exportar ---
import { useSimulations } from '~/composables/useSimulations'

// Components
import AmortizationTable from '~/components/AmortizationTable.vue'

const route = useRoute()
// --- CAMBIO: Obtener ambas funciones ---
const { getAmortizationSchedule, getSimulationById, exportSimulationToPDF } = useSimulations()

// State
const simulationId = ref('')
const clientInfo = ref(null)
const propertyInfo = ref(null)
const summary = ref(null)
const keyIndicators = ref(null)
const amortizationSchedule = ref(null)
const loading = ref(true)
const isExporting = ref(false) // <-- AÑADIDO: Estado de carga para PDF
const simulationData = ref(null) // <-- AÑADIDO: Estado para datos completos

// Methods
const goBackToSimulator = () => {
  navigateTo('/simulador')
}

// --- CAMBIO: Lógica de exportación ---
const exportToPDF = async () => {
  if (isExporting.value || !simulationData.value) return
  isExporting.value = true
  try {
    // LLAMAR A LA FUNCIÓN REAL
    await exportSimulationToPDF(simulationData.value)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    // TODO: Mostrar notificación de error al usuario
  } finally {
    isExporting.value = false
  }
}
// --- FIN DE CAMBIO ---

const handlePageChange = async (page) => {
  try {
    const result = await getAmortizationSchedule(simulationId.value, page)
    amortizationSchedule.value = result
  } catch (error) {
    console.error('Error loading amortization schedule:', error)
  }
}

onMounted(async () => {
  try {
    loading.value = true
    simulationId.value = route.params.id

    if (!simulationId.value) {
      throw new Error("No se encontró ID de simulación")
    }

    // 1. Cargar todos los datos de la simulación
    const data = await getSimulationById(simulationId.value)

    // 2. Asignar los datos reales (reemplazando los mocks)
    clientInfo.value = data.clientInfo
    propertyInfo.value = data.propertyInfo
    summary.value = data.summary
    keyIndicators.value = data.keyIndicators

    // 3. Asignar la tabla de amortización (AHORA ESTÁ COMPLETA)
    amortizationSchedule.value = data.amortizationSchedule

    // 4. Guardar los datos completos para el PDF
    simulationData.value = data

  } catch (error) {
    console.error('Error loading simulation results:', error)
  } finally {
    loading.value = false
  }
})
</script>