<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- White Card -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <!-- Stepper -->
        <Stepper :current-step="currentStep" />

        <!-- Step 1: Selection -->
        <div v-if="currentStep === 1" class="space-y-6">
          <!-- Client Selector -->
          <ClientSelector @client-selected="handleClientSelected" />

          <!-- Property Preview -->
          <PropertyPreview
            :property="selectedProperty"
            @change-property="goToPropertySelection"
          />

          <!-- Next Button -->
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

        <!-- Step 4: Conditions -->
        <div v-else-if="currentStep === 4" class="space-y-6">
          <!-- Credit Data Section -->
          <CreditDataSection
            @update:currency="handleCurrencyUpdate"
            @update:term="handleTermUpdate"
          />

          <!-- Interest Rate Section -->
          <InterestRateSection
            :selected-entity="selectedEntity"
            @update:interestRate="handleInterestRateUpdate"
            @update:rateType="handleRateTypeUpdate"
            @update:period="handlePeriodUpdate"
            @update:capitalization="handleCapitalizationUpdate"
          />

          <!-- Opportunity Cost Section -->
          <OpportunityCostSection
            @update:opportunityRate="handleOpportunityRateUpdate"
            @update:rateType="handleOpportunityRateTypeUpdate"
            @update:period="handleOpportunityPeriodUpdate"
            @update:capitalization="handleOpportunityCapitalizationUpdate"
          />

          <!-- Additional Conditions Section -->
          <AdditionalConditionsSection
            :selected-entity="selectedEntity"
            @update:gracePeriod="handleGracePeriodUpdate"
            @update:graceDuration="handleGraceDurationUpdate"
          />

          <!-- Monthly Costs Section -->
          <MonthlyCostsSection
            @update:constantCommissions="handleConstantCommissionsUpdate"
            @update:administrationCosts="handleAdministrationCostsUpdate"
          />

          <!-- Statement Delivery Section -->
          <StatementDeliverySection
            @update:deliveryMethod="handleDeliveryMethodUpdate"
          />

          <!-- Insurance Section -->
          <InsuranceSection
            :selected-entity="selectedEntity"
            @update:insurance="handleInsuranceUpdate"
          />

          <!-- Navigation Buttons -->
          <NavigationButtons
            @previous="goToStep3"
            @next="handleCalculate"
            next-text="Calcular"
          />
        </div>

        <!-- Step 3: Bank Selection -->
        <div v-else-if="currentStep === 3" class="space-y-6">
          <!-- Financial Entity Grid -->
          <FinancialEntityGrid
            :entities="financialEntities"
            :selected-entity="selectedEntity"
            @entity-selected="handleEntitySelected"
          />

          <!-- Navigation Buttons -->
          <NavigationButtons
            @previous="goToStep2"
            @next="goToStep4"
            next-text="Continuar"
          />
        </div>

        <!-- Step 2: Financing -->
        <div v-else-if="currentStep === 2" class="space-y-6">
          <!-- Program Selector -->
          <ProgramSelector
            :selected-program="selectedProgram"
            @program-selected="handleProgramSelected"
          />

          <!-- MiVivienda Content -->
          <div class="space-y-6" v-if="selectedProgram === 'mivivienda'">
            <!-- Bonus Table -->
            <BonusTable :bonus-data="bonusData" />

            <!-- State Contribution -->
            <StateContributionCard
              title="Bono del Buen Pagador"
              :description="`Valor del inmueble: S/ ${selectedProperty?.propertyPrice?.toLocaleString() || 0}`"
              :amount="stateContribution"
              :client-info="clientSummary"
              :property-info="propertySummary"
            />

            <!-- Bonus Explanation -->
            <div v-if="bonusExplanation" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">{{ bonusExplanation }}</p>
            </div>

          </div>

          <!-- Techo Propio Content -->
          <div v-else-if="selectedProgram === 'techo_propio'">
            <!-- State Contribution -->
            <StateContributionCard
              title="Bono Familiar Habitacional (BFH) - Adq. Vivienda Nueva"
              :amount="stateContribution"
            />
          </div>

          <!-- Initial Payment Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Slider -->
            <div>
              <InitialPaymentSlider
                v-model="initialPayment"
                :max="selectedProperty?.propertyPrice || 0"
                :min="selectedProgram === 'mivivienda' ? Math.floor((selectedProperty?.propertyPrice || 0) * 0.075) : Math.floor((selectedProperty?.propertyPrice || 0) * 0.075)"
                :show-min-notice="true"
              />
            </div>

            <!-- Costs -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Gastos Iniciales</label>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Costos notariales</span>
                  <span>S/ 1,200.00</span>
                </div>
                <div class="flex justify-between">
                  <span>Registrales</span>
                  <span>S/ 650.00</span>
                </div>
                <div class="flex justify-between">
                  <span>Tasación</span>
                  <span>S/ 350.00</span>
                </div>
                <div class="flex justify-between">
                  <span>Estudio de títulos</span>
                  <span>S/ 200.00</span>
                </div>
                <div class="flex justify-between">
                  <span>Comisión de activación</span>
                  <span>S/ 0.00</span>
                </div>
                <hr class="my-2">
                <div class="flex justify-between font-medium text-gray-900">
                  <span>Total gastos</span>
                  <span>S/ 2,400.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Financing Summary -->
          <FinancingSummaryCard
            :amount="financingAmount"
            :formula="financingFormula"
          />

          <!-- Navigation Buttons -->
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
import { ref, onMounted, computed, watch } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration.js'
import { useSimulations } from '~/composables/useSimulations.js'

