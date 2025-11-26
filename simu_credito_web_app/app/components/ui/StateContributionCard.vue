<template>
  <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
    <div class="flex justify-between items-start">
      <div class="flex-1 pr-6">
        <h3 class="text-lg font-semibold text-indigo-900 mb-2">{{ title }}</h3>

        <p class="text-sm text-indigo-700 font-medium mb-3">{{ description }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-l-2 border-indigo-300 pl-3">
          <div v-if="clientInfo" class="text-xs text-indigo-800 space-y-1">
            <p><strong>Cliente:</strong> {{ clientInfo.name }}</p>
            <p><strong>Aplica Integración:</strong> {{ clientInfo.appliesForIntegratorBonus ? 'Sí' : 'No' }}</p>
            <p v-if="clientInfo.conadisCardNumber"><strong>CONADIS:</strong> {{ clientInfo.conadisCardNumber }}</p>
          </div>
          <div v-if="propertyInfo" class="text-xs text-indigo-800 space-y-1">
            <p><strong>Inmueble Sostenible:</strong> {{ propertyInfo.isSustainable ? 'Sí' : 'No' }}</p>
            <p><strong>Rango calculado:</strong> {{ propertyInfo.range }}</p>
          </div>
        </div>

        <p class="text-sm text-indigo-600 italic leading-relaxed border-t border-indigo-200 pt-2" v-html="explanationText"></p>
      </div>

      <div class="text-right whitespace-nowrap">
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
  propertyInfo: {
    type: Object,
    default: null
  },
  currency: {
    type: String,
    default: 'PEN'
  }
})

const currencySymbol = computed(() => props.currency === 'USD' ? '$' : 'S/')

const formattedAmount = computed(() => {
  return props.amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
})

// Lógica para formular el texto explicativo
const explanationText = computed(() => {
  if (!props.amount || props.amount === 0) return 'No se ha asignado un bono para esta operación.'

  // Extraer flags de los objetos de información
  const isSustainable = props.propertyInfo?.isSustainable || false
  const isIntegrator = props.clientInfo?.appliesForIntegratorBonus || false

  // Determinar el tipo de bono y la razón
  let type = 'Tradicional'
  let reason = 'al valor de la vivienda'

  if (isSustainable && isIntegrator) {
    type = 'Integrador Sostenible'
    reason = 'a que el cliente califica como integrador (regsitrado en Conadis) y el inmueble es sostenible'
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