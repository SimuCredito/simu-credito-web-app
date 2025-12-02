<template>
  <div class="space-y-8">

    <div v-if="isLoading" class="text-center py-20">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-500 mt-4">Cargando valores globales...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>

    <template v-else>

      <form @submit.prevent="handleSaveUit" class="card">
        <h3 class="text-xl font-semibold text-gray-900">Valor de la UIT</h3>
        <p class="text-sm text-gray-600 mt-2">
          La Unidad Impositiva Tributaria (UIT) es un valor de referencia utilizado en Perú para determinar impuestos, multas y la base de cálculo de los bonos.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row sm:items-end sm:space-x-4">
          <div class="flex-1">
            <label for="uit_value" class="form-label">Valor de la UIT para el año en curso (PEN)</label>
            <input
                id="uit_value"
                v-model.number="uitData.numericValue"
                type="number"
                step="1"
                class="input-field"
                :class="{'max-w-xs': true}"
                placeholder="5150"
            />
          </div>
          <button
              type="submit"
              class="btn-primary mt-4 sm:mt-0 sm:flex-shrink-0"
              :disabled="isSubmittingUit"
          >
            <span v-if="isSubmittingUit">Guardando...</span>
            <span v-else>Guardar Valor UIT</span>
          </button>
        </div>
      </form>

      <!--
      <form @submit.prevent="handleSaveExchangeRate" class="card">
        <h3 class="text-xl font-semibold text-gray-900">Tipo de cambio del mercado</h3>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label for="exchange_rate" class="form-label">Valor del Dólar (USD a PEN)</label>
            <input
                id="exchange_rate"
                v-model.number="exchangeRateData.numericValue"
                type="number"
                step="0.001"
                class="input-field"
                placeholder="3.745"
            />
          </div>

          <div>
            <label for="exchange_date" class="form-label">Fecha de consulta</label>
            <input
                id="exchange_date"
                v-model="exchangeRateData.stringValue"
                type="date"
                class="input-field"
            />
          </div>

          <div class="sm:pt-7">
            <button
                type="submit"
                class="btn-primary w-full"
                :disabled="isSubmittingExchangeRate"
            >
              <span v-if="isSubmittingExchangeRate">Guardando...</span>
              <span v-else>Guardar Tipo de Cambio</span>
            </button>
          </div>
        </div>
      </form>
      -->
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration'
import { useNotifications } from '~/composables/useNotifications'

// --- Inyección de Composables ---
const { listGlobalValues, createGlobalValue, updateGlobalValue } = useConfiguration()
const { showSuccess, showError } = useNotifications()

// --- Estado de la UI ---
const allValues = ref([])
const isLoading = ref(true)
const isSubmittingUit = ref(false)
const isSubmittingExchangeRate = ref(false)
const error = ref(null)

// --- Estado de los Datos ---
// Usaremos 'reactive' para que los inputs estén vinculados
const uitData = reactive({ id: null, numericValue: 0 })
const exchangeRateData = reactive({ id: null, numericValue: 0, stringValue: '' }) // stringValue para la fecha

// --- Funciones de Carga de Datos ---
const fetchValues = async () => {
  try {
    isLoading.value = true
    error.value = null
    allValues.value = await listGlobalValues()

    // Asignamos los valores encontrados a nuestros objetos reactivos
    const uit = allValues.value.find(v => v.valueKey === 'UIT')
    if (uit) {
      uitData.id = uit.id
      uitData.numericValue = uit.numericValue
    }

    const exchangeRate = allValues.value.find(v => v.valueKey === 'EXCHANGE_RATE_USD')
    if (exchangeRate) {
      exchangeRateData.id = exchangeRate.id
      exchangeRateData.numericValue = exchangeRate.numericValue
      // La API guarda la fecha como 'validFrom', la UI la muestra en 'stringValue' (según el mockup)
      // Adaptamos: usamos stringValue para el input 'date' y lo mapeamos a 'validFrom' al guardar.
      // O, si la API usa stringValue para la fecha, esto es directo.
      // Asumiremos que el stringValue es la fecha en formato YYYY-MM-DD
      exchangeRateData.stringValue = exchangeRate.stringValue ? exchangeRate.stringValue.split('T')[0] : ''
    }

  } catch (err) {
    console.error('Error cargando valores:', err)
    error.value = 'No se pudieron cargar los valores globales. ' + err.message
    showError(error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchValues)

// --- Lógica de Guardado ---

const handleSaveUit = async () => {
  isSubmittingUit.value = true
  try {
    const payload = {
      valueKey: 'UIT',
      valueName: 'Unidad Impositiva Tributaria',
      numericValue: uitData.numericValue,
      stringValue: null,
      valueType: 'NUMERIC',
      unit: 'PEN',
      isActive: true,
      validFrom: new Date().toISOString(),
      validUntil: null,
      description: 'Valor de la Unidad Impositiva Tributaria para el año en curso'
    }

    if (uitData.id) {
      // Update existing
      await updateGlobalValue(uitData.id, payload)
      showSuccess('Valor de la UIT actualizado exitosamente')
    } else {
      // Create new
      const created = await createGlobalValue(payload)
      uitData.id = created.id
      showSuccess('Valor de la UIT creado exitosamente')
    }
    // Refresh data after save
    await fetchValues()
  } catch (err) {
    console.error('Error guardando UIT:', err)
    showError('Error al guardar la UIT: ' + err.message)
  } finally {
    isSubmittingUit.value = false
  }
}

const handleSaveExchangeRate = async () => {
  isSubmittingExchangeRate.value = true
  try {
    const payload = {
      valueKey: 'EXCHANGE_RATE_USD',
      valueName: 'Tipo de Cambio USD a PEN',
      numericValue: exchangeRateData.numericValue,
      stringValue: exchangeRateData.stringValue, // La fecha del input
      valueType: 'NUMERIC',
      unit: 'PEN',
      isActive: true,
      validFrom: new Date().toISOString(),
      validUntil: null,
      description: 'Tipo de cambio del dólar estadounidense al sol peruano'
    }

    if (exchangeRateData.id) {
      // Update existing
      await updateGlobalValue(exchangeRateData.id, payload)
      showSuccess('Tipo de Cambio actualizado exitosamente')
    } else {
      // Create new
      const created = await createGlobalValue(payload)
      exchangeRateData.id = created.id
      showSuccess('Tipo de Cambio creado exitosamente')
    }
    // Refresh data after save
    await fetchValues()
  } catch (err) {
    console.error('Error guardando Tipo de Cambio:', err)
    showError('Error al guardar el Tipo de Cambio: ' + err.message)
  } finally {
    isSubmittingExchangeRate.value = false
  }
}
</script>

<style scoped>
/* Estilos de las Tarjetas */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}
.input-field {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50;
}
</style>