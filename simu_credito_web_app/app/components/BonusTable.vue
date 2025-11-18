<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Valores del bono (Bono del Buen Pagador)</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="th-cell pl-4 sm:pl-6">Rango</th>
            <th scope="col" class="th-cell">Valor de Vivienda</th>
            <th scope="col" class="th-cell">BBP Tradicional</th>
            <th scope="col" class="th-cell">BBP Sostenible</th>
            <th scope="col" class="th-cell">BBP Integrador</th>
            <th scope="col" class="th-cell">BBP Integrador Sostenible</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="range in bonusData" :key="range.rangeName">
            <td class="td-cell-main pl-4 sm:pl-6">{{ range.rangeName }}</td>
            <td class="td-cell">{{ range.valueRangeText }}</td>
            <td class="td-cell">{{ formatCurrency(range.tradicional?.bonusAmount) }}</td>
            <td class="td-cell">{{ formatCurrency(range.sostenible?.bonusAmount) }}</td>
            <td class="td-cell">{{ formatCurrency(range.integrador?.bonusAmount) }}</td>
            <td class="td-cell">{{ formatCurrency(range.integradorSostenible?.bonusAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bonusData: {
    type: Array,
    default: () => []
  }
})

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'No aplica'
  return `S/ ${value.toLocaleString('es-PE')}`
}
</script>

<style scoped>
/* Estilos de la Tabla */
.th-cell {
  @apply py-3.5 px-3 text-left text-sm font-semibold text-gray-900;
}
.td-cell {
  @apply whitespace-nowrap px-3 py-4 text-sm text-gray-500;
}
.td-cell-main {
  @apply whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900;
}
</style>