<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">

    <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity md:hidden"
    ></div>

    <div
        class="sidebar fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between p-4">
        <h1 class="text-xl font-bold text-indigo-400">SimuCrédito</h1>
        <button @click="closeSidebar" class="md:hidden text-gray-400 hover:text-white">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
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
            to="/perfil"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
            :class="{ 'bg-gray-700 text-white': $route.path === '/perfil' }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi Perfil
        </NuxtLink>
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

    <div class="main-content flex flex-col flex-1 w-0 overflow-hidden">
      <header class="bg-white shadow-sm px-4 py-4 sm:px-6 lg:px-8 z-10">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <button
                @click="toggleSidebar"
                type="button"
                class="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
            >
              <span class="sr-only">Abrir menú</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
              {{ pageTitle }}
            </h2>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                {{ auth.user.value?.initials || '?' }}
              </div>
              <span class="text-sm text-gray-700 hidden sm:block"> {{ auth.user.value?.name || 'User' }} </span>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 overflow-auto relative">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const { logout } = useAuth()
const route = useRoute()

// Estado para el menú lateral
const isSidebarOpen = ref(false)

// Funciones para controlar el menú
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Cerrar el menú automáticamente al cambiar de ruta (en móvil)
watch(() => route.path, () => {
  closeSidebar()
})

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
  if (path.startsWith('/simulador/resultados')) return 'Simulador / Resultados';
  if (path.startsWith('/simulador')) return 'Simulador';
  if (path.startsWith('/configuracion')) return 'Configuración';
  if (path.startsWith('/perfil')) return 'Mi Perfil';
  if (path.startsWith('/feedback')) return 'Feedback';
  if (path.startsWith('/help')) return 'Ayuda y Soporte';

  return 'SimuCrédito';
})

const handleLogout = () => {
  console.log('[LAYOUT] Logout button clicked')
  logout()
}
</script>