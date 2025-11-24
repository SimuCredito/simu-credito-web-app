<template>
  <div class="bg-white rounded-lg shadow border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Tabla de Amortización</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">N° Cuota</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">TEM</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Plazo de Gracia</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Saldo Inicial</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interés</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cuota</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amortización</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Seguro Desgrav.</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Seguro Riesgo</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Comisiones</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Gastos Adm.</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Portes</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Saldo Final</th>
          <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Flujo</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="payment in payments" :key="payment.paymentNumber">
          <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ payment.paymentNumber }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{{ (payment.tem * 100).toFixed(4) }}%</td>

          <td class="px-3 py-4 whitespace-nowrap text-sm">
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-yellow-100 text-yellow-800': payment.gracePeriodDescription === 'Parcial',
                'bg-orange-100 text-orange-800': payment.gracePeriodDescription === 'Total',
                'text-gray-500': !payment.gracePeriodDescription || payment.gracePeriodDescription === 'Sin gracia'
              }">
                {{ payment.gracePeriodDescription || 'Sin gracia' }}
              </span>
          </td>

          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.initialBalance.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.interest.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.payment.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.principal.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.lifeInsurance.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.propertyInsurance.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.commissions.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.adminCosts.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.deliveryCosts.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">S/ {{ payment.finalBalance.toLocaleString() }}</td>
          <td class="px-3 py-4 whitespace-nowrap text-sm font-semibold text-red-600">S/ {{ payment.cashFlow.toLocaleString() }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Mostrando {{ (currentPage * pageSize) + 1 }} a {{ Math.min((currentPage + 1) * pageSize, totalPayments) }} de {{ totalPayments }} resultados
      </div>

      <nav class="flex items-center space-x-1">
        <button
            @click="$emit('page-change', currentPage - 1)"
            :disabled="currentPage === 0"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <template v-for="page in visiblePages" :key="page">
          <button
              @click="$emit('page-change', page)"
              :class="[
              'px-3 py-1 text-sm border rounded-md',
              page === currentPage
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page + 1 }}
          </button>
        </template>

        <button
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  simulationId: {
    type: String,
    required: true
  },
  totalPayments: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  payments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.totalPayments / props.pageSize))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(0, props.currentPage - 2)
  const end = Math.min(totalPages.value - 1, props.currentPage + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>