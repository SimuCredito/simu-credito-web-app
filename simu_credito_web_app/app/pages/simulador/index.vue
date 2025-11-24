<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-8">
        <Stepper :current-step="currentStep" />

        <div v-if="currentStep === 1" class="space-y-6">
          <ClientSelector @client-selected="handleClientSelected" />

          <PropertyPreview
              :property="selectedProperty"
              @change-property="goToPropertySelection"
          />

          <div class="flex justify-end">
            <button
                @click="goToStep2"
                :disabled="!selectedClient || !selectedProperty"
                class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Siguiente
              <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 4" class="space-y-6">
          <CreditDataSection
              :initial-currency="creditCurrency"
              :initial-term="creditTerm"
              @update:currency="handleCurrencyUpdate"
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
              @update:constantCommissions="handleConstantCommissionsUpdate"
              @update:administrationCosts="handleAdministrationCostsUpdate"
          />

          <StatementDeliverySection
              :initial-delivery="deliveryMethod"
              @update:deliveryMethod="handleDeliveryMethodUpdate"
          />

          <InsuranceSection
              :selected-entity="selectedEntity"
              @update:insurance="handleInsuranceUpdate"
          />

          <NavigationButtons
              @previous="goToStep3"
              @next="handleCalculate"
              next-text="Calcular"
          />
        </div>

        <div v-else-if="currentStep === 3" class="space-y-6">
          <FinancialEntityGrid
              :entities="financialEntities"
              :selected-entity="selectedEntity"
              @entity-selected="handleEntitySelected"
          />

          <NavigationButtons
              @previous="goToStep2"
              @next="goToStep4"
              next-text="Continuar"
          />
        </div>

        <div v-else-if="currentStep === 2" class="space-y-6">
          <ProgramSelector
              :selected-program="selectedProgram"
              @program-selected="handleProgramSelected"
          />

          <div class="space-y-6" v-if="selectedProgram === 'mivivienda'">
            <BonusTable :bonus-data="bonusData" />

            <StateContributionCard
                title="Bono del Buen Pagador"
                :description="`Valor del inmueble: S/ ${selectedProperty?.propertyPrice?.toLocaleString() || 0}`"
                :amount="stateContribution"
                :client-info="clientSummary"
                :property-info="propertySummary"
            />

            <div v-if="bonusExplanation" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">{{ bonusExplanation }}</p>
            </div>

          </div>

          <div v-else-if="selectedProgram === 'techo_propio'">
            <StateContributionCard
                title="Bono Familiar Habitacional (BFH) - Adq. Vivienda Nueva"
                :amount="stateContribution"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div>
              <InitialPaymentSlider
                  v-model="initialPayment"
                  :max="selectedProperty?.propertyPrice || 0"
                  :min="selectedProgram === 'mivivienda' ? Math.floor((selectedProperty?.propertyPrice || 0) * 0.075) : Math.floor((selectedProperty?.propertyPrice || 0) * 0.075)"
                  :show-min-notice="true"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Gastos iniciales</label>
              <div class="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">

                <div class="flex justify-between items-center">
                  <label for="cost-notarial" class="text-sm text-gray-600">Costos notariales</label>
                  <div class="relative w-32">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">S/</span>
                    </div>
                    <input type="number" id="cost-notarial" v-model.number="initialCosts.notarial" min="0" step="10" class="block w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-right" />
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <label for="cost-registral" class="text-sm text-gray-600">Registrales</label>
                  <div class="relative w-32">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">S/</span>
                    </div>
                    <input type="number" id="cost-registral" v-model.number="initialCosts.registral" min="0" step="10" class="block w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-right" />
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <label for="cost-tasacion" class="text-sm text-gray-600">Tasación</label>
                  <div class="relative w-32">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">S/</span>
                    </div>
                    <input type="number" id="cost-tasacion" v-model.number="initialCosts.tasacion" min="0" step="10" class="block w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-right" />
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <label for="cost-estudio" class="text-sm text-gray-600">Estudio de títulos</label>
                  <div class="relative w-32">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">S/</span>
                    </div>
                    <input type="number" id="cost-estudio" v-model.number="initialCosts.estudioTitulos" min="0" step="10" class="block w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-right" />
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <label for="cost-activacion" class="text-sm text-gray-600">Comisión de activación</label>
                  <div class="relative w-32">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">S/</span>
                    </div>
                    <input type="number" id="cost-activacion" v-model.number="initialCosts.comisionActivacion" min="0" step="10" class="block w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-right" />
                  </div>
                </div>

                <hr class="border-gray-200 my-2">

                <div class="flex justify-between font-medium text-gray-900 pt-1">
                  <span>Total gastos</span>
                  <span class="text-indigo-600">S/ {{ totalInitialCosts.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
              </div>
            </div>
          </div>

          <FinancingSummaryCard
              :amount="financingAmount"
              :formula="financingFormula"
          />

          <NavigationButtons
              @previous="goToStep1"
              @next="handleNext"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration.js'
import { useSimulations } from '~/composables/useSimulations.js'
import { useClients } from '~/composables/useClients.js'
import { useProperties } from '~/composables/useProperties.js'

// Define your page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Components
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

const { listBonusParameters, listGlobalValues, listFinancialEntities } = useConfiguration()
const { createSimulation, getSimulationDraft } = useSimulations()
const { getClient } = useClients()
const { getProperty } = useProperties()

// State
const currentStep = ref(1)
const selectedClient = ref(null)
const selectedProperty = ref(null)
const selectedProgram = ref('mivivienda')
const selectedEntity = ref(null)
const initialPayment = ref(25000)
const bonusParameters = ref([])
const globalValues = ref([])
const financialEntities = ref([])

// Initial Costs State (Editable)
const initialCosts = reactive({
  notarial: 1200,
  registral: 650,
  tasacion: 350,
  estudioTitulos: 200,
  comisionActivacion: 0
})

// Step 4 state
const creditCurrency = ref('PEN')
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
  desgravamen: { enabled: true, rate: 0.03 },
  propertyInsurance: { enabled: true, rate: 0.025, value: 0 }
})

