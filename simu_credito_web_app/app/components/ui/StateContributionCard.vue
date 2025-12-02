<template>
  <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 sm:p-6">

    <div class="flex flex-col sm:flex-row justify-between items-start">

      <div class="flex-1 w-full sm:w-auto pr-0 sm:pr-6">
        <h3 class="text-lg font-semibold text-indigo-900 mb-2">{{ title }}</h3>

        <p class="text-sm text-indigo-700 font-medium mb-3">{{ description }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-l-2 border-indigo-300 pl-3">
          <div v-if="clientInfo" class="text-xs text-indigo-800 space-y-1">
            <p><strong>Cliente:</strong> {{ clientInfo.name }}</p>
            <p><strong>Aplica Integración:</strong> {{ clientInfo.appliesForIntegratorBonus ? 'Sí' : 'No' }}</p>
            <p v-if="clientInfo.conadisCardNumber"><strong>CONADIS:</strong> {{ clientInfo.conadisCardNumber }}</p>
          </div>
          <div v-if="clientInfoTechoPropio" class="text-xs text-indigo-800 space-y-1">
            <p><strong>Cliente:</strong> {{ clientInfoTechoPropio.name }}</p>
            <p><strong>Vivienda actual:</strong> {{ clientInfoTechoPropio.currentHousingSituation ? 'Propia' : 'No propia' }}</p>
            <p><strong>Recibio bono anterior:</strong> {{ clientInfoTechoPropio.receivedPreviousSupport ? 'Sí' : 'No' }}</p>
            <p><strong>Ingreso neto mensual:</strong> S/ {{ clientInfoTechoPropio.monthlyNetIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</p>
          </div>
          <div v-if="propertyInfo" class="text-xs text-indigo-800 space-y-1">
            <p><strong>Inmueble Sostenible:</strong> {{ propertyInfo.isSustainable ? 'Sí' : 'No' }}</p>
            <p><strong>Rango calculado:</strong> {{ propertyInfo.range }}</p>
          </div>
        </div>

        <p class="text-sm text-indigo-600 italic leading-relaxed border-t border-indigo-200 pt-2" v-html="explanationText"></p>

        <div v-if="programType === 'techo_propio' && currency === 'PEN' " class="mt-2 text-xs text-indigo-500">
          <p>El Bono Familiar Habitacional (BFH) se asigna según los criterios establecidos por el programa Techo Propio, considerando la situación habitacional del cliente  (no debe tener vivienda), si no recibio apoyo habitacional anteriormente y su ingreso neto mensual (no superior a S/. 3,715.00)</p>
        </div>
        <div v-if="programType === 'techo_propio' && currency === 'USD' " class="mt-2 text-xs text-indigo-500">
          <p>El Bono Familiar Habitacional (BFH) se asigna según los criterios establecidos por el programa Techo Propio, considerando la situación habitacional del cliente  (no debe tener vivienda), si no recibio apoyo habitacional anteriormente y su ingreso neto mensual (no superior a USD {{(3715/currencyAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}})</p>
        </div>
      </div>

      <div class="w-full sm:w-auto mt-4 sm:mt-0 text-left sm:text-right whitespace-nowrap border-t border-indigo-100 sm:border-none pt-3 sm:pt-0">
        <p class="text-2xl font-bold text-indigo-600">{{ currencySymbol }} {{ formattedAmount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true
  },
  clientInfo: {
    type: Object,
    default: null
  },
  clientInfoTechoPropio: {
    type: Object,
    default: null
  },
  propertyInfo: {
    type: Object,
    default: null
  },
  currency: {
    type: String,
    default: 'PEN'
  },

  currencyAmount: {
    type: Number,
    default: null
  },
  // Agregamos esta prop para distinguir el programa (mivivienda vs techo_propio)
  programType: {
    type: String,
    default: 'mivivienda' // valor por defecto
  }
})

const currencySymbol = computed(() => props.currency === 'USD' ? '$' : 'S/')

const formattedAmount = computed(() => {
  return props.amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
})

// Lógica para formular el texto explicativo actualizada
const explanationText = computed(() => {

  // Lógica para Techo Propio (BFH)
  if (props.programType === 'techo_propio') {
    if ((!props.amount || props.amount === 0) && (props.clientInfoTechoPropio.receivedPreviousSupport === true)) return 'No se ha asignado un bono para esta operación, porque el cliente ya recibió un apoyo habitacional anteriormente.'
    if ((!props.amount || props.amount === 0) && (props.clientInfoTechoPropio.currentHousingSituation === true)) return 'No se ha asignado un bono para esta operación, porque el cliente ya cuenta con vivienda propia.'
    if ((!props.amount || props.amount === 0) && (props.clientInfoTechoPropio.monthlyNetIncome > (props.currency === 'USD' ? 3715 / props.currencyAmount : 3715))) return 'No se ha asignado un bono para esta operación, porque el ingreso neto mensual del cliente supera el límite establecido por el programa Techo Propio.'
    return 'Se ha asignado el <strong>Bono Familiar Habitacional (BFH)</strong> correspondiente a la modalidad de Adquisición de Vivienda Nueva (AVN).'
  }

  if (!props.amount || props.amount === 0) return 'No se ha asignado un bono para esta operación.'

  // Lógica existente para Mivivienda (Bono del Buen Pagador - BBP)
  const isSustainable = props.propertyInfo?.isSustainable || false
  const isIntegrator = props.clientInfo?.appliesForIntegratorBonus || false

  let type = 'Tradicional'
  let reason = 'al valor de la vivienda'

  if (isSustainable && isIntegrator) {
    type = 'Integrador Sostenible'
    reason = 'a que el cliente califica como integrador (registrado en Conadis) y el inmueble es sostenible'
  } else if (isIntegrator) {
    type = 'Integrador'
    reason = 'a la condición de integrador del cliente (registrado en Conadis)'
  } else if (isSustainable) {
    type = 'Sostenible'
    reason = 'a la certificación sostenible del inmueble'
  }

  return `Se ha asignado el <strong>Bono BBP ${type}</strong> debido ${reason}.`
})
</script>