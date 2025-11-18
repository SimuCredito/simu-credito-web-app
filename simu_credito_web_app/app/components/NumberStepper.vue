<template>
  <div class="number-stepper">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="flex items-center space-x-2">
      <button
        type="button"
        @click="decrement"
        :disabled="disabled || (modelValue <= min)"
        class="btn-stepper"
        :class="{ 'opacity-50 cursor-not-allowed': disabled || (modelValue <= min) }"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <input
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        type="number"
        :min="min"
        :step="step"
        :disabled="disabled"
        class="form-input text-center w-20"
        :class="inputClass"
      />
      <button
        type="button"
        @click="increment"
        :disabled="disabled"
        class="btn-stepper"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <span v-if="unit" class="text-sm text-gray-500">{{ unit }}</span>
    </div>
    <p v-if="optional && modelValue === 0" class="text-xs text-gray-400 mt-1">Opcional</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  label: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  },
  optional: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const increment = () => {
  emit('update:modelValue', props.modelValue + props.step)
}

const decrement = () => {
  const newValue = props.modelValue - props.step
  if (newValue >= props.min) {
    emit('update:modelValue', newValue)
  }
}

const handleInput = (event) => {
  const value = parseFloat(event.target.value) || 0
  emit('update:modelValue', Math.max(props.min, value))
}

const handleBlur = (event) => {
  const value = parseFloat(event.target.value) || 0
  emit('update:modelValue', Math.max(props.min, value))
}
</script>

<style scoped>
.btn-stepper {
  @apply inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}

.form-input {
  @apply block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6;
}

.form-label {
  @apply block text-sm font-medium leading-6 text-gray-900;
}
</style>