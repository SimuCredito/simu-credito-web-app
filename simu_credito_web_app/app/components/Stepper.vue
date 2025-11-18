<template>
  <div class="flex items-center justify-center mb-8">
    <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
      <!-- Step Circle -->
      <div
        class="flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium"
        :class="step.completed ? 'bg-indigo-600 border-indigo-600 text-white' : step.active ? 'border-indigo-600 bg-white text-indigo-600' : 'border-gray-300 bg-white text-gray-500'"
      >
        <svg v-if="step.completed" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span v-else>{{ step.id }}</span>
      </div>

      <!-- Step Label -->
      <div class="ml-3">
        <div
          class="text-sm font-medium"
          :class="step.active ? 'text-indigo-600' : 'text-gray-500'"
        >
          {{ step.label }}
        </div>
      </div>

      <!-- Connector Line (except for last step) -->
      <div
        v-if="index < steps.length - 1"
        class="flex-1 h-px mx-4 min-w-8"
        :class="steps[index].completed ? 'bg-indigo-600' : 'bg-gray-300'"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    default: 1
  }
})

const steps = computed(() => [
  { id: 1, label: 'Selección', active: props.currentStep === 1, completed: props.currentStep > 1 },
  { id: 2, label: 'Financiamiento', active: props.currentStep === 2, completed: props.currentStep > 2 },
  { id: 3, label: 'Oferta Bancaria', active: props.currentStep === 3, completed: props.currentStep > 3 },
  { id: 4, label: 'Condiciones', active: props.currentStep === 4, completed: props.currentStep > 4 },
])
</script>