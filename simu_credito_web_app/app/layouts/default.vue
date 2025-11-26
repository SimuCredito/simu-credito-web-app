<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="p-4 ">
        <h1 class="text-xl font-bold text-indigo-400 ">SimuCrédito</h1>
      </div>
      <nav class="mt-8">
        <NuxtLink
          to="/dashboard"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          :class="{ 'bg-gray-700 text-white border-r-4 border-indigo-400': $route.path === '/dashboard' }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
          </svg>
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/clientes"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          :class="{ 'bg-gray-700 text-white border-r-4 border-indigo-400': $route.path.startsWith('/clientes') }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          Clientes
        </NuxtLink>
        <NuxtLink
          to="/inmuebles"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          :class="{ 'bg-gray-700 text-white border-r-4 border-indigo-400': $route.path.startsWith('/inmuebles') }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          Inmuebles
        </NuxtLink>
        <NuxtLink
          to="/simulador"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          :class="{ 'bg-gray-700 text-white border-r-4 border-indigo-400': $route.path.startsWith('/simulador') }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Simulador
        </NuxtLink>
        <NuxtLink
          to="/configuracion"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          :class="{ 'bg-gray-700 text-white border-r-4 border-indigo-400': $route.path.startsWith('/configuracion') }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Configuración
        </NuxtLink>
      </nav>
      <div class="absolute bottom-0 w-64 p-4 space-y-2">
        <NuxtLink
          to="/feedback"
          class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          Enviar Feedback
        </NuxtLink>
        <NuxtLink
          to="/help"
          class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Ayuda y Soporte
        </NuxtLink>
        <button
          @click="handleLogout"
          class="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="main-content flex flex-col">
      <!-- Top bar -->
      <header class="bg-white shadow-sm px-6 py-4">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ pageTitle }}
          </h2>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                {{ auth.user.value?.initials || '?' }} </div>
              <span class="text-sm text-gray-700 hidden sm:block"> {{ auth.user.value?.name || 'User' }} </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
const auth = useAuth()

const { logout } = useAuth()
const route = useRoute()

const pageTitle = computed(() => {
  const path = route.path;
  if (path === '/dashboard') return 'Dashboard';
  if (path.startsWith('/clientes/nuevo')) return 'Clientes / Nuevo Cliente';
  if (path.startsWith('/clientes/')) return 'Clientes / Detalle';
  if (path.startsWith('/clientes')) return 'Clientes';
  if (path.startsWith('/inmuebles/nuevo')) return 'Inmuebles / Nuevo Inmueble';
  if (path.includes('/inmuebles/') && path.endsWith('/editar')) return 'Inmuebles / Editar Inmueble';
  if (path.startsWith('/inmuebles/')) return 'Inmuebles / Detalle';
  if (path.startsWith('/inmuebles')) return 'Inmuebles';
  if (path.startsWith('/simulador/resultados')) return 'Simulador / Resultados'; // <-- Añade esta línea
  if (path.startsWith('/simulador')) return 'Simulador'; // <-- Mueve esta línea después
  if (path.startsWith('/configuracion')) return 'Configuración';
  if (path.startsWith('/feedback')) return 'Feedback';
  if (path.startsWith('/help')) return 'Ayuda y Soporte';

  // Título por defecto si no coincide
  return 'SimuCrédito';
})

const handleLogout = () => {
  console.log('[LAYOUT] Logout button clicked')
  logout()
}
</script>