<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Datos del Crédito</h3>

    <!-- Currency Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Moneda</label>
      <div class="flex rounded-lg border border-gray-200 p-1 bg-white">
        <button
          v-for="currency in currencies"
          :key="currency.id"
          @click="selectedCurrency = currency.id"
          :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
            selectedCurrency === currency.id
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ currency.label }}
        </button>
      </div>
    </div>

    <!-- Loan Term Slider -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Plazo del Crédito</label>
      <div class="space-y-3">
        <input
          v-model="loanTerm"
          type="range"
          min="5"
          max="25"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          @input="updateLoanTerm"
        />
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">5 años</span>
          <div class="text-center">
            <span class="text-xl font-bold text-indigo-600">{{ loanTerm }} Años</span>
            <span class="text-sm text-gray-500 block">/ {{ loanTerm * 12 }} Meses</span>
          </div>
          <span class="text-xs text-gray-500">25 años</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'

const props = defineProps({
  initialCurrency: { type: String, default: 'PEN' },
  initialTerm: { type: Number, default: 20 }
})

const currencies = [
  { id: 'PEN', label: 'Soles (PEN)' },
  { id: 'USD', label: 'Dólares (USD)' }
]

const selectedCurrency = ref(props.initialCurrency)
const loanTerm = ref(props.initialTerm)

const emit = defineEmits(['update:currency', 'update:term'])

watch(() => props.initialCurrency, (val) => selectedCurrency.value = val)
watch(() => props.initialTerm, (val) => loanTerm.value = val)

const updateLoanTerm = () => {
  emit('update:term', parseInt(loanTerm.value))
}

watch(selectedCurrency, (newValue) => {
  emit('update:currency', newValue)
})

watch(loanTerm, (newValue) => {
  emit('update:term', newValue)
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: none;
}
</style>