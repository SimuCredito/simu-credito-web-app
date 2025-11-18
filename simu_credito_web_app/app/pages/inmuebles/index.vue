<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6">
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div class="sm:flex-auto">
        <div class="relative mt-2 max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-150 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
          <label for="search-property" class="sr-only">Filtrar propiedad</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
              id="search-property"
              v-model="searchQuery"
              type="search"
              placeholder="Filtrar por nombre, dirección o precio..."
              class="form-input pl-10 pr-4 bg-transparent focus:outline-none"
          />
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <NuxtLink
            to="/inmuebles/nuevo"
            class="btn-primary inline-flex items-center gap-x-2"
        >
          <svg class="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Agregar propiedad
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-200"></div>
        <div class="p-5 space-y-4">
          <div class="flex justify-between items-center">
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-5 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div class="h-7 bg-gray-200 rounded w-1/2"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredProperties.length === 0" class="text-center bg-white rounded-xl shadow-sm border border-gray-200 py-16 px-6">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m-3 1l-3 1m3-1V7.5M6.75 7.5V3m7.5 12V3m0 12h-3v-4.25m.5 4.25h-1" /></svg>
      <h3 class="mt-4 text-xl font-semibold text-gray-800">No hay inmuebles registrados</h3>
      <p class="mt-2 text-base text-gray-500">Añade tu primer inmueble para empezar a simular.</p>
      <div class="mt-6">
        <NuxtLink to="/inmuebles/nuevo" class="btn-primary inline-flex items-center gap-x-1.5">
          <svg class="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Añadir Inmueble
        </NuxtLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <NuxtLink
          v-for="property in filteredProperties"
          :key="property.id"
          :to="`/inmuebles/${property.id}`"
          class="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      >
        <div class="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
          <img
              :src="getPropertyImage(property)"
              alt="Fachada de inmueble"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
              loading="lazy"
              @error="handleImageError"
          />
        </div>
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              {{ property.builtArea || '?' }} m² &middot; {{ property.bedrooms ?? '?' }} dorm. &middot; {{ property.bathrooms ?? '?' }} baños
            </p>
            <span
                v-if="property.isSustainable"
                class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20"
            >
              Sostenible
            </span>
          </div>
          <p class="text-2xl font-extrabold text-indigo-600">S/ {{ property.propertyPrice?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A' }}</p>
          <div class="h-10">
            <h3 class="font-semibold text-gray-800 truncate" :title="property.nombreProyecto || 'Sin Nombre'">
              {{ property.nombreProyecto || 'Sin Nombre' }}
            </h3>
            <p class="text-sm text-gray-500 truncate" :title="property.ubicacionGeografica || 'Dirección no especificada'">
              {{ property.ubicacionGeografica || 'Dirección no especificada' }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProperties } from '~/composables/useProperties'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { listProperties } = useProperties()
const { showError } = useNotifications()

const properties = ref([])
const searchQuery = ref('')
const loading = ref(true)

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'

const filteredProperties = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return properties.value
  }
  return properties.value.filter(prop => {
    const name = (prop.nombreProyecto || '').toLowerCase()
    const address = (prop.ubicacionGeografica || '').toLowerCase()
    const price = (prop.propertyPrice || 0).toString()
    return name.includes(query) || address.includes(query) || price.includes(query)
  })
})

const getPropertyImage = (property) => {
  if (!property || !property.photos) {
    return DEFAULT_IMAGE
  }

  let photoList = []

  if (typeof property.photos === 'string') {
    try {
      photoList = JSON.parse(property.photos)
      if (typeof photoList === 'string') {
        photoList = [photoList]
      }
    } catch (e) {
      photoList = [property.photos]
    }
  } else if (Array.isArray(property.photos)) {
    photoList = property.photos
  }

  if (!Array.isArray(photoList) || photoList.length === 0) {
    return DEFAULT_IMAGE
  }

  const firstPhoto = photoList[0]

  if (typeof firstPhoto === 'string' && firstPhoto.trim() !== '') {
    return firstPhoto
  }

  if (typeof firstPhoto === 'object' && firstPhoto !== null) {
    return firstPhoto.firebaseUrl || firstPhoto.url || firstPhoto.src || DEFAULT_IMAGE
  }

  return DEFAULT_IMAGE
}

const handleImageError = (event) => {
  event.currentTarget.src = DEFAULT_IMAGE
}

onMounted(async () => {
  try {
    loading.value = true
    const fetchedProperties = await listProperties()
    properties.value = Array.isArray(fetchedProperties)
        ? fetchedProperties.filter(p => p != null)
        : []
  } catch (error) {
    showError('Error al cargar la lista de inmuebles.')
    console.error('Failed to load properties:', error)
    properties.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.form-input {
  @apply block w-full rounded-lg border-0 py-2.5 text-gray-900 bg-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 transition-all duration-150 ease-in-out sm:text-sm;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-150 ease-in-out;
}
</style>