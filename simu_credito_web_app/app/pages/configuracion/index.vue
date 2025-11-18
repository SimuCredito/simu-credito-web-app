<template>
  <div>
    <div class="flex justify-end mb-6">
      <button
          @click="openAddModal"
          type="button"
          class="btn-primary inline-flex items-center gap-x-2 shadow hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <span class="bg-indigo-700/50 rounded-md p-1.5 mr-1 -ml-1">
          <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        Agregar Entidad Financiera
      </button>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="n in 6" :key="`skel-${n}`" class="bg-gray-100 rounded-xl p-5 border border-gray-200 animate-pulse h-44">
        <div class="flex items-center gap-x-4 mb-5">
          <div class="h-12 w-28 bg-gray-300 rounded"></div>
          <div class="flex-1 h-6 bg-gray-300 rounded"></div>
        </div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-sm">
      <p><strong>Error al cargar:</strong> {{ error }}</p>
    </div>

    <div v-else-if="!isLoading && entities.length === 0" class="text-center bg-white rounded-xl shadow-sm border border-gray-200 py-20 px-6">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
      <h3 class="mt-4 text-xl font-semibold text-gray-800">No hay entidades financieras</h3>
      <p class="mt-2 text-base text-gray-500">Agrega la primera entidad financiera para comenzar.</p>
      <div class="mt-6">
        <button @click="openAddModal" class="btn-primary inline-flex items-center gap-x-1.5">
          <svg class="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Agregar Entidad
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
          v-for="entity in entities"
          :key="entity.id"
          class="bg-gray-50/70 rounded-xl p-5 border border-gray-200 relative group transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2" tabindex="0"
      >
        <div class="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-10">
          <button
              @click="openEditModal(entity)"
              class="text-gray-400 hover:text-indigo-600 p-1.5 bg-white rounded-md shadow-sm border border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              aria-label="Editar"
              title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
          </button>
          <button
              @click="openDeleteConfirm(entity)"
              class="text-gray-400 hover:text-red-600 p-1.5 bg-white rounded-md shadow-sm border border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              aria-label="Eliminar"
              title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
          </button>
        </div>

        <div class="flex items-center gap-x-4">
          <div class="h-16 w-16 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-indigo-200 shadow-lg">
            <img
                v-if="entity.photoUrl"
                :src="entity.photoUrl"
                :alt="`Logo de ${entity.entityName}`"
                class="h-12 w-12 object-contain rounded-xl"
            >
            <div v-else class="h-8 w-8 text-indigo-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-900 text-lg truncate leading-tight">{{ entity.entityName }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {{ entity.entityCode || 'N/A' }}
              </span>
              <span v-if="entity.isActive" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
              <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactivo
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <dt class="text-blue-600 text-xs uppercase tracking-wide font-medium">TEA</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.interestRateTea ? `${entity.interestRateTea.toFixed(2)}%` : 'N/A' }}</dd>
            </div>
            <div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200">
              <dt class="text-cyan-600 text-xs uppercase tracking-wide font-medium">TNA</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.interestRateTna ? `${entity.interestRateTna.toFixed(2)}%` : 'N/A' }}</dd>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <dt class="text-green-600 text-xs uppercase tracking-wide font-medium">Plazo Máx.</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.maxTermMonths ? `${entity.maxTermMonths} meses` : 'N/A' }}</dd>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-3 border border-purple-200">
              <dt class="text-purple-600 text-xs uppercase tracking-wide font-medium">Monto Máx.</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.maxLoanAmount ? formatLoanRange(null, entity.maxLoanAmount) : 'N/A' }}</dd>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
              <dt class="text-orange-600 text-xs uppercase tracking-wide font-medium">Periodo Gracia</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.periodoGracia ? `${entity.periodoGracia} meses` : 'N/A' }}</dd>
            </div>
            <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-3 border border-pink-200">
              <dt class="text-pink-600 text-xs uppercase tracking-wide font-medium">Capitalización</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.capitalizationPeriod || 'N/A' }}</dd>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
              <dt class="text-yellow-600 text-xs uppercase tracking-wide font-medium">Gastos Formalización</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.processingFeePercentage ? `${entity.processingFeePercentage.toFixed(2)}%` : 'N/A' }}</dd>
            </div>
            <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-200">
              <dt class="text-red-600 text-xs uppercase tracking-wide font-medium">Seguro Desgravamen</dt>
              <dd class="font-bold text-gray-900 text-base">{{ entity.lifeInsurancePercentage ? `${entity.lifeInsurancePercentage.toFixed(3)}%` : 'N/A' }}</dd>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200">
            <dt class="text-gray-600 text-xs uppercase tracking-wide font-medium">Seguro del Inmueble</dt>
            <dd class="font-bold text-gray-900 text-base">{{ entity.propertyInsurancePercentage ? `${entity.propertyInsurancePercentage.toFixed(3)}%` : 'N/A' }}</dd>
          </div>
        </div>
      </div>
    </div>

    <FinancialEntityModal
        :is-open="isModalOpen"
        :entity="selectedEntity"
        :is-loading="isSubmitting"
        @close="closeModal"
        @save="handleSaveEntity"
    />

    <DeleteConfirmationModal
        :is-open="isDeleteModalOpen"
        :message="deleteMessage"
        @confirm="handleDeleteEntity"
        @cancel="closeDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration'
