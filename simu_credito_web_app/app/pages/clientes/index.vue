<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <div class="mt-2 max-w-lg app-form-control relative">
          <label for="search" class="sr-only">Buscar clientes</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
              id="search"
              v-model="searchQuery"
              type="search"
              placeholder="Buscar por nombre o documento..."
              class="app-input block w-full rounded-md border-gray-300 shadow-sm sm:text-sm pl-10 py-2 transition-all duration-150 ease-in-out focus:outline-none focus:ring-indigo-600 focus:ring-2 focus:py-2.5"
          />
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <NuxtLink
            to="/clientes/nuevo"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Cliente
        </NuxtLink>
      </div>
    </div>

    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Documento</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado Civil</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ingreso Familiar</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha de Registro</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {{ client.holder.nombres }} {{ client.holder.apellidos }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ client.holder.documentNumber }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ getMaritalStatusName(client.holder.maritalStatusId) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  S/ {{ client.familyNetIncome?.toLocaleString() || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ formatDate(client.registrationDate) }}
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <NuxtLink
                      :to="`/clientes/${client.id}`"
                      class="text-indigo-600 hover:text-indigo-900"
                  >
                    Ver<span class="sr-only">, {{ client.holder.nombres }}</span>
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0 && !loading">
                <td colspan="6" class="py-8 text-center text-sm text-gray-500">
                  No hay clientes registrados aún.
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="mt-8 text-center">
      <p class="text-gray-500">Cargando clientes...</p>
    </div>
    <NuxtPage/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClients } from '~/composables/useClients'

// Define meta para la página
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { listClients } = useClients()

// Estado
const clients = ref([])
const searchQuery = ref('')
const loading = ref(true)

// Datos de catálogo para mostrar nombres
const maritalStatuses = [
  { id: 1, name: 'Soltero(a)' },
  { id: 2, name: 'Casado(a)' },
  { id: 3, name: 'Conviviente' },
  { id: 4, name: 'Divorciado(a)' },
  { id: 5, name: 'Viudo(a)' }
]

// Funciones auxiliares
const getMaritalStatusName = (id) => {
  const status = maritalStatuses.find(s => s.id === id)
  return status ? status.name : 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-PE')
}

const filteredClients = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return clients.value
  return clients.value.filter(client => {
    const holder = client.holder || {}
    const fullName = `${holder.nombres || ''} ${holder.apellidos || ''}`.toLowerCase()
    const doc = (holder.documentNumber || '').toLowerCase()
    return fullName.includes(q) || doc.includes(q)
  })
})

// Cargar clientes al montar el componente
onMounted(async () => {
  try {
    const result = await listClients()
    clients.value = result || []
  } catch (error) {
    console.error('Error loading clients:', error)
    clients.value = []
  } finally {
    loading.value = false
  }
})
</script>