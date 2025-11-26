<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Plazo del Crédito</h3>

    <div>
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
import { ref, watch } from 'vue'

const props = defineProps({
  initialTerm: { type: Number, default: 20 }
})

const loanTerm = ref(props.initialTerm)
const emit = defineEmits(['update:term'])

watch(() => props.initialTerm, (val) => loanTerm.value = val)

const updateLoanTerm = () => {
  emit('update:term', parseInt(loanTerm.value))
}

watch(loanTerm, (newValue) => {
  emit('update:term', newValue)
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #6366f1; cursor: pointer;
}
.slider::-moz-range-thumb {
  height: 20px; width: 20px; border-radius: 50%; background: #6366f1; cursor: pointer; border: none;
}
</style>