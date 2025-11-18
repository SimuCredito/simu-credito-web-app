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
          <img
              :src="entity.photoUrl || getLogoFallback(entity.entityCode)"
              :alt="`Logo de ${entity.entityName}`"
              class="h-12 w-auto max-w-[100px] object-contain flex-shrink-0"
              @error="onImageError"
          >
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-900 text-lg truncate">{{ entity.entityName }}</h4>
          </div>
        </div>
        <dl class="mt-4 space-y-2 text-sm">
          <div>
            <dt class="text-gray-500">Tasa Efectiva Promedio:</dt>
            <dd class="font-semibold text-gray-800">{{ formatRate(entity) }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Período de Gracia:</dt>
            <dd class="font-semibold text-gray-800">
              {{ entity.periodoGraciaInfo || formatGracePeriod(entity.minTermMonths, entity.maxTermMonths) }}
            </dd>
          </div>
        </dl>
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
  uploadFinancialEntityPhoto,
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
    entities.value = Array.isArray(data) ? data : [] // Asegura que sea un array
  } catch (err) {
    console.error('Error cargando entidades:', err)
    error.value = 'No se pudieron cargar las entidades. ' + (err.data?.message || err.message)
    showError(error.value)
    entities.value = [] // Resetea a array vacío en caso de error
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
async function handleSaveEntity({ entityData, photoFile, photoUrl, entityId }) {
  isSubmitting.value = true
  console.log('handleSaveEntity called with:', { entityData, photoFile: photoFile ? 'File present' : 'No file', photoUrl, entityId })

  try {
    if (entityId) {
      // API para PUT no maneja foto, solo JSON
      console.log('Updating existing entity:', entityId)
      await updateFinancialEntity(entityId, entityData)
      showSuccess('Entidad actualizada exitosamente')
    } else {
      // Nuevo flujo: La foto ya fue subida en el paso 1, ahora crear entidad con photoUrl
      console.log('Creating new entity with photoUrl:', photoUrl)

      if (!photoUrl) {
        console.error('No photoUrl provided')
        showError('Debe subir una foto para la entidad financiera')
        return
      }

      // Crear entidad financiera con el photoUrl obtenido del paso 1
      const entityDataWithPhoto = {
        ...entityData,
        photoUrl: photoUrl
      }
      console.log('Entity data to send:', entityDataWithPhoto)

      await createFinancialEntity(entityDataWithPhoto)
      console.log('Entity created successfully')
      showSuccess('Entidad financiera creada exitosamente')
    }
    closeModal()
    await fetchEntities()
  } catch (err) {
    console.error('Error guardando entidad:', err)
    console.error('Entity error details:', err.data, err.message, err.status)
    showError(`Error al guardar: ${err.data?.message || err.message || 'Error desconocido'}`)
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
    showError(`Error al eliminar: ${err.data?.message || err.message || 'Error desconocido'}`)
    closeDeleteConfirm()
  } finally {
    isSubmitting.value = false
  }
}

// Helpers
const onImageError = (event) => {
  event.target.src = '/placeholder-logo.png' // Placeholder local
}
const getLogoFallback = (code) => {
  return `https://via.placeholder.com/100x40.png?text=${code || 'Logo'}`
}
const formatRate = (entity) => {
  if (entity.interestRateTea && entity.interestRateTea > 0) return `${entity.interestRateTea.toFixed(2)}% (TEA)`
  // La API no incluye interestRateTna en el GET /financial-entities, solo en GET /financial-entities/{id}
  // Podríamos mostrar TNA si estuviera disponible, o solo TEA
  // if (entity.interestRateTna && entity.interestRateTna > 0) return `${entity.interestRateTna.toFixed(2)}% (TNA)`
  return entity.interestRateTea ? `${entity.interestRateTea.toFixed(2)}% (TEA)` : 'No especificada'
}
const formatGracePeriod = (minMonths, maxMonths) => {
  // La API GET /financial-entities no devuelve min/max meses, usamos periodoGraciaInfo si existe
  return 'Revisar Detalle'; // Placeholder ya que no tenemos min/max aquí
}

</script>

<style scoped>
.btn-primary { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50; }
.btn-danger { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150; }
.btn-secondary { @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150; }
</style>