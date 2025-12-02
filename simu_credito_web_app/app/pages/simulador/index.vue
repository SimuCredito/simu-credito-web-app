<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8 overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
          <button
              @click="activeTab = 'new'"
              :class="[
              activeTab === 'new'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center flex-shrink-0'
            ]"
          >
            Nueva Simulación
          </button>
          <button
              @click="activeTab = 'history'"
              :class="[
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center flex-shrink-0'
            ]"
          >
            Historial
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'history'">
        <SimulationHistory/>
      </div>

      <div v-show="activeTab === 'new'">
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-8 w-full max-w-full">

          <div class="mb-8">
            <div class="hidden sm:block">
              <Stepper :current-step="currentStep"/>
            </div>

            <div class="block sm:hidden">
              <div class="flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
                <span>Paso {{ currentStep }} de 4</span>
                <span class="text-indigo-600 font-bold">
                  {{
                    currentStep === 1 ? 'Datos' :
                        currentStep === 2 ? 'Financiamiento' :
                            currentStep === 3 ? 'Oferta' : 'Condiciones'
                  }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                    class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(currentStep / 4) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
          <div v-if="currentStep === 1" class="space-y-6">

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-900 mb-3">Moneda de la Simulación</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    @click="handleCurrencyUpdate('PEN')"
                    :class="['flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all',
                    creditCurrency === 'PEN'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50']"
                >
                  <span class="mr-2">🇵🇪</span> Soles (PEN)
                </button>
                <button
                    @click="handleCurrencyUpdate('USD')"
                    :class="['flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all',
                    creditCurrency === 'USD'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50']"
                >
                  <span class="mr-2">🇺🇸</span> Dólares (USD)
                </button>
              </div>

              <div v-if="creditCurrency === 'USD' && currentExchangeRate"
                   class="mt-3 text-xs text-blue-600 flex items-center flex-wrap">
                <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>T.C. Referencial (Venta SUNAT): <strong>S/ {{ currentExchangeRate.sellPrice }}</strong></span>
              </div>
            </div>

            <ClientSelector @client-selected="handleClientSelected"/>

            <div class="w-full overflow-hidden">
              <PropertyPreview
                  :property="selectedProperty"
                  :currency="creditCurrency"
                  :exchange-rate="exchangeRateNumeric"
                  @change-property="goToPropertySelection"
              />
            </div>

            <div class="flex justify-end pt-2">
              <button
                  @click="goToStep2"
                  :disabled="!selectedClient || !selectedProperty"
                  class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                Siguiente
                <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="space-y-6">
            <ProgramSelector
                :selected-program="selectedProgram"
                @program-selected="handleProgramSelected"
            />

            <div class="space-y-6" v-if="selectedProgram === 'mivivienda'">
              <div v-if="stateContribution === 0 && selectedProperty.propertyPrice > 362100"
                   class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">El valor supera el límite para el Bono del Buen Pagador.</p>
                  </div>
                </div>
              </div>
              <div v-if="bbpIneligibilityMessage" class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      {{ bbpIneligibilityMessage }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="overflow-x-auto">
                <BonusTable
                    :bonus-data="bonusData"
                    :currency="creditCurrency"
                    :exchange-rate="exchangeRateNumeric"
                />
              </div>

              <StateContributionCard
                  title="Bono del Buen Pagador"
                  :description="`Valor inmueble: ${creditCurrency === 'USD' ? '$' : 'S/'} ${propertyPriceInCurrency.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`"
                  :amount="stateContribution"
                  :currency="creditCurrency"
                  :client-info="clientSummary"
                  :property-info="propertySummary"
                  program-type="mivivienda"
              />
            </div>

            <div v-else-if="selectedProgram === 'techo_propio'">
              <StateContributionCard
                  title="Bono Familiar Habitacional (BFH)"
                  :amount="stateContribution"
                  :client-info-techo-propio="clientSummary"
                  :currency="creditCurrency"
                  :currency-amount="exchangeRateNumeric"
                  program-type="techo_propio"
              />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <InitialPaymentSlider
                    v-model="initialPayment"
                    :min="minInitialPayment"
                    :max="propertyPriceInCurrency"
                    :step="creditCurrency === 'USD' ? 500 : 1000"
                    :currency="creditCurrency"
                    :show-min-notice="true"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">Gastos iniciales</label>
                <div class="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
                  <div v-for="(value, key) in initialCosts" :key="key"
                       class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <label :for="`cost-${key}`" class="text-sm text-gray-600 capitalize">{{
                        formatCostLabel(key)
                      }}</label>
                    <div class="relative w-full sm:w-32">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-gray-500 sm:text-sm">{{ creditCurrency === 'USD' ? '$' : 'S/' }}</span>
                      </div>
                      <input type="number" :id="`cost-${key}`" v-model.number="initialCosts[key]" min="0"
                             class="block w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-right text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"/>
                    </div>
                  </div>
                  <hr class="border-gray-200 my-2">
                  <div class="flex justify-between font-medium text-gray-900 pt-1">
                    <span>Total gastos</span>
                    <span class="text-indigo-600">{{
                        creditCurrency === 'USD' ? '$' : 'S/'
                      }} {{
                        totalInitialCosts.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      }}</span>
                  </div>
                </div>
              </div>
            </div>

            <FinancingSummaryCard
                :amount="financingAmount"
                :currency="creditCurrency"
                :formula="financingFormula"
            />

            <div>
              <NavigationButtons
                  @previous="goToStep1"
                  @next="handleNext"
                  class="w-full sm:w-auto"
              />
            </div>
          </div>

          <div v-else-if="currentStep === 3" class="space-y-6">
            <FinancialEntityGrid
                :entities="financialEntities"
                :selected-entity="selectedEntity"
                @entity-selected="handleEntitySelected"
            />
            <div>
              <NavigationButtons
                  @previous="goToStep2"
                  @next="goToStep4"
                  next-text="Continuar"
                  class="w-full sm:w-auto"
              />
            </div>
          </div>

          <div v-else-if="currentStep === 4" class="space-y-6">

            <div class="space-y-6 w-full max-w-full overflow-hidden">
              <CreditDataSection
                  :initial-term="creditTerm"
                  @update:term="handleTermUpdate"
              />

              <InterestRateSection
                  :selected-entity="selectedEntity"
                  :initial-rate="interestRate"
                  :initial-type="selectedRateType"
                  :initial-period="selectedPeriod"
                  :initial-cap="selectedCapitalization"
                  @update:interestRate="handleInterestRateUpdate"
                  @update:rateType="handleRateTypeUpdate"
                  @update:period="handlePeriodUpdate"
                  @update:capitalization="handleCapitalizationUpdate"
              />

              <OpportunityCostSection
                  :initial-rate="opportunityRate"
                  :initial-type="selectedOpportunityRateType"
                  :initial-period="selectedOpportunityPeriod"
                  :initial-cap="selectedOpportunityCapitalization"
                  :selected-entity="selectedEntity"
                  @update:opportunityRate="handleOpportunityRateUpdate"
                  @update:rateType="handleOpportunityRateTypeUpdate"
                  @update:period="handleOpportunityPeriodUpdate"
                  @update:capitalization="handleOpportunityCapitalizationUpdate"
              />

              <AdditionalConditionsSection
                  :selected-entity="selectedEntity"
                  :initial-grace-type="gracePeriod"
                  :initial-grace-duration="graceDuration"
                  @update:gracePeriod="handleGracePeriodUpdate"
                  @update:graceDuration="handleGraceDurationUpdate"
              />

              <MonthlyCostsSection
                  :initial-commissions="constantCommissions"
                  :initial-admin-costs="administrationCosts"
                  :currency="creditCurrency"
                  @update:constantCommissions="handleConstantCommissionsUpdate"
                  @update:administrationCosts="handleAdministrationCostsUpdate"
              />

              <StatementDeliverySection
                  :initial-delivery="deliveryMethod"
                  :currency="creditCurrency"
                  @update:deliveryMethod="handleDeliveryMethodUpdate"
              />

              <InsuranceSection
                  :selected-entity="selectedEntity"
                  @update:insurance="handleInsuranceUpdate"
              />

              <div>
                <NavigationButtons
                    @previous="goToStep3"
                    @next="handleCalculate"
                    next-text="Calcular"
                    class="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch, reactive, defineAsyncComponent} from 'vue'
import {useConfiguration} from '~/composables/useConfiguration.js'
import {useSimulations} from '~/composables/useSimulations.js'
import {useClients} from '~/composables/useClients.js'
import {useProperties} from '~/composables/useProperties.js'
import {useNotifications} from '~/composables/useNotifications'

// Components
const SimulationHistory = defineAsyncComponent(() => import('~/components/simulador/SimulationHistory.vue'))
import Stepper from '~/components/ui/Stepper.vue'
import ClientSelector from '~/components/forms/ClientSelector.vue'
import PropertyPreview from '~/components/ui/PropertyPreview.vue'
import ProgramSelector from '~/components/forms/ProgramSelector.vue'
import BonusTable from '~/components/tables/BonusTable.vue'
import StateContributionCard from '~/components/ui/StateContributionCard.vue'
import InitialPaymentSlider from '~/components/ui/InitialPaymentSlider.vue'
import FinancingSummaryCard from '~/components/ui/FinancingSummaryCard.vue'
import NavigationButtons from '~/components/navigation/NavigationButtons.vue'
import FinancialEntityGrid from '~/components/ui/FinancialEntityGrid.vue'
import CreditDataSection from '~/components/forms/CreditDataSection.vue'
import InterestRateSection from '~/components/forms/InterestRateSection.vue'
import OpportunityCostSection from '~/components/forms/OpportunityCostSection.vue'
import AdditionalConditionsSection from '~/components/forms/AdditionalConditionsSection.vue'
import MonthlyCostsSection from '~/components/forms/MonthlyCostsSection.vue'
import StatementDeliverySection from '~/components/forms/StatementDeliverySection.vue'
import InsuranceSection from '~/components/forms/InsuranceSection.vue'

definePageMeta({layout: 'default', middleware: 'auth'})

// Composables
const {listBonusParameters, listGlobalValues, listFinancialEntities, getCurrentExchangeRate} = useConfiguration()
const {createSimulation, getSimulationDraft} = useSimulations()
const {getClient} = useClients()
const {getProperty} = useProperties()
const {showSuccess, showError} = useNotifications()

// Global State
const activeTab = ref('new')
const currentStep = ref(1)
const currentExchangeRate = ref(null)

// Data State
const selectedClient = ref(null)
const selectedProperty = ref(null)
const selectedProgram = ref('mivivienda')
const selectedEntity = ref(null)
const bonusParameters = ref([])
const globalValues = ref([])
const financialEntities = ref([])

// Step 1: Currency & Property
const creditCurrency = ref('PEN')

// Step 2: Financials
const initialPayment = ref(0)
const initialCosts = reactive({
  notarial: 1200,
  registral: 650,
  tasacion: 350,
  estudioTitulos: 200,
  comisionActivacion: 0
})

// Step 4: Conditions
const creditTerm = ref(20)
const interestRate = ref(9.25)
const opportunityRate = ref(8.50)
const selectedRateType = ref('TE')
const selectedPeriod = ref('monthly')
const selectedCapitalization = ref('daily')
const selectedOpportunityRateType = ref('TE')
const selectedOpportunityPeriod = ref('monthly')
const selectedOpportunityCapitalization = ref('daily')
const gracePeriod = ref('none')
const graceDuration = ref(0)
const constantCommissions = ref(0)
const administrationCosts = ref(0)
const deliveryMethod = ref('electronic')
const insurance = ref({
  desgravamen: {enabled: true, rate: 0.03},
  propertyInsurance: {enabled: true, rate: 0.025, value: 0}
})

// --- Computed Logic ---

// 1. Tipo de cambio numérico seguro
const exchangeRateNumeric = computed(() => {
  if (creditCurrency.value === 'PEN') return 1;
  if (creditCurrency.value === 'USD' && currentExchangeRate.value?.sellPrice) {
    return parseFloat(currentExchangeRate.value.sellPrice);
  }
  return 1; // Fallback
})

// 2. Precio de la propiedad en la moneda seleccionada
const propertyPriceInCurrency = computed(() => {
  const originalPrice = selectedProperty.value?.propertyPrice || 0;
  // Asumimos que la propiedad en DB siempre está en Soles
  if (creditCurrency.value === 'PEN') return originalPrice;
  return originalPrice / exchangeRateNumeric.value;
})

// 3. Mínimo inicial (7.5% base)
const minInitialPayment = computed(() => {
  return Math.floor(propertyPriceInCurrency.value * 0.075);
})

// 4. Helper para formato de moneda (usado en rangos)
const formatMoney = (amount) => {
  const val = amount / exchangeRateNumeric.value;
  const sym = creditCurrency.value === 'USD' ? '$' : 'S/';
  return `${sym} ${val.toLocaleString('es-PE', {maximumFractionDigits: 0})}`;
}

// 5. Cálculo del Bono Data para la Tabla (Rangos convertidos)
const bonusData = computed(() => {
  const bbpParams = bonusParameters.value.filter(p => p.bonusType === 'BBP')
  const groups = bbpParams.reduce((acc, param) => {
    const key = param.maxPropertyValue || Infinity
    if (!acc[key]) {
      // Construimos el texto del rango usando la moneda actual
      let rangeText = '';
      if (param.minPropertyValue && param.maxPropertyValue) {
        rangeText = `Desde ${formatMoney(param.minPropertyValue)} hasta ${formatMoney(param.maxPropertyValue)}`;
      } else if (param.minPropertyValue) {
        rangeText = `Mayores a ${formatMoney(param.minPropertyValue)}`;
      } else {
        rangeText = `Hasta ${formatMoney(param.maxPropertyValue)}`;
      }

      acc[key] = {
        rangeName: '',
        valueRangeText: rangeText,
        min: param.minPropertyValue,
        max: param.maxPropertyValue,
        tradicional: null, sostenible: null, integrador: null, integradorSostenible: null,
      }
    }
    if (param.bonusSubtype === 'TRADITIONAL') acc[key].tradicional = param
    if (param.bonusSubtype === 'SUSTAINABLE') acc[key].sostenible = param
    if (param.bonusSubtype === 'INTEGRATOR') acc[key].integrador = param
    if (param.bonusSubtype === 'INTEGRATOR_SUSTAINABLE') acc[key].integradorSostenible = param
    return acc
  }, {})

  return Object.values(groups)
      .sort((a, b) => (a.max || Infinity) - (b.max || Infinity))
      .map((group, index) => ({...group, rangeName: `R${index + 1}`}))
})

// 6. Mensaje de inelegibilidad (para mostrar en UI)
const bbpIneligibilityMessage = computed(() => {
  if (selectedProgram.value !== 'mivivienda' || !selectedProperty.value) return null;

  const client = selectedClient.value;
  const propertyPriceInSoles = propertyPriceInCurrency.value * exchangeRateNumeric.value;

  if (client) {
    // NUEVA LÓGICA: Validaciones de cliente
    if (client.isOwnerOfAnotherProperty) return "El cliente figura como propietario de otra vivienda, por lo que no aplica al Bono del Buen Pagador.";
    if (client.receivedPreviousSupport) return "El cliente ya ha recibido apoyo habitacional del Estado previamente, por lo que no aplica al Bono del Buen Pagador.";
  }

  // Validación existente de precio máximo
  if (propertyPriceInSoles > 362100) return "El valor de la vivienda (convertido a Soles) supera el límite máximo para el Bono del Buen Pagador (aprox. S/ 362,100).";

  return null;
})

// 6. Cálculo del Aporte del Estado (Bono)
const stateContribution = computed(() => {
  // Para comparar con los rangos legales, necesitamos el precio en SOLES
  const propertyPriceInSoles = propertyPriceInCurrency.value * exchangeRateNumeric.value;
  let bonusInSoles = 0;


  if (selectedProgram.value === 'mivivienda') {
    if (propertyPriceInSoles > 362100) return 0;

    const isSustainable = selectedProperty.value?.isSustainable || false;
    const client = selectedClient.value;
    const isIntegratorEligible = client?.integratorBonusStatus === 'ELIGIBLE';
    let bonusType = 'TRADITIONAL';

    if (client && (client.isOwnerOfAnotherProperty || client.receivedPreviousSupport)) {
      return 0;
    }

    if (isIntegratorEligible && isSustainable) bonusType = 'INTEGRATOR_SUSTAINABLE';
    else if (isIntegratorEligible) bonusType = 'INTEGRATOR';
    else if (isSustainable) bonusType = 'SUSTAINABLE';

    const param = bonusParameters.value.find(p => {
      if (p.bonusType !== 'BBP' || p.bonusSubtype !== bonusType) return false;
      const min = p.minPropertyValue || 0;
      const max = p.maxPropertyValue || Infinity;
      return propertyPriceInSoles >= min && propertyPriceInSoles <= max;
    });
    bonusInSoles = param?.bonusAmount || 0;

  } else {
    // Techo Propio
    const client = selectedClient.value;

    // Verificamos si el cliente NO es elegible
    if (client && client.techoPropioStatus === 'NOT_ELIGIBLE') {
      bonusInSoles = 0;
    } else {
      // Si es ELIGIBLE (o estado desconocido), asignamos el valor del bono
      const bfh = globalValues.value.find(v => v.valueKey === 'BFH_AVN_AMOUNT');
      bonusInSoles = bfh?.numericValue || 46545;
    }
  }

  // Retornar convertido a la moneda elegida
  return bonusInSoles / exchangeRateNumeric.value;
})

const totalInitialCosts = computed(() => Object.values(initialCosts).reduce((a, b) => a + b, 0))

const financingAmount = computed(() => {
  return Math.max(0, propertyPriceInCurrency.value - stateContribution.value - initialPayment.value + totalInitialCosts.value)
})

const financingFormula = computed(() => {
  const sym = creditCurrency.value === 'USD' ? '$' : 'S/';
  const f = (n) => n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const prog = selectedProgram.value === 'mivivienda' ? 'BBP' : 'BFH';
  return `${sym} ${f(propertyPriceInCurrency.value)} (Precio) - ${sym} ${f(stateContribution.value)} (${prog}) - ${sym} ${f(initialPayment.value)} (Inicial) + ${sym} ${f(totalInitialCosts.value)} (Gastos)`;
})

const clientSummary = computed(() => selectedClient.value ? {
  name: `${selectedClient.value.holder.nombres} ${selectedClient.value.holder.apellidos}`,
  appliesForIntegratorBonus: selectedClient.value.appliesForIntegratorBonus,
  conadisCardNumber: selectedClient.value.conadisCardNumber,
  currentHousingSituation: selectedClient.value.isOwnerOfAnotherProperty,
  monthlyNetIncome: selectedClient.value.familyNetIncome,
  receivedPreviousSupport: selectedClient.value.receivedPreviousSupport
} : null)

const propertySummary = computed(() => {
  if (!selectedProperty.value) return null;
  // Buscar en qué rango cae el precio (en soles)
  const priceSoles = propertyPriceInCurrency.value * exchangeRateNumeric.value;
  const range = bonusData.value.find(r => priceSoles >= (r.min || 0) && priceSoles <= (r.max || Infinity));
  return {
    isSustainable: selectedProperty.value.isSustainable,
    range: range ? range.rangeName : 'Fuera de rango'
  }
})
const bonusExplanation = computed(() => `Bono calculado en base al valor en Soles y convertido a ${creditCurrency.value}.`)

// --- Actions ---

const handleCurrencyUpdate = async (currency) => {
  creditCurrency.value = currency;
  if (currency === 'USD') {
    try {
      const rate = await getCurrentExchangeRate();
      currentExchangeRate.value = rate;
    } catch (e) {
      console.error("Error fetching rate", e);
    }
  } else {
    currentExchangeRate.value = null;
  }
  // Ajustar costos iniciales a valores razonables por moneda
  if (currency === 'USD') {
    initialCosts.notarial = 350;
    initialCosts.registral = 180;
    initialCosts.tasacion = 100;
    initialCosts.estudioTitulos = 60;
  } else {
    initialCosts.notarial = 1200;
    initialCosts.registral = 650;
    initialCosts.tasacion = 350;
    initialCosts.estudioTitulos = 200;
  }
  if (selectedProperty.value) {
    const newPrice = selectedProperty.value.propertyPrice / (currency === 'USD' && currentExchangeRate.value ? currentExchangeRate.value.sellPrice : 1);
    // Resetear al 7.5% o 10%
    initialPayment.value = Math.floor(newPrice * 0.10);
  }
}

watch([selectedProperty, selectedProgram, creditCurrency], () => {
  if (selectedProperty.value) {
    if (initialPayment.value < minInitialPayment.value) {
      initialPayment.value = minInitialPayment.value;
    }
  }
})

const handleClientSelected = (c) => selectedClient.value = c
const handleEntitySelected = (e) => selectedEntity.value = e
const handleProgramSelected = (p) => selectedProgram.value = p
const goToPropertySelection = () => navigateTo('/simulador/seleccionar-inmueble')
const goToStep2 = () => currentStep.value = 2
const goToStep4 = () => currentStep.value = 4
const goToStep1 = () => currentStep.value = 1
const goToStep3 = () => currentStep.value = 3

const handleTermUpdate = (v) => creditTerm.value = v
const handleInterestRateUpdate = (v) => interestRate.value = v
const handleRateTypeUpdate = (v) => selectedRateType.value = v
const handlePeriodUpdate = (v) => selectedPeriod.value = v
const handleCapitalizationUpdate = (v) => selectedCapitalization.value = v
const handleOpportunityRateUpdate = (v) => opportunityRate.value = v
const handleOpportunityRateTypeUpdate = (v) => selectedOpportunityRateType.value = v
const handleOpportunityPeriodUpdate = (v) => selectedOpportunityPeriod.value = v
const handleOpportunityCapitalizationUpdate = (v) => selectedOpportunityCapitalization.value = v
const handleGracePeriodUpdate = (v) => gracePeriod.value = v
const handleGraceDurationUpdate = (v) => graceDuration.value = v
const handleConstantCommissionsUpdate = (v) => constantCommissions.value = v
const handleAdministrationCostsUpdate = (v) => administrationCosts.value = v
const handleDeliveryMethodUpdate = (v) => deliveryMethod.value = v
const handleInsuranceUpdate = (v) => insurance.value = v

const handleNext = () => {
  if (currentStep.value === 2) goToStep3();
  else if (currentStep.value === 3) goToStep4();
  else handleCalculate();
}

const handleCalculate = async () => {
  const data = {
    clientId: selectedClient.value?.id,
    propertyId: selectedProperty.value?.id,
    programType: selectedProgram.value,
    financialEntityId: selectedEntity.value?.id,
    calculatedValues: {
      propertyPrice: propertyPriceInCurrency.value,
      stateContribution: stateContribution.value,
      initialPayment: initialPayment.value,
      initialCosts: totalInitialCosts.value,
      financingAmount: financingAmount.value
    },
    financingDetails: {
      currency: creditCurrency.value,
      usdValue: creditCurrency.value === 'USD' && currentExchangeRate.value ? currentExchangeRate.value.sellPrice : null,
      termYears: creditTerm.value,
      interestRate: {
        rate: interestRate.value,
        type: selectedRateType.value,
        period: selectedPeriod.value,
        capitalization: selectedRateType.value === 'TN' ? selectedCapitalization.value : undefined
      },
      opportunityCost: {
        rate: opportunityRate.value,
        type: selectedOpportunityRateType.value,
        period: selectedOpportunityPeriod.value,
        capitalization: selectedOpportunityRateType.value === 'TN' ? selectedOpportunityCapitalization.value : undefined
      },
      gracePeriod: {type: gracePeriod.value, durationMonths: graceDuration.value},
      monthlyCosts: {constantCommissions: constantCommissions.value, administrationCosts: administrationCosts.value},
      statementDelivery: deliveryMethod.value,
      insurance: {
        desgravamen: {enabled: insurance.value.desgravamen.enabled, rate: insurance.value.desgravamen.rate},
        propertyInsurance: {
          enabled: insurance.value.propertyInsurance.enabled,
          rate: insurance.value.propertyInsurance.rate,
          value: propertyPriceInCurrency.value
        }
      }
    }
  }
  try {
    const res = await createSimulation(data);
    showSuccess('Simulación generada correctamente')
    navigateTo(`/simulador/resultados/${res.simulationId}`);
  } catch (e) {
    console.error(e);
    showError('Error al generar la simulación. Verifique los datos ingresados.')
  }
}

const formatCostLabel = (key) => {
  const labels = {
    notarial: 'Notariales',
    registral: 'Registrales',
    tasacion: 'Tasación',
    estudioTitulos: 'Estudio de Títulos',
    comisionActivacion: 'Comisión Activación'
  };
  return labels[key] || key;
}

const restoreDraft = async () => {
  const draft = getSimulationDraft() // Obtiene los datos del estado global
  if (!draft) return

  try {
    // 1. Restaurar Cliente
    if (draft.clientInfo?.id) {
      selectedClient.value = await getClient(draft.clientInfo.id)
    }

    // 2. Restaurar Propiedad
    if (draft.propertyInfo?.id) {
      const prop = await getProperty(draft.propertyInfo.id)
      selectedProperty.value = prop
      localStorage.setItem('selectedProperty', JSON.stringify(prop))
    }

    // 3. Restaurar Entidad (si existe)
    // Nota: Si tu API no devuelve el ID de la entidad en el resumen, esto no seleccionará la tarjeta visualmente,
    // pero los valores de tasas se cargarán en el paso 4 de todos modos.
    if (draft.inputs?.financialEntityId) {
      selectedEntity.value = financialEntities.value.find(e => e.id === draft.inputs.financialEntityId)
    }

    // 4. Restaurar Inputs Financieros (Paso 4)
    if (draft.inputs) {
      const i = draft.inputs

      // Moneda
      creditCurrency.value = i.currency || 'PEN'
      if (creditCurrency.value === 'USD') {
        await handleCurrencyUpdate('USD') // Carga el tipo de cambio si es necesario
      }

      // Plazo
      creditTerm.value = i.termYears || 20

      // Tasas
      interestRate.value = i.interestRate
      selectedRateType.value = i.interestRateType
      selectedPeriod.value = i.interestRatePeriod
      selectedCapitalization.value = i.interestRateCapitalization

      // Costo de Oportunidad (COK)
      opportunityRate.value = i.opportunityCostRate
      selectedOpportunityRateType.value = i.opportunityCostType
      selectedOpportunityPeriod.value = i.opportunityCostPeriod
      selectedOpportunityCapitalization.value = i.opportunityCostCapitalization

      // Periodo de Gracia
      gracePeriod.value = i.gracePeriodType
      graceDuration.value = i.gracePeriodDurationMonths

      // Costos Fijos
      constantCommissions.value = i.monthlyCommissions
      administrationCosts.value = i.administrationCosts
      deliveryMethod.value = i.statementDelivery

      // Seguros
      insurance.value = {
        desgravamen: {enabled: i.desgravamenEnabled, rate: i.desgravamenRate},
        propertyInsurance: {enabled: i.propertyInsuranceEnabled, rate: i.propertyInsuranceRate}
      }
    }

    // 5. Restaurar Pago Inicial (Paso 2)
    if (draft.summary) {
      initialPayment.value = draft.summary.initialPayment
    }

    // 6. Ir directamente al paso 4 (Condiciones)
    currentStep.value = 4

  } catch (e) {
    console.error("Error restaurando borrador de simulación:", e)
  }
}

onMounted(async () => {
  // Carga de datos maestros (Bonos, Valores Globales, Entidades)
  const [bonus, global, entities] = await Promise.all([
    listBonusParameters(),
    listGlobalValues(),
    listFinancialEntities()
  ])

  bonusParameters.value = bonus || []
  globalValues.value = global || []
  financialEntities.value = entities || []

  // Recuperar propiedad del localStorage si existe
  const storedProp = localStorage.getItem('selectedProperty')
  if (storedProp) selectedProperty.value = JSON.parse(storedProp)

  await restoreDraft()
})
</script>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>