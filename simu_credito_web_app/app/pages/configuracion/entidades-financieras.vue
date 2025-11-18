<template>
  <div>
    <div class="flex justify-end mb-6">
      <button
          @click="openAddModal"
          type="button"
          class="btn-primary inline-flex items-center"
      >
        <span class="bg-indigo-700 rounded-md p-1.5 mr-2 -ml-1">
          <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        Agregar Entidad Financiera
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-20">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-500 mt-4">Cargando entidades financieras...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>

    <div v-else-if="entities.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
          v-for="entity in entities"
          :key="entity.id"
          class="bg-white rounded-lg shadow-md p-5 flex space-x-4"
      >
        <img
            :src="entity.photoUrl || 'https://via.placeholder.com/100x60.png?text=Logo'"
            :alt="`Logo de ${entity.entityName}`"
            class="w-24 h-16 object-contain border border-gray-200 rounded-md bg-gray-50"
            @error="onImageError"
        >

        <div class="flex-1 flex justify-between">
          <div class="space-y-1">
            <h4 class="text-lg font-bold text-gray-900">{{ entity.entityName }}</h4>
            <p class="text-sm text-gray-600">
              Tasa Efectiva Promedio: <strong>{{ entity.interestRateTea }}%</strong>
            </p>
            <p class="text-sm text-gray-600">
              Plazo: {{ entity.minTermMonths || 'N/A' }} a {{ entity.maxTermMonths || 'N/A' }} meses
            </p>
          </div>

          <div class="flex space-x-2 flex-shrink-0">
            <button @click="openEditModal(entity)" class="text-gray-400 hover:text-indigo-600" title="Editar">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button @click="openDeleteConfirm(entity)" class="text-gray-400 hover:text-red-600" title="Eliminar">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-lg shadow-md">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay entidades financieras</h3>
      <p class="mt-1 text-sm text-gray-500">Agrega la primera entidad financiera para comenzar.</p>
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
import { ref, onMounted } from 'vue'
import { useConfiguration } from '~/composables/useConfiguration'
import { useNotifications } from '~/composables/useNotifications'
// Importamos los componentes de modales
import FinancialEntityModal from '~/components/FinancialEntityModal.vue'
import DeleteConfirmationModal from '~/components/DeleteConfirmationModal.vue'

const {
  listFinancialEntities,
  createFinancialEntity,
  updateFinancialEntity,
  deleteFinancialEntity
} = useConfiguration()
const { showSuccess, showError } = useNotifications()

// Estado de la UI
const entities = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

// Estado de Modales
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedEntity = ref(null) // Para Edición
const deleteMessage = ref('')

// --- Carga de Datos ---
const fetchEntities = async () => {
  try {
    isLoading.value = true
    error.value = null
    entities.value = await listFinancialEntities()
  } catch (err) {
    console.error('Error cargando entidades:', err)
    error.value = 'No se pudieron cargar las entidades. ' + err.message
    showError(error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchEntities)

// --- Lógica de Modales ---
const closeModal = () => {
  isModalOpen.value = false
  selectedEntity.value = null
}

const openAddModal = () => {
  selectedEntity.value = null // Asegura modo "Añadir"
  isModalOpen.value = true
}

const openEditModal = (entity) => {
  selectedEntity.value = entity // Pasa la entidad para "Editar"
  isModalOpen.value = true
}

const closeDeleteConfirm = () => {
  isDeleteModalOpen.value = false
  selectedEntity.value = null
}

const openDeleteConfirm = (entity) => {
  selectedEntity.value = entity
  deleteMessage.value = `¿Estás seguro de eliminar la entidad "${entity.entityName}"? Esta acción no se puede deshacer.`
  isDeleteModalOpen.value = true
}

// --- Lógica CRUD ---
const handleSaveEntity = async ({ entityData, photoFile, entityId }) => {
  isSubmitting.value = true
  try {
    if (entityId) {
      // --- Modo Edición (PUT) ---
      // El endpoint de PUT es JSON, no FormData.
      // Si el API de PUT también aceptara FormData, la lógica cambiaría.
      // Asumiendo que PUT es JSON y la foto se actualiza por separado (o no se actualiza en este modal)
      // NOTA: El API de PUT que diste SÍ es JSON y no acepta foto.
      // La foto solo se sube en el POST.
      await updateFinancialEntity(entityId, entityData)
      showSuccess('Entidad actualizada exitosamente')
    } else {
      // --- Modo Creación (POST) ---
      await createFinancialEntity(entityData)
      showSuccess('Entidad creada exitosamente')
    }

    closeModal()
    await fetchEntities() // Recarga la lista

  } catch (err) {
    console.error('Error guardando entidad:', err)
    showError('Error al guardar: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteEntity = async () => {
  if (!selectedEntity.value) return

  isSubmitting.value = true
  try {
    await deleteFinancialEntity(selectedEntity.value.id)
    showSuccess('Entidad eliminada exitosamente')
    closeDeleteConfirm()
    await fetchEntities() // Recarga la lista
  } catch (err) {
    console.error('Error eliminando entidad:', err)
    showError('Error al eliminar: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

// Fallback de imagen
const onImageError = (event) => {
  event.target.src = '/placeholder-logo.png'
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50;
}
</style>