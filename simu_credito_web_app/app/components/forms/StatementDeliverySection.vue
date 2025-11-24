<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">¿Cómo deseas recibir tu estado de cuenta mensual? (Portes)</h3>

    <div class="grid grid-cols-2 gap-4">
      <!-- Envío Electrónico -->
      <div
        @click="selectedDelivery = 'electronic'"
        :class="[
          'border rounded-lg p-4 cursor-pointer transition-all',
          selectedDelivery === 'electronic'
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-200 hover:border-gray-300'
        ]"
      >
        <div class="flex items-center">
          <div class="text-gray-400 mr-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Envío Electrónico</h4>
            <p class="text-sm text-gray-500">Recibe tu estado de cuenta por email</p>
          </div>
        </div>
      </div>

      <!-- Envío Físico -->
      <div
        @click="selectedDelivery = 'physical'"
        :class="[
          'border rounded-lg p-4 cursor-pointer transition-all',
          selectedDelivery === 'physical'
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-200 hover:border-gray-300'
        ]"
      >
        <div class="flex items-center">
          <div class="text-gray-400 mr-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Envío Físico</h4>
            <p class="text-sm text-gray-500">Recibe tu estado de cuenta por correo postal</p>
            <p class="text-xs text-indigo-600 mt-1">Costo: S/ 10.00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialDelivery: { type: String, default: 'electronic' }
})

const selectedDelivery = ref(props.initialDelivery)

const emit = defineEmits(['update:deliveryMethod'])

watch(() => props.initialDelivery, (val) => selectedDelivery.value = val)

watch(selectedDelivery, (newValue) => {
  emit('update:deliveryMethod', newValue)
})

emit('update:deliveryMethod', selectedDelivery.value)
</script>