// Define your page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Components
import Stepper from '~/components/Stepper.vue'
import ClientSelector from '~/components/ClientSelector.vue'
import PropertyPreview from '~/components/PropertyPreview.vue'
import ProgramSelector from '~/components/ProgramSelector.vue'
import BonusTable from '~/components/BonusTable.vue'
import StateContributionCard from '~/components/StateContributionCard.vue'
import InitialPaymentSlider from '~/components/InitialPaymentSlider.vue'
import FinancingSummaryCard from '~/components/FinancingSummaryCard.vue'
import NavigationButtons from '~/components/NavigationButtons.vue'
import FinancialEntityGrid from '~/components/FinancialEntityGrid.vue'
import CreditDataSection from '~/components/CreditDataSection.vue'
import InterestRateSection from '~/components/InterestRateSection.vue'
import OpportunityCostSection from '~/components/OpportunityCostSection.vue'
import AdditionalConditionsSection from '~/components/AdditionalConditionsSection.vue'
import MonthlyCostsSection from '~/components/MonthlyCostsSection.vue'
import StatementDeliverySection from '~/components/StatementDeliverySection.vue'
import InsuranceSection from '~/components/InsuranceSection.vue'

const { listBonusParameters, listGlobalValues, listFinancialEntities } = useConfiguration()

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
  desgravamen: { enabled: true, rate: 9.25 },
  propertyInsurance: { enabled: true, rate: 9.25, value: 0 }
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
    // 1. Integrator Sustainable (if eligible and sustainable and property is in R1 range)
    // 2. Integrator (if eligible)
    // 3. Sustainable (if sustainable)
    // 4. Traditional (default)

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

    return applicableBonus?.bonusAmount || 0 // No default BBP for high-value properties
  } else {
    // Techo Propio BFH
    const bfhValue = globalValues.value.find(v => v.valueKey === 'BFH_AVN_AMOUNT')
    return bfhValue?.numericValue || 46545
  }
})

const financingAmount = computed(() => {
  const propertyPrice = selectedProperty.value?.propertyPrice || 0
  const totalInitialCosts = 2400 // Fixed costs: 1200 + 650 + 350 + 200 + 0
  return Math.max(0, propertyPrice - stateContribution.value - initialPayment.value + totalInitialCosts)
})

const bonusExplanation = computed(() => {
  if (selectedProgram.value !== 'mivivienda' || !selectedProperty.value || !selectedClient.value) {
    return ''
  }

  const propertyPrice = selectedProperty.value.propertyPrice
  const isSustainable = selectedProperty.value.isSustainable
  const isIntegratorEligible = selectedClient.value.integratorBonusStatus === 'ELIGIBLE'

  // Check if property price is above 362,100 - no BBP applies
  if (propertyPrice > 362100) {
    return 'Tras evaluar el valor de la vivienda, se ha determinado que para propiedades con valor superior a S/ 362,100 no aplica el Bono del Buen Pagador.'
  }

  // Use the same logic as stateContribution calculation
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

  // Find the applicable bonus and its range
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
    // Determine range name
    const ranges = bonusData.value
    const range = ranges.find(r => r.min <= propertyPrice && r.max >= propertyPrice)
    if (range) {
      rangeText = range.rangeName
    }

    // Determine bonus type text
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

  // Find the range for this property
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
  const costs = 2400
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
  // Reset initial payment when switching programs
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
    // Prepare simulation data
    const simulationData = {
      clientId: selectedClient.value?.id,
      propertyId: selectedProperty.value?.id,
      programType: selectedProgram.value,
      financialEntityId: selectedEntity.value?.id,
      calculatedValues: {
        propertyPrice: selectedProperty.value?.propertyPrice,
        stateContribution: stateContribution.value,
        initialPayment: initialPayment.value,
        initialCosts: 2400, // Fixed costs
        financingAmount: financingAmount.value
      },
      financingDetails: {
        currency: creditCurrency.value,
        usdValue: null,
        termYears: creditTerm.value,
        interestRate: {
          rate: interestRate.value || 9.5,
          type: selectedRateType.value,
          period: selectedPeriod.value, // <-- CORREGIDO
          capitalization: selectedRateType.value === 'TN' ? selectedCapitalization.value : undefined
        },
        opportunityCost: {
          rate: opportunityRate.value || 7.0,
          type: selectedOpportunityRateType.value,
          period: selectedOpportunityPeriod.value, // <-- CORREGIDO
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

    // Log the simulation data structure to console
    console.log('Simulation Data Structure:', JSON.stringify(simulationData, null, 2))

    // Call simulation API
    const { createSimulation } = useSimulations()
    const result = await createSimulation(simulationData)

    // Navigate to results page with simulation ID
    navigateTo(`/simulador/resultados/${result.simulationId}`)
  } catch (error) {
    console.error('Error creating simulation:', error)
    // TODO: Show error notification
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

// Load data
onMounted(async () => {
  try {
    // Load selected property
    const storedProperty = localStorage.getItem('selectedProperty')
    if (storedProperty) {
      selectedProperty.value = JSON.parse(storedProperty)
    }

    // Load configuration data
    bonusParameters.value = await listBonusParameters()
    globalValues.value = await listGlobalValues()
    financialEntities.value = await listFinancialEntities()
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

// Watch for program changes to adjust initial payment minimum
watch(selectedProgram, (newProgram) => {
  if (newProgram === 'techo_propio' && selectedProperty.value) {
    const minPayment = Math.floor(selectedProperty.value.propertyPrice * 0.075)
    if (initialPayment.value < minPayment) {
      initialPayment.value = minPayment
    }
  }
})
</script>