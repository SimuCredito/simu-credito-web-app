<template>
  <div class="auth-bg">
    <div class="auth-card">
      <!-- Logo -->
      <div class="auth-logo"></div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Crea tu cuenta
        </h2>
        <p class="text-gray-600">
          Para empezar...
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autocomplete="given-name"
            required
            :class="['input-field', { error: errors.firstName }]"
            placeholder="Ingresa tu nombre"
            v-model="form.firstName"
          />
          <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autocomplete="family-name"
            required
            :class="['input-field', { error: errors.lastName }]"
            placeholder="Ingresa tu apellido"
            v-model="form.lastName"
          />
          <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
        </div>

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
            :class="['input-field', { error: errors.email }]"
            placeholder="Ingresa tu email"
            v-model="form.email"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div class="password-input-container">
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              :class="['input-field pr-12', { error: errors.password }]"
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
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <!-- Phone Number (Optional) -->
        <div>
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
            Número de teléfono <span class="text-gray-500">(opcional)</span>
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            autocomplete="tel"
            :class="['input-field', { error: errors.phoneNumber }]"
            placeholder="+51 999 999 999"
            v-model="form.phoneNumber"
          />
          <p v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</p>
        </div>

        <!-- Company Name (Optional) -->
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la empresa <span class="text-gray-500">(opcional)</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autocomplete="organization"
            :class="['input-field', { error: errors.companyName }]"
            placeholder="Ingresa el nombre de tu empresa"
            v-model="form.companyName"
          />
          <p v-if="errors.companyName" class="error-message">{{ errors.companyName }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
          :disabled="loading"
        >
          <span v-if="loading">Creando cuenta...</span>
          <span v-else>Crear Cuenta</span>
        </button>

        <!-- Login Link -->
        <div class="text-center">
          <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">
            ¿Ya tienes cuenta? Inicia sesión
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useNotifications } from '~/composables/useNotifications'

const { register } = useAuth()
const router = useRouter()

const { showSuccess, showError } = useNotifications()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  companyName: '',
})

const showPassword = ref(false)
const errors = ref({})
const loading = ref(false)

const validateForm = () => {
  errors.value = {}

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'El nombre es requerido'
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'El apellido es requerido'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'El email es requerido'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Ingresa un email válido'
  }

  if (!form.value.password) {
    errors.value.password = 'La contraseña es requerida'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.value = {}

  try {
    await register(
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password,
      form.value.phoneNumber || undefined,
      form.value.companyName || undefined
    )

    showSuccess('Cuenta creada exitosamente. Por favor inicia sesión.')

    await router.push('/login')
  } catch (err) {
    if (err.response?.data?.message) {
      errors.value.general = err.response.data.message
      showError(err.response.data.message)
    } else {
      errors.value.general = 'Error al crear la cuenta'
      showError('Ocurrió un error inesperado al crear la cuenta.')
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