// Computed
const bonusData = computed(() => {
  const bbpParams = bonusParameters.value.filter(p => p.bonusType === 'BBP')

  // Group by price range (maxPropertyValue)
  const groups = bbpParams.reduce((acc, param) => {
    const key = param.maxPropertyValue || 0
    if (!acc[key]) {
      acc[key] = {
        rangeName: '', // Will be assigned R1-R4
        valueRangeText: param.minPropertyValue && param.maxPropertyValue
            ? `Desde ${param.minPropertyValue.toLocaleString()} hasta ${param.maxPropertyValue.toLocaleString()}`
            : param.minPropertyValue
                ? `Mayores a ${param.minPropertyValue.toLocaleString()}`
                : `Hasta ${param.maxPropertyValue?.toLocaleString() || '∞'}`,
        min: param.minPropertyValue,
        max: param.maxPropertyValue,
        tradicional: null,
        sostenible: null,
        integrador: null,
        integradorSostenible: null,
      }
    }

    // Assign parameters to subtypes
    if (param.bonusSubtype === 'TRADITIONAL') acc[key].tradicional = param
    if (param.bonusSubtype === 'SUSTAINABLE') acc[key].sostenible = param
    if (param.bonusSubtype === 'INTEGRATOR') acc[key].integrador = param
    if (param.bonusSubtype === 'INTEGRATOR_SUSTAINABLE') acc[key].integradorSostenible = param

    return acc
  }, {})

  // Convert to array, sort by max value, and assign R1-R4 names
  return Object.values(groups)
      .sort((a, b) => a.max - b.max)
      .map((group, index) => ({
        ...group,
        rangeName: `R${index + 1}`
      }))
})

const stateContribution = computed(() => {
  if (selectedProgram.value === 'mivivienda') {
    // Calculate BBP based on property value, sustainability, and client eligibility
    const propertyPrice = selectedProperty.value?.propertyPrice || 0
    const isSustainable = selectedProperty.value?.isSustainable || false
    const client = selectedClient.value

    // Check if property price is above 362,100 - no BBP applies
    if (propertyPrice > 362100) {
      return 0 // No BBP for properties above S/ 362,100
    }

    // Check client eligibility for integrator bonus
    const isIntegratorEligible = client?.integratorBonusStatus === 'ELIGIBLE'

    // Determine bonus type priority:
    let bonusType = 'TRADITIONAL'
    if (isIntegratorEligible && isSustainable) {
      // For integrator sustainable, it only applies to R1 range properties
      const r1Range = bonusParameters.value.find(p =>
          p.bonusType === 'BBP' &&
          p.bonusSubtype === 'INTEGRATOR_SUSTAINABLE' &&
          p.minPropertyValue <= propertyPrice &&
          p.maxPropertyValue >= propertyPrice
      )
      if (r1Range) {
        bonusType = 'INTEGRATOR_SUSTAINABLE'
      } else {
        bonusType = 'INTEGRATOR'
      }
    } else if (isIntegratorEligible) {
      bonusType = 'INTEGRATOR'
    } else if (isSustainable) {
      bonusType = 'SUSTAINABLE'
    }

    const applicableBonus = bonusParameters.value.find(param => {
      if (param.bonusType !== 'BBP') return false
      if (param.bonusSubtype !== bonusType) return false
      if (param.minPropertyValue && propertyPrice < param.minPropertyValue) return false
      if (param.maxPropertyValue && propertyPrice > param.maxPropertyValue) return false
      return true
    })

    return applicableBonus?.bonusAmount || 0
  } else {
    // Techo Propio BFH
    const bfhValue = globalValues.value.find(v => v.valueKey === 'BFH_AVN_AMOUNT')
    return bfhValue?.numericValue || 46545
  }
})

