<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-6">
      <p class="mt-1 text-sm text-gray-500">Administra las configuraciones generales de la aplicación, incluyendo entidades financieras, parámetros de bonos y valores globales.</p>
    </div>

    <div class="border-b border-gray-200 mb-8">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <NuxtLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.to"
            :class="[
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-150 focus:outline-none',
            isActiveTab(tab.to)
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          ]"
            :aria-current="isActiveTab(tab.to) ? 'page' : undefined"
        >
          {{ tab.name }}
        </NuxtLink>
      </nav>
    </div>

    <div class="mt-8">
      <NuxtPage /> </div>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

// Define meta para la página principal de configuración
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()

// Definimos las pestañas para la navegación
const tabs = [
  { name: 'Entidades Financieras', to: '/configuracion' }, // Ruta base
  { name: 'Parámetros de Bonos', to: '/configuracion/parametros-bonos' },
  { name: 'Valores Globales', to: '/configuracion/valores-globales' },
  // Podrías añadir más aquí (ej: { name: 'Usuarios', to: '/configuracion/usuarios' })
]

// Función para determinar si una pestaña está activa
// Compara la ruta actual con la ruta base de la pestaña
const isActiveTab = (tabPath) => {
  // La ruta base '/' debe coincidir exactamente con '/configuracion'
  if (tabPath === '/configuracion') {
    return route.path === '/configuracion'
  }
  // Las otras pestañas coinciden si la ruta actual empieza con su path
  return route.path.startsWith(tabPath)
}
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>