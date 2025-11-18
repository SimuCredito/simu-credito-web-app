<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">Cliente</label>
    <div class="relative">
      <select
        v-model="selectedClientId"
        @change="handleChange"
        class="block w-full rounded-lg bg-indigo-50 border border-gray-200 py-2 pl-3 pr-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Seleccionar cliente...</option>
        <option
          v-for="client in clients"
          :key="client.id"
          :value="client.id"
        >
          {{ client.holder.nombres }} {{ client.holder.apellidos }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClients } from '~/composables/useClients'

const { listClients } = useClients()

const clients = ref([])
const selectedClientId = ref('')

const emit = defineEmits(['client-selected'])

const handleChange = () => {
  const selectedClient = clients.value.find(client => client.id === selectedClientId.value)
  emit('client-selected', selectedClient)
}

onMounted(async () => {
  try {
    clients.value = await listClients()
  } catch (error) {
    console.error('Error loading clients:', error)
  }
})
</script>