const totalInitialCosts = computed(() => {
  return (initialCosts.notarial || 0) +
      (initialCosts.registral || 0) +
      (initialCosts.tasacion || 0) +
      (initialCosts.estudioTitulos || 0) +
      (initialCosts.comisionActivacion || 0)
})

const financingAmount = computed(() => {
  const propertyPrice = selectedProperty.value?.propertyPrice || 0
  return Math.max(0, propertyPrice - stateContribution.value - initialPayment.value + totalInitialCosts.value)
})

const bonusExplanation = computed(() => {
  if (selectedProgram.value !== 'mivivienda' || !selectedProperty.value || !selectedClient.value) {
    return ''
  }

  const propertyPrice = selectedProperty.value.propertyPrice
  const isSustainable = selectedProperty.value.isSustainable
  const isIntegratorEligible = selectedClient.value.integratorBonusStatus === 'ELIGIBLE'

  if (propertyPrice > 362100) {
    return 'Tras evaluar el valor de la vivienda, se ha determinado que para propiedades con valor superior a S/ 362,100 no aplica el Bono del Buen Pagador.'
  }

  let bonusType = 'TRADITIONAL'
  if (isIntegratorEligible && isSustainable) {
    const r1Range = bonusParameters.value.find(p =>
        p.bonusType === 'BBP' &&
        p.bonusSubtype === 'INTEGRATOR_SUSTAINABLE' &&
        p.minPropertyValue <= propertyPrice &&
        p.maxPropertyValue >= propertyPrice
    )
    if (r1Range) {
      bonusType = 'INTEGRATOR_SUSTAINABLE'
    } else {
      bonusType = 'INTEGRATOR'
    }
  } else if (isIntegratorEligible) {
    bonusType = 'INTEGRATOR'
  } else if (isSustainable) {
    bonusType = 'SUSTAINABLE'
  }

  const applicableBonus = bonusParameters.value.find(param => {
    if (param.bonusType !== 'BBP') return false
    if (param.bonusSubtype !== bonusType) return false
    if (param.minPropertyValue && propertyPrice < param.minPropertyValue) return false
    if (param.maxPropertyValue && propertyPrice > param.maxPropertyValue) return false
    return true
  })

  let bonusTypeText = ''
  let rangeText = ''

  if (applicableBonus) {
    const ranges = bonusData.value
    const range = ranges.find(r => r.min <= propertyPrice && r.max >= propertyPrice)
    if (range) {
      rangeText = range.rangeName
    }

    if (bonusType === 'INTEGRATOR_SUSTAINABLE') {
      bonusTypeText = 'BBP Integrador Sostenible'
    } else if (bonusType === 'INTEGRATOR') {
      bonusTypeText = 'BBP Integrador'
    } else if (bonusType === 'SUSTAINABLE') {
      bonusTypeText = 'BBP Sostenible'
    } else {
      bonusTypeText = 'BBP Tradicional'
    }
  }

  return `Tras evaluar el valor de la vivienda, sus características de sostenibilidad y la condición particular del cliente (incluyendo su aplicabilidad al programa de Integración), se ha determinado que es elegible para el ${bonusTypeText} correspondiente a una vivienda del Rango ${rangeText}`
})

const clientSummary = computed(() => {
  if (!selectedClient.value) return null
  return {
    name: `${selectedClient.value.holder.nombres} ${selectedClient.value.holder.apellidos}`,
    appliesForIntegratorBonus: selectedClient.value.appliesForIntegratorBonus,
    conadisCardNumber: selectedClient.value.conadisCardNumber
  }
})

const propertySummary = computed(() => {
  if (!selectedProperty.value) return null
  const ranges = bonusData.value
  const range = ranges.find(r => r.min <= selectedProperty.value.propertyPrice && r.max >= selectedProperty.value.propertyPrice)

  return {
    isSustainable: selectedProperty.value.isSustainable,
    range: range?.rangeName || 'N/A'
  }
})