import { useNotifications } from '~/composables/useNotifications'

// Importar Modales de forma asíncrona
const FinancialEntityModal = defineAsyncComponent(() => import('@/components/FinancialEntityModal.vue'))
const DeleteConfirmationModal = defineAsyncComponent(() => import('@/components/DeleteConfirmationModal.vue'))

const {
  listFinancialEntities,
  createFinancialEntity,
  updateFinancialEntity,
  deleteFinancialEntity
} = useConfiguration()
const { showSuccess, showError } = useNotifications()

// Estado
const entities = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false) // Para los modales
const error = ref(null)
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedEntity = ref(null)
const deleteMessage = ref('')

// Carga inicial
onMounted(fetchEntities)

async function fetchEntities() {
  try {
    isLoading.value = true
    error.value = null
    const data = await listFinancialEntities()
    // Asegurarse que data es un array antes de asignarlo
    entities.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error cargando entidades:', err)
    error.value = 'No se pudieron cargar las entidades. ' + (err.data?.message || err.message)
    // showError(error.value) // Mostrar error en notificación
    entities.value = [] // Resetear a array vacío en caso de error
  } finally {
    isLoading.value = false
  }
}


// Lógica de Modales
const closeModal = () => { isModalOpen.value = false; selectedEntity.value = null }
const openAddModal = () => { selectedEntity.value = null; isModalOpen.value = true }
const openEditModal = (entity) => { selectedEntity.value = entity; isModalOpen.value = true }
const closeDeleteConfirm = () => { isDeleteModalOpen.value = false; selectedEntity.value = null }
const openDeleteConfirm = (entity) => {
  selectedEntity.value = entity
  deleteMessage.value = `¿Estás seguro de eliminar la entidad "${entity.entityName}"? Esta acción no se puede deshacer.`
  isDeleteModalOpen.value = true
}

// Lógica CRUD
async function handleSaveEntity({ entityData, photoFile, entityId }) {
  isSubmitting.value = true
  try {
    if (entityId) {
      // API para PUT no maneja foto, solo JSON
      await updateFinancialEntity(entityId, entityData)
      showSuccess('Entidad actualizada exitosamente')
    } else {
      // API para POST usa JSON con photoUrl incluido en entityData
      await createFinancialEntity(entityData)
      showSuccess('Entidad creada exitosamente')
    }
    closeModal()
    await fetchEntities()
  } catch (err) {
    console.error('Error guardando entidad:', err)
    // Intenta obtener un mensaje de error más específico si la API lo envía
    const apiErrorMessage = err.data?.message || err.message || 'Error desconocido';
    showError(`Error al guardar: ${apiErrorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}


async function handleDeleteEntity() {
  if (!selectedEntity.value) return
  isSubmitting.value = true
  try {
    await deleteFinancialEntity(selectedEntity.value.id)
    showSuccess('Entidad eliminada exitosamente')
    closeDeleteConfirm()
    await fetchEntities()
  } catch (err) {
    console.error('Error eliminando entidad:', err)
    const apiErrorMessage = err.data?.message || err.message || 'Error desconocido';
    showError(`Error al eliminar: ${apiErrorMessage}`)
    closeDeleteConfirm() // Cerrar modal incluso si hay error
  } finally {
    isSubmitting.value = false
  }
}

const formatTermRange = (minMonths, maxMonths) => {
  if (minMonths && maxMonths && minMonths !== maxMonths) return `${minMonths} a ${maxMonths} meses`;
  if (maxMonths && maxMonths > 0) return `Hasta ${maxMonths} meses`;
  if (minMonths && minMonths > 0) return `Desde ${minMonths} meses`;
  return 'No especificado';
}
const formatLoanRange = (minAmount, maxAmount) => {
  if (minAmount && maxAmount && minAmount !== maxAmount) {
    return `S/ ${minAmount.toLocaleString('es-PE')} - S/ ${maxAmount.toLocaleString('es-PE')}`;
  }
  if (maxAmount && maxAmount > 0) return `Hasta S/ ${maxAmount.toLocaleString('es-PE')}`;
  if (minAmount && minAmount > 0) return `Desde S/ ${minAmount.toLocaleString('es-PE')}`;
  return 'No especificado';
}

</script>

<style scoped>
.btn-primary { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50; }
.btn-danger { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150; }
.btn-secondary { @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150; }
</style>