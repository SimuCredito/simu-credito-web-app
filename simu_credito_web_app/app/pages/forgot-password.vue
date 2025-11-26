<template>
  <div class="auth-bg">
    <div class="auth-card">
      <!-- Logo -->
      <div class="auth-logo"></div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Recuperar Contraseña
        </h2>
      </div>

      <!-- Success Message -->
      <div v-if="message" class="alert-success">
        ¡Revisa tu correo!
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <!-- Form -->
      <form v-if="!message" @submit.prevent="handleForgotPassword" class="space-y-6">
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
            v-model="email"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
          :disabled="loading"
        >
          <span v-if="loading">Enviando enlace...</span>
          <span v-else>Enviar enlace de recuperación</span>
        </button>

        <!-- Back to Login Link -->
        <div class="text-center">
          <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </form>

      <!-- Back to Login Button (after success) -->
      <div v-else class="text-center">
        <NuxtLink
          to="/login"
          class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
        >
          Volver al inicio de sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotifications } from '~/composables/useNotifications'

const { showSuccess, showError } = useNotifications()

const { apiFetch } = useApi()

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleForgotPassword = async () => {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.value }),
    })
    message.value = '¡Revisa tu correo!'
    showSuccess('Enlace de recuperación enviado correctamente.')
  } catch (err) {
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Error al enviar el enlace de recuperación'
      showError('No se pudo enviar el correo. Intente más tarde.')
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false
})

</script>