const financingFormula = computed(() => {
  const propertyPrice = selectedProperty.value?.propertyPrice || 0
  const contribution = stateContribution.value
  const costs = totalInitialCosts.value
  if (selectedProgram.value === 'mivivienda') {
    return `S/ ${propertyPrice.toLocaleString()} (Precio del inmueble) - S/ ${contribution.toLocaleString()} (BBP) - S/ ${initialPayment.value.toLocaleString()} (Cuota inicial) + S/ ${costs.toLocaleString()} (Gastos iniciales)`
  } else {
    return `S/ ${propertyPrice.toLocaleString()} (Precio del inmueble) - S/ ${contribution.toLocaleString()} (BFH) - S/ ${initialPayment.value.toLocaleString()} (Cuota Inicial) + S/ ${costs.toLocaleString()} (Gastos iniciales)`
  }
})

// Handlers
const handleClientSelected = (client) => {
  selectedClient.value = client
}

const goToPropertySelection = () => {
  navigateTo('/simulador/seleccionar-inmueble')
}

const goToStep1 = () => {
  currentStep.value = 1
}

const goToStep2 = () => {
  currentStep.value = 2
}

const goToStep3 = () => {
  currentStep.value = 3
}

const handleProgramSelected = (program) => {
  selectedProgram.value = program
  if (program === 'techo_propio') {
    const minPayment = Math.floor((selectedProperty.value?.propertyPrice || 0) * 0.075)
    initialPayment.value = Math.max(initialPayment.value, minPayment)
  }
}

const handleEntitySelected = (entity) => {
  console.log('Entity selected in simulator:', entity)
  selectedEntity.value = entity
}

const goToStep4 = () => {
  currentStep.value = 4
}

// Step 4 handlers
const handleCurrencyUpdate = (currency) => {
  creditCurrency.value = currency
}

const handleTermUpdate = (term) => {
  creditTerm.value = term
}

const handleInterestRateUpdate = (rate) => {
  interestRate.value = rate
}

const handleRateTypeUpdate = (type) => {
  selectedRateType.value = type
}

const handlePeriodUpdate = (period) => {
  selectedPeriod.value = period
}

const handleCapitalizationUpdate = (capitalization) => {
  selectedCapitalization.value = capitalization
}

const handleOpportunityRateUpdate = (rate) => {
  opportunityRate.value = rate
}

const handleOpportunityRateTypeUpdate = (type) => {
  selectedOpportunityRateType.value = type
}

const handleOpportunityPeriodUpdate = (period) => {
  selectedOpportunityPeriod.value = period
}

const handleOpportunityCapitalizationUpdate = (capitalization) => {
  selectedOpportunityCapitalization.value = capitalization
}

const handleGracePeriodUpdate = (period) => {
  gracePeriod.value = period
}

const handleGraceDurationUpdate = (duration) => {
  graceDuration.value = duration
}

const handleConstantCommissionsUpdate = (amount) => {
  constantCommissions.value = amount
}

const handleAdministrationCostsUpdate = (amount) => {
  administrationCosts.value = amount
}

const handleDeliveryMethodUpdate = (method) => {
  deliveryMethod.value = method
}

const handleInsuranceUpdate = (insuranceData) => {
  insurance.value = insuranceData
}

const handleCalculate = async () => {
  try {
    const simulationData = {
      clientId: selectedClient.value?.id,
      propertyId: selectedProperty.value?.id,
      programType: selectedProgram.value,
      financialEntityId: selectedEntity.value?.id,
      calculatedValues: {
        propertyPrice: selectedProperty.value?.propertyPrice,
        stateContribution: stateContribution.value,
        initialPayment: initialPayment.value,
        initialCosts: totalInitialCosts.value, // Use dynamic total
        financingAmount: financingAmount.value
      },
      financingDetails: {
        currency: creditCurrency.value,
        usdValue: null,
        termYears: creditTerm.value,
        interestRate: {
          rate: interestRate.value || 9.5,
          type: selectedRateType.value,
          period: selectedPeriod.value,
          capitalization: selectedRateType.value === 'TN' ? selectedCapitalization.value : undefined
        },
        opportunityCost: {
          rate: opportunityRate.value || 7.0,
          type: selectedOpportunityRateType.value,
          period: selectedOpportunityPeriod.value,
          capitalization: selectedOpportunityRateType.value === 'TN' ? selectedOpportunityCapitalization.value : undefined
        },
        gracePeriod: {
          type: gracePeriod.value,
          durationMonths: graceDuration.value
        },
        monthlyCosts: {
          constantCommissions: constantCommissions.value || 0.00,
          administrationCosts: administrationCosts.value || 0.00
        },
        statementDelivery: deliveryMethod.value,
        insurance: {
          desgravamen: {
            enabled: insurance.value?.desgravamen?.enabled ?? true,
            rate: insurance.value?.desgravamen?.rate ?? 0.0003
          },
          propertyInsurance: {
            enabled: insurance.value?.propertyInsurance?.enabled ?? true,
            rate: insurance.value?.propertyInsurance?.rate ?? 0.00025,
            value: selectedProperty.value?.propertyPrice || 0
          }
        }
      }
    }

    console.log('Simulation Data Structure:', JSON.stringify(simulationData, null, 2))

    const result = await createSimulation(simulationData)

    navigateTo(`/simulador/resultados/${result.simulationId}`)
  } catch (error) {
    console.error('Error creating simulation:', error)
  }
}

