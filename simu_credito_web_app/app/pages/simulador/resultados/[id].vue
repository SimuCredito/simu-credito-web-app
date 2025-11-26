<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex justify-between items-center">
        <div class="flex gap-3">
          <button @click="goBackToSimulator" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center">
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Nueva simulación
          </button>

          <button @click="handleEditParams" class="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center font-medium">
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar parámetros
          </button>
        </div>

        <button @click="exportToPDF" :disabled="isExporting" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center disabled:opacity-50">
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

      <div v-if="simulationCurrency === 'USD'" class="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Simulación en Dólares Americanos (USD)</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>
                Esta simulación se realizó utilizando un tipo de cambio referencial de
                <strong>S/ {{ simulationData.inputs?.usdValue }}</strong>.
              </p>
              <p class="mt-1 text-xs">
                * Los bonos del estado (BBP/Techo Propio) se calculan originalmente en Soles y han sido convertidos a Dólares para este cálculo.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Resumen de la operación</h1>
        <p class="text-gray-600">{{ clientInfo?.name || 'Cliente' }} - {{ propertyInfo?.name || 'Propiedad' }}</p>
      </div>

      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <dt class="text-sm font-medium text-gray-500">Valor Inmueble</dt>
          <dd class="text-xl font-semibold text-gray-900">{{ formatMoney(summary?.propertyValue) }}</dd>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <dt class="text-sm font-medium text-gray-500">Aporte del Estado</dt>
          <dd class="text-xl font-semibold text-gray-900">{{ formatMoney(summary?.stateContribution) }}</dd>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <dt class="text-sm font-medium text-gray-500">Cuota Inicial</dt>
          <dd class="text-xl font-semibold text-gray-900">{{ formatMoney(summary?.initialPayment) }}</dd>
        </div>
        <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <dt class="text-sm font-medium text-indigo-800">Monto Financiado</dt>
          <dd class="text-xl font-semibold text-indigo-600">{{ formatMoney(summary?.financingAmount) }}</dd>
        </div>
      </div>

      <!-- Indicadores Clave -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <div class="text-center">
            <h3 class="text-lg font-medium text-indigo-800 mb-2">Cuota Mensual Total</h3>
            <div class="text-6xl font-bold text-indigo-600 mb-2">
              {{ formatMoney(keyIndicators?.monthlyPayment) }}
            </div>
            <div class="text-xs text-gray-500">
              Incluye: amortización, intereses, seguros y costos
            </div>
          </div>
        </div>

        <div class="col-span-2 grid grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">TCEA</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ keyIndicators?.tcea ? keyIndicators.tcea.toFixed(2) : '0.00' }}%</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">COK (Mensual)</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ keyIndicators?.cok ? keyIndicators.cok.toFixed(4) : '0.00' }}%</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">VAN</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ formatMoney(keyIndicators?.van) }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">TIR (Mensual)</dt>
            <dd class="text-3xl font-semibold text-gray-900">{{ keyIndicators?.tir ? keyIndicators.tir.toFixed(4) : '0.00' }}%</dd>
          </div>
        </div>
      </div>

      <!-- NUEVA SECCIÓN: Resultados Totales -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Resultados totales</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Total Intereses</dt>
            <dd class="text-lg font-semibold text-gray-900">{{ formatMoney(totalResults?.totalInterest) }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Amortización Capital</dt>
            <dd class="text-lg font-semibold text-gray-900">{{ formatMoney(totalResults?.totalCapitalAmortization) }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Seguro Desgravamen</dt>
            <dd class="text-lg font-semibold text-gray-900">{{ formatMoney(totalResults?.totalDesgravamen) }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Seguro Todo Riesgo</dt>
            <dd class="text-lg font-semibold text-gray-900">{{ formatMoney(totalResults?.totalRiskInsurance) }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Comisiones Periódicas</dt>
            <dd class="text-lg font-semibold text-gray-900">{{ formatMoney(totalResults?.totalCommissions) }}</dd>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <dt class="text-sm font-medium text-gray-500">Portes / Gastos Adm.</dt>
            <dd class="text-lg font-semibold text-gray-900">{{ formatMoney(totalResults?.totalAdminExpenses) }}</dd>
          </div>
        </div>
      </div>

      <!-- NUEVA SECCIÓN: Parámetros del Préstamo (Inputs) -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Parámetros del préstamo</h2>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">Plazo</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ inputs?.termYears }} años ({{ (inputs?.termYears || 0) * 12 }} meses)</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Tasa interés</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ inputs?.interestRate }}% {{ inputs?.interestRateType }}
                {{ formatInterestRatePeiod(inputs?.interestRatePeriod) }}
                <span v-if="inputs?.interestRateType === 'TN'">
                  (cap: {{ formatInterestRatePeiod(inputs?.interestRateCapitalization) }})
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Periodo de gracia</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ inputs?.gracePeriodDurationMonths || 0 }} meses
                <span v-if="inputs?.gracePeriodDurationMonths > 0">({{ inputs?.gracePeriodType === 'total' ? 'Total' : 'Parcial' }})</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Seguro desgravamen</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ inputs?.desgravamenEnabled ? `Sí (${inputs?.desgravamenRate * 100}%)` : 'No' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Seguro inmueble</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ inputs?.propertyInsuranceEnabled ? `Sí (${inputs?.propertyInsuranceRate * 100}%)` : 'No' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Costos mensuales</dt>
              <dd class="mt-1 text-sm text-gray-900">
                Comisiones: {{ formatMoney(inputs?.monthlyCommissions) }} | Adm: {{ formatMoney(inputs?.administrationCosts) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">COK (Tasa oportunidad)</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ inputs?.opportunityCostRate }}% {{ inputs?.opportunityCostType }}
                {{ formatInterestRatePeiod(inputs?.opportunityCostPeriod) }}
                <span v-if="inputs?.opportunityCostType === 'TN'">
                  (cap: {{ formatInterestRatePeiod(inputs?.opportunityCostCapitalization) }})
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Envío estado cuenta</dt>
              <dd class="mt-1 text-sm text-gray-900 capitalize">{{ inputs?.statementDelivery === 'physical' ? 'Físico' : 'Virtual' }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <AmortizationTable
          :simulation-id="simulationId"
          :currency="simulationCurrency"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimulations } from '~/composables/useSimulations'
import { useClients } from '~/composables/useClients'
import { useProperties } from '~/composables/useProperties'

// Components
import AmortizationTable from '~/components/tables/AmortizationTable.vue'

const route = useRoute()
const { getAmortizationSchedule, getSimulationById, exportSimulationToPDF, setSimulationDraft } = useSimulations()
const { getClient } = useClients()
const { getProperty } = useProperties()

// State
const simulationId = ref('')
const clientInfo = ref(null)
const propertyInfo = ref(null)
const summary = ref(null)
const keyIndicators = ref(null)
const totalResults = ref(null) // <--- NUEVO STATE
const inputs = ref(null)       // <--- NUEVO STATE
const amortizationSchedule = ref(null)
const loading = ref(true)
const isExporting = ref(false)
const simulationData = ref(null)

// Computed: Currency
const simulationCurrency = computed(() => {
  return simulationData.value?.inputs?.currency || 'PEN';
});

// Helper: Money Formatter
const formatMoney = (value) => {
  if (value === undefined || value === null) return '0.00';
  return Number(value).toLocaleString('es-PE', {
    style: 'currency',
    currency: simulationCurrency.value,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Methods
const goBackToSimulator = () => {
  setSimulationDraft(null)
  navigateTo('/simulador')
}

const handleEditParams = () => {
  if (!simulationData.value) return
  setSimulationDraft(simulationData.value)
  navigateTo('/simulador')
}

const exportToPDF = async () => {
  if (isExporting.value || !simulationData.value) return
  isExporting.value = true
  try {
    await exportSimulationToPDF(simulationData.value)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
  } finally {
    isExporting.value = false
  }
}

const handlePageChange = async (page) => {
  try {
    const result = await getAmortizationSchedule(simulationId.value, page)
    amortizationSchedule.value = result
  } catch (error) {
    console.error('Error loading amortization schedule:', error)
  }
}

const formatInterestRatePeiod = (period) => {
  switch (period) {
    case 'daily':
      return 'Diario'
    case 'weekly':
      return 'Semanal'
    case 'biweekly':
      return 'Quincenal'
    case 'monthly':
      return 'Mensual'
    case 'bimonthly':
      return 'Bimestral'
    case 'quarterly':
      return 'Trimestral'
    case 'semiannual':
      return 'Semestral'
    case 'annual':
      return 'Anual'
    default:
      return ''
  }
}

onMounted(async () => {
  try {
    loading.value = true
    simulationId.value = route.params.id

    if (!simulationId.value) {
      throw new Error("No se encontró ID de simulación")
    }
    const data = await getSimulationById(simulationId.value)

    console.log(JSON.stringify(data))

    clientInfo.value = data.clientInfo
    propertyInfo.value = data.propertyInfo
    summary.value = data.summary
    keyIndicators.value = data.keyIndicators
    totalResults.value = data.totalResults // <--- ASIGNAR
    inputs.value = data.inputs             // <--- ASIGNAR
    amortizationSchedule.value = data.amortizationSchedule
    simulationData.value = data


  } catch (error) {
    console.error('Error loading simulation results:', error)
  } finally {
    loading.value = false
  }
})
</script>