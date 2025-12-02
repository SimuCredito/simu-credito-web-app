<template>
  <div class="min-h-screen bg-gray-50/50">

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Hola, {{ auth.user.value?.name?.split(' ')[0] || 'Usuario' }} 👋</h1>
      <p class="text-sm text-gray-500 mt-1">Aquí tienes el resumen de tu actividad reciente.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-indigo-100 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Simulaciones Hoy</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {{ metrics.simulationsThisMonth || 0 }}
            </p>
          </div>
          <div class="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
            <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Activo
          </span>
          <span class="text-gray-400 ml-2">en el mes actual</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-green-100 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Clientes Registrados</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {{ metrics.totalClients || 0 }}
            </p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-gray-400">Total histórico</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-purple-100 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Créditos Cerrados</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {{ metrics.completedSimulations || 0 }}
            </p>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
            <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-gray-400">Operaciones completadas</span>
        </div>
      </div>
    </div>

    <div v-if="!loading && (!metrics || Object.keys(metrics).length === 0)" class="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">Aún no hay métricas</h3>
      <p class="mt-1 text-gray-500 max-w-sm mx-auto">Comienza a realizar simulaciones y registrar clientes para ver tus estadísticas aquí.</p>
      <div class="mt-6">
        <NuxtLink to="/simulador" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Nueva Simulación
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="lg:col-span-2 space-y-8">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900">Actividad de Simulaciones</h3>
            <select v-model="chartPeriod" class="text-xs border-gray-300 rounded-md text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer">
              <option value="week">Últimos 7 días</option>
              <option value="month">Este mes</option>
            </select>
          </div>

          <div class="h-72 w-full relative">
            <Bar v-if="!chartLoading" :data="chartData" :options="chartOptions" />
            <div v-else class="h-full w-full flex items-center justify-center">
              <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Actividad Reciente</h3>
            <NuxtLink to="/simulador" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Ver todo</NuxtLink>
          </div>

          <div v-if="loading" class="p-6 space-y-4">
            <div v-for="n in 4" :key="n" class="animate-pulse flex items-center space-x-4">
              <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          <div v-else-if="recentActivity.length === 0" class="p-12 text-center">
            <p class="text-gray-500 text-sm">No hay actividad reciente para mostrar.</p>
          </div>

          <div v-else class="divide-y divide-gray-50">
            <div v-for="activity in recentActivity" :key="activity.id" class="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4">
              <div class="flex-shrink-0 mt-1">
                <span class="inline-flex items-center justify-center h-10 w-10 rounded-full" :class="getActivityColorClass(activity.type)">
                  <component :is="getActivityIcon(activity.type)" class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ getActivityTitle(activity) }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  {{ activity.description }}
                </p>
                <div class="mt-1 flex items-center text-xs text-gray-400">
                  <svg class="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(activity.createdAt) }}
                </div>
              </div>

              <div v-if="activity.amount" class="text-right">
                <p class="text-sm font-bold text-gray-900">S/ {{ activity.amount.toLocaleString() }}</p>
                <span v-if="activity.status" class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 capitalize">
                  {{ activity.status.toLowerCase() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">

        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-md p-6 text-white overflow-hidden relative">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-lg"></div>

          <h3 class="text-lg font-bold relative z-10 mb-4">Accesos Rápidos</h3>
          <div class="space-y-3 relative z-10">
            <NuxtLink to="/clientes/nuevo" class="flex items-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
              <div class="bg-white/20 p-2 rounded-md mr-3">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <span class="font-medium">Nuevo Cliente</span>
            </NuxtLink>
            <NuxtLink to="/inmuebles/nuevo" class="flex items-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
              <div class="bg-white/20 p-2 rounded-md mr-3">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <span class="font-medium">Nuevo Inmueble</span>
            </NuxtLink>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Clientes Potenciales</h3>
            <span class="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">Top</span>
          </div>

          <div class="text-center py-8">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-900">Lista vacía</p>
            <p class="text-xs text-gray-500 mt-1">Los clientes con alta probabilidad de cierre aparecerán aquí.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useDashboard } from '~/composables/useDashboard'
import { CalculatorIcon, UserGroupIcon, HomeIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

// Librerías de gráficos
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const auth = useAuth()
// IMPORTANTE: Asegúrate de haber actualizado el composable con getSimulationActivity
const { getMetrics, getRecentActivity, getSimulationActivity } = useDashboard()

const metrics = ref({})
const recentActivity = ref([])
const loading = ref(true)

// --- LÓGICA DEL GRÁFICO REAL ---
const chartPeriod = ref('week') // 'week' o 'month'
const activityStats = ref([])
const chartLoading = ref(false)

const loadChartData = async () => {
  chartLoading.value = true
  try {
    const data = await getSimulationActivity(chartPeriod.value)
    activityStats.value = data || []
  } catch (e) {
    console.error('Error cargando gráfico:', e)
    activityStats.value = []
  } finally {
    chartLoading.value = false
  }
}

// Watch para recargar cuando cambia el select
watch(chartPeriod, () => {
  loadChartData()
})

const chartData = computed(() => {
  // Si no hay datos, mostrar vacío
  if (!activityStats.value || activityStats.value.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = activityStats.value.map(item => {
    // La fecha viene como string YYYY-MM-DD.
    // Usamos split para evitar problemas de zona horaria con new Date()
    const [year, month, day] = item.date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)

    return dateObj.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: 'numeric',
      month: chartPeriod.value === 'month' ? 'short' : undefined
    })
  })

  const data = activityStats.value.map(item => item.count)

  return {
    labels,
    datasets: [
      {
        label: 'Simulaciones',
        backgroundColor: '#4f46e5', // Indigo-600
        borderRadius: 4,
        hoverBackgroundColor: '#4338ca',
        data: data
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => `${context.raw} Simulaciones`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: {
        stepSize: 1,
        font: { size: 11 },
        precision: 0 // Evita decimales en conteos (e.g. 0.5 simulaciones)
      }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } }
    }
  }
}
// ------------------------------

// Configuración visual de actividad
const getActivityConfig = (type) => {
  switch(type) {
    case 'SIMULATION': return { icon: CalculatorIcon, colorClass: 'bg-blue-100 text-blue-600' }
    case 'CLIENT': return { icon: UserGroupIcon, colorClass: 'bg-green-100 text-green-600' }
    case 'PROPERTY': return { icon: HomeIcon, colorClass: 'bg-purple-100 text-purple-600' }
    default: return { icon: DocumentTextIcon, colorClass: 'bg-gray-100 text-gray-600' }
  }
}

const getActivityIcon = (type) => getActivityConfig(type).icon
const getActivityColorClass = (type) => getActivityConfig(type).colorClass
const getActivityTitle = (activity) => {
  return activity.type === 'SIMULATION' ? 'Simulación de Crédito' :
      activity.type === 'CLIENT' ? 'Nuevo Cliente' :
          activity.type === 'PROPERTY' ? 'Propiedad Registrada' : 'Notificación';
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'Hace un momento'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
  if (diffInHours < 24) return `Hace ${diffInHours} h`
  if (diffInDays === 1) return 'Ayer'
  return `Hace ${diffInDays} días`
}

onMounted(async () => {
  try {
    // Carga inicial paralela
    const [metricsData, activityData] = await Promise.all([
      getMetrics(),
      getRecentActivity(5),
      loadChartData() // Cargamos también el gráfico
    ])

    metrics.value = metricsData || {}
    recentActivity.value = activityData || []
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    metrics.value = {}
    recentActivity.value = []
  } finally {
    loading.value = false
  }
})
</script>