const handleNext = () => {
  if (currentStep.value === 2) {
    goToStep3()
  } else if (currentStep.value === 3) {
    goToStep4()
  } else {
    handleCalculate()
  }
}

// Función corregida para cargar los datos del borrador
const loadDraftData = async () => {
  const draft = getSimulationDraft()
  if (!draft) return

  try {
    // 1. Restaurar Cliente y Propiedad
    if (draft.clientInfo?.id) {
      selectedClient.value = await getClient(draft.clientInfo.id)
    }
    if (draft.propertyInfo?.id) {
      const prop = await getProperty(draft.propertyInfo.id)
      selectedProperty.value = prop
      localStorage.setItem('selectedProperty', JSON.stringify(prop))
    }

    // 2. Restaurar Valores Calculados del Resumen
    if (draft.summary) {
      initialPayment.value = draft.summary.initialPayment
    }

    // 3. Restaurar INPUTS (Desde el nuevo campo del DTO)
    if (draft.inputs) {
      const i = draft.inputs;

      // Restaurar Entidad Financiera
      if (i.financialEntityId) {
        // Busca la entidad en la lista cargada
        selectedEntity.value = financialEntities.value.find(e => e.id === i.financialEntityId)
      }

      creditCurrency.value = i.currency || 'PEN'
      creditTerm.value = i.termYears || 20

      interestRate.value = i.interestRate || 9.25
      selectedRateType.value = i.interestRateType || 'TE'
      selectedPeriod.value = i.interestRatePeriod || 'monthly'
      selectedCapitalization.value = i.interestRateCapitalization || 'daily'

      opportunityRate.value = i.opportunityCostRate || 8.5
      selectedOpportunityRateType.value = i.opportunityCostType || 'TE'
      selectedOpportunityPeriod.value = i.opportunityCostPeriod || 'monthly'
      selectedOpportunityCapitalization.value = i.opportunityCostCapitalization || 'daily'

      gracePeriod.value = i.gracePeriodType || 'none'
      graceDuration.value = i.gracePeriodDurationMonths || 0

      constantCommissions.value = i.monthlyCommissions || 0
      administrationCosts.value = i.administrationCosts || 0
      deliveryMethod.value = i.statementDelivery || 'electronic'

      // Asumiendo que los componentes de seguro esperan un objeto con enabled/rate
      insurance.value = {
        desgravamen: { enabled: i.desgravamenEnabled, rate: i.desgravamenRate },
        propertyInsurance: { enabled: i.propertyInsuranceEnabled, rate: i.propertyInsuranceRate }
      }
    }

    // 4. IMPORTANTE: Ir directo al paso 4 para editar condiciones
    currentStep.value = 4

  } catch (e) {
    console.error("Error restaurando borrador", e)
  }
}

onMounted(async () => {
  try {
    // Cargar catálogos primero
    const [bonus, global, entities] = await Promise.all([
      listBonusParameters(),
      listGlobalValues(),
      listFinancialEntities()
    ])
    bonusParameters.value = bonus || []
    globalValues.value = global || []
    financialEntities.value = entities || []

    const storedProperty = localStorage.getItem('selectedProperty')
    if (storedProperty) {
      selectedProperty.value = JSON.parse(storedProperty)
    }

    // NUEVO: Intentar cargar borrador de edición
    // Esto rellenará los datos y saltará al paso 4 si corresponde
    await loadDraftData()

  } catch (error) {
    console.error('Error loading data:', error)
  }
})

watch(selectedProgram, (newProgram) => {
  if (newProgram === 'techo_propio' && selectedProperty.value) {
    const minPayment = Math.floor(selectedProperty.value.propertyPrice * 0.075)
    if (initialPayment.value < minPayment) {
      initialPayment.value = minPayment
    }
  }
})
</script>