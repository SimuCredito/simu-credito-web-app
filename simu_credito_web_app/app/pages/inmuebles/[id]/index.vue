<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div class="sm:flex-auto">
        <NuxtLink to="/inmuebles" class="btn-secondary inline-flex items-center gap-x-1 mb-2 sm:mb-0">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" /></svg>
          Volver a Inmuebles
        </NuxtLink>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-x-3">
        <button @click="openDeleteModal" class="btn-danger inline-flex items-center gap-x-1 bg-red-50 text-red-700 ring-red-200 hover:bg-red-100">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          Eliminar
        </button>
        <NuxtLink :to="`/inmuebles/${route.params.id}/editar`" class="btn-primary inline-flex items-center gap-x-1">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
          Editar Propiedad
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="mt-8 flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="error" class="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center">
      <p>{{ error }}</p>
      <NuxtLink to="/inmuebles" class="text-indigo-600 hover:underline mt-2 inline-block">Volver a la lista</NuxtLink>
    </div>

    <div v-else-if="property" class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
              :src="mainImage"
              alt="Imagen principal del inmueble"
              class="rounded-lg w-full h-auto object-cover aspect-video mb-4 border"
          >
          <div v-if="galleryImages.length > 0" class="grid grid-cols-5 gap-4">
            <img
                v-for="(img, index) in galleryImages.slice(0, 4)"
                :key="index"
                :src="img"
                @click="mainImage = img"
                class="rounded-lg cursor-pointer hover:opacity-80 transition-opacity aspect-square object-cover border"
                :class="{ 'ring-2 ring-indigo-500 ring-offset-2': mainImage === img }"
            >
            <div v-if="galleryImages.length > 4" class="relative rounded-lg bg-gray-800 flex items-center justify-center cursor-pointer aspect-square">
              <span class="text-white font-bold text-lg">+{{ galleryImages.length - 4 }}</span>
              <img :src="galleryImages[4]" class="rounded-lg absolute inset-0 opacity-40 object-cover border">
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <span v-if="property.estadoInmueble" class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {{ property.estadoInmueble }}
          </span>
          <h2 class="text-3xl font-bold text-gray-800">{{ property.nombreProyecto || 'Sin Nombre' }}</h2>
          <p class="text-3xl font-bold text-indigo-600">S/ {{ property.propertyPrice?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A' }}</p>
          <p class="text-gray-600">{{ property.ubicacionGeografica || 'Ubicación no especificada' }}</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <div class="text-center">
              <div class="flex justify-center mb-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p class="font-bold">{{ property.builtArea || '?' }} m²</p><p class="text-sm text-gray-500">Área Const.</p>
            </div>
            <div class="text-center">
              <div class="flex justify-center mb-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p class="font-bold">{{ property.bedrooms ?? '?' }}</p><p class="text-sm text-gray-500">Dormitorios</p>
            </div>
            <div class="text-center">
              <div class="flex justify-center mb-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p class="font-bold">{{ property.bathrooms ?? '?' }}</p><p class="text-sm text-gray-500">Baños</p>
            </div>
            <div class="text-center">
              <div class="flex justify-center mb-1">
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p class="font-bold">{{ property.garages ?? '?' }}</p><p class="text-sm text-gray-500">Cochera</p>
            </div>
          </div>
          <div v-if="property.isSustainable" class="p-4 rounded-lg bg-teal-50 border border-teal-200">
            <h4 class="font-semibold text-teal-800">Proyecto Ecoamigable</h4>
            <p class="text-sm text-teal-700 mt-1">Este inmueble califica para el Bono Sostenible (MiVivienda Verde).</p>
          </div>
        </div>
      </div>

      <div v-if="property.descripcion" class="mt-10 pt-6 border-t">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Descripción del Proyecto</h3>
        <p class="text-gray-600 whitespace-pre-line">{{ property.descripcion }}</p>
      </div>
    </div>

    <DeleteConfirmationModal
        :is-open="showDeleteModal"
        :message="deleteMessage"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProperties } from '~/composables/useProperties'
import { useNotifications } from '~/composables/useNotifications'
// Asegúrate que la ruta al componente sea correcta
import DeleteConfirmationModal from '~/components/DeleteConfirmationModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getProperty, deleteProperty } = useProperties()
const { showSuccess, showError } = useNotifications()

const property = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const deleteMessage = ref('')
const mainImage = ref('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80') // Imagen por defecto

const galleryImages = computed(() => {
  // Asegúrate de que `property.photos` sea un array, si no, usa un array vacío
  // La API lo devuelve como string, ¡necesitamos convertirlo!
  if (property.value?.photos && typeof property.value.photos === 'string') {
    try {
      // Intenta parsear si es un JSON string de un array
      const parsedPhotos = JSON.parse(property.value.photos);
      if (Array.isArray(parsedPhotos)) {
        mainImage.value = parsedPhotos[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80';
        return parsedPhotos;
      }
    } catch (e) {
      console.warn("Property photos is not a valid JSON array string:", property.value.photos);
      // Si no es un JSON array, asume que es una sola URL (o un string inválido)
      mainImage.value = property.value.photos || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80';
      return [property.value.photos].filter(Boolean); // Devuelve array con 1 elemento si existe
    }
  } else if (Array.isArray(property.value?.photos)) {
    // Si ya es un array (por si acaso)
    mainImage.value = property.value.photos[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80';
    return property.value.photos;
  }
  return []; // Devuelve array vacío si no hay fotos o el formato es inesperado
})


const fetchProperty = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await getProperty(route.params.id)
    if (!data) {
      throw new Error('Propiedad no encontrada.')
    }
    property.value = data
  } catch (err) {
    console.error('Error fetching property:', err)
    error.value = err.message || 'Error al cargar los datos de la propiedad.'
    if(err.response?.status === 404) {
      error.value = 'Propiedad no encontrada.'
    }
  } finally {
    loading.value = false
  }
}

const openDeleteModal = () => {
  deleteMessage.value = `¿Estás seguro? Se eliminará de forma permanente el inmueble "${property.value?.nombreProyecto}". Esta acción es irreversible.`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await deleteProperty(route.params.id)
    showSuccess('Propiedad eliminada exitosamente.')
    showDeleteModal.value = false
    router.push('/inmuebles')
  } catch (err) {
    console.error('Error deleting property:', err)
    showError('Error al eliminar la propiedad.')
    showDeleteModal.value = false // Cierra el modal incluso si hay error
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

onMounted(() => {
  fetchProperty()
})
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line; /* Mantiene saltos de línea y espacios */
}
.btn-danger { /* Estilo específico para el botón eliminar en esta vista */
  @apply bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100;
}
</style>