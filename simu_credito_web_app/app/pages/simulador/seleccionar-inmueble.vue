<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Simulador
        </button>
      </div>

      <!-- Property Grid -->
      <PropertyGrid
        :properties="properties"
        @select-property="handlePropertySelected"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProperties } from '~/composables/useProperties'

// Define your page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Components
import PropertyGrid from '~/components/PropertyGrid.vue'

const { listProperties } = useProperties()

// State
const properties = ref([])

// Handlers
const goBack = () => {
  navigateTo('/simulador')
}

const handlePropertySelected = (property) => {
  // Store selected property in localStorage
  localStorage.setItem('selectedProperty', JSON.stringify(property))
  // Navigate back to simulator
  navigateTo('/simulador')
}

// Load properties
onMounted(async () => {
  try {
    properties.value = await listProperties()
  } catch (error) {
    console.error('Error loading properties:', error)
  }
})
</script>