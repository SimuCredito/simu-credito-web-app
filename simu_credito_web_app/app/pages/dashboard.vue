<template>
  <div>
    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-2 uppercase tracking-wide">Simulaciones Hoy</h3>
        <p class="text-3xl font-bold text-blue-600">{{ metrics.simulationsThisMonth || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-2 uppercase tracking-wide">Clientes Activos</h3>
        <p class="text-3xl font-bold text-green-600">{{ metrics.totalClients || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-2 uppercase tracking-wide">Créditos Cerrados (Mes)</h3>
        <p class="text-3xl font-bold text-purple-600">{{ metrics.completedSimulations || 0 }}</p>
      </div>
    </div>

    <!-- Empty State for Metrics -->
    <div v-if="!loading && (!metrics || Object.keys(metrics).length === 0)" class="bg-white p-8 rounded-lg shadow mb-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay métricas disponibles</h3>
      <p class="mt-1 text-sm text-gray-500">Las métricas del dashboard se mostrarán aquí cuando haya datos disponibles.</p>
    </div>

    <!-- Simulation Activity Graph Placeholder -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad de Simulaciones</h3>
      <div class="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p class="text-gray-500">Gráfico de actividad de simulaciones</p>
      </div>
    </div>

    <!-- Recent Activity & Potential Clients -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div v-if="loading" class="space-y-3">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-3 bg-gray-300 rounded w-12 ml-auto"></div>
            </div>
          </div>
        </div>
        <div v-else-if="recentActivity.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay actividad reciente</h3>
          <p class="mt-1 text-sm text-gray-500">La actividad reciente aparecerá aquí cuando se realicen acciones en el sistema.</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p class="text-sm text-gray-600">{{ activity.description }}</p>
            <span class="text-xs text-gray-400 ml-auto">{{ formatTime(activity.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Potential Clients -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Clientes Potenciales</h3>
        <div class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay clientes potenciales</h3>
          <p class="mt-1 text-sm text-gray-500">Los clientes potenciales aparecerán aquí cuando estén disponibles en el sistema.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define your page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

console.log('[DASHBOARD] Page loaded, checking authentication')
const { isAuthenticated } = useAuth()
console.log('[DASHBOARD] Authentication status:', isAuthenticated())

const { getMetrics, getRecentActivity } = useDashboard()

// Reactive data
const metrics = ref({})
const recentActivity = ref([])
const loading = ref(true)

// Fetch data on mount
onMounted(async () => {
  try {
    const [metricsData, activityData] = await Promise.all([
      getMetrics(),
      getRecentActivity(5)
    ])

    metrics.value = metricsData || {}
    recentActivity.value = activityData || []
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Don't show fallback data - let empty states handle it
    metrics.value = {}
    recentActivity.value = []
  } finally {
    loading.value = false
  }
})

// Helper function to format time
const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return 'Ahora'
  } else if (diffInHours < 24) {
    return `${diffInHours}h`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  }
}
</script>