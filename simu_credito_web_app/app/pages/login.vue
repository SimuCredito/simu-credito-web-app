<template>
  <div class="auth-bg">
    <div class="auth-card">
      <!-- Logo -->
      <div class="auth-logo"></div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">
          Inicia sesión
        </h2>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="input-field"
            placeholder="Ingresa tu email"
            v-model="form.email"
          />
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <NuxtLink to="/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-500">
              ¿Olvidaste tu contraseña?
            </NuxtLink>
          </div>
          <div class="password-input-container">
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="input-field pr-12"
              placeholder="Ingresa tu contraseña"
              v-model="form.password"
            />
            <button
              type="button"
              class="password-toggle-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <svg v-if="showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
          :disabled="loading"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>Iniciar Sesión</span>
        </button>

        <!-- Register Link -->
        <div class="text-center">
          <NuxtLink to="/register" class="text-indigo-600 hover:text-indigo-500 font-medium">
            Crear cuenta
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { login } = useAuth()
const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

if (route.query.error === 'session_expired') {
  error.value = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
}

const handleLogin = async () => {
  console.log('[LOGIN] Attempting login with email:', form.value.email)
  loading.value = true
  error.value = ''

  try {
    console.log('[LOGIN] Calling login API')
    await login(form.value.email, form.value.password)
    console.log('[LOGIN] Login successful, checking redirect')
    const redirectTo = route.query.redirect || '/dashboard'
    console.log('[LOGIN] Redirecting to:', redirectTo)
    await router.push(redirectTo)
  } catch (err) {
    console.log('[LOGIN] Login failed:', err)
    // Handle API error response
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Credenciales incorrectas'
    }
  } finally {
    loading.value = false
  }
}

defineNuxtRouteMiddleware(() => {
  if (process.client) { // Solo necesitamos esto en el cliente
    const { isAuthenticated } = useAuth()
    if (isAuthenticated()) {
      return navigateTo('/dashboard')
    }
  }
})

definePageMeta({
  layout: false
})

</script>