<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-200">
    <div class="px-6 py-5 border-b border-gray-200">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Registro de Simulaciones</h3>
      <p class="mt-1 text-sm text-gray-500">Consulta y gestiona tus simulaciones anteriores.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Inmueble</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Monto Financiado</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cuota Mensual</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">TCEA</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-6"><span class="sr-only">Ver</span></th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="sim in simulations" :key="sim.simulationId" class="hover:bg-gray-50 transition-colors">
              <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-gray-500">
                {{ formatDate(sim.generatedAt) }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                {{ sim.clientInfo?.name || 'N/A' }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ sim.propertyInfo?.name || 'N/A' }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                {{ sim.inputs.currency === 'USD' ? '$' : 'S/' }} {{ sim.summary?.financingAmount?.toLocaleString() }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-indigo-600 font-bold">
                {{ sim.inputs.currency === 'USD' ? '$' : 'S/' }} {{ sim.keyIndicators?.monthlyPayment?.toLocaleString('es-PE', {minimumFractionDigits: 2}) }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ sim.keyIndicators?.tcea?.toFixed(2) }}%
              </td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                <NuxtLink :to="`/simulador/resultados/${sim.simulationId}`" class="text-indigo-600 hover:text-indigo-900">
                  Ver Resultados
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="simulations.length === 0">
              <td colspan="7" class="py-10 text-center text-gray-500">
                No hay simulaciones registradas.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSimulations } from '~/composables/useSimulations'

const { listUserSimulations } = useSimulations()
const simulations = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    const data = await listUserSimulations()
    simulations.value = data || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>