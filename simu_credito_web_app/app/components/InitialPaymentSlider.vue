<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">Cuota inicial del cliente</label>
    <div class="space-y-4">
      <!-- Slider -->
      <input
        v-model="localValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        @input="handleInput"
      />

      <!-- Value Display -->
      <div class="text-center">
        <span class="text-xl font-semibold text-gray-900">S/ {{ formattedValue }}</span>
      </div>

      <!-- Minimum Notice (for Techo Propio) -->
      <p v-if="showMinNotice" class="text-xs text-gray-600 text-center">
        Mínimo 7.5% del valor del inmueble
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    required: true
  },
  step: {
    type: Number,
    default: 1000
  },
  showMinNotice: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

const formattedValue = computed(() => {
  return localValue.value.toLocaleString()
})

const handleInput = (event) => {
  const value = parseInt(event.target.value)
  localValue.value = value
  emit('update:modelValue', value)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
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
  border: 2px solid #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}
</style>