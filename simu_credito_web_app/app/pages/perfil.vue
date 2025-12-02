<template>
  <div class="min-h-screen bg-gray-50/50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Configuración de Cuenta</h1>
        <p class="mt-2 text-sm text-gray-500">Gestiona tu información personal, datos de contacto y seguridad.</p>
      </div>

      <div class="lg:grid lg:grid-cols-12 lg:gap-x-8">

        <div class="lg:col-span-4 mb-6 lg:mb-0">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div class="p-6 flex flex-col items-center text-center">

              <div class="relative group">
                <div class="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-xl flex items-center justify-center text-4xl font-bold text-white select-none mb-4 transform transition-transform duration-300 group-hover:scale-105">
                  {{ auth.user.value?.initials || 'U' }}
                </div>
                <div class="absolute bottom-4 right-1 h-5 w-5 bg-green-400 border-4 border-white rounded-full"></div>
              </div>

              <h2 class="text-xl font-bold text-gray-900">{{ auth.user.value?.name }}</h2>
              <p class="text-sm font-medium text-gray-500 mb-4">{{ auth.user.value?.email }}</p>

              <div class="flex flex-wrap justify-center gap-2">
                <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  {{ auth.user.value?.role || 'Usuario' }}
                </span>
                <span class="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Activo
                </span>
              </div>
            </div>

            <div class="border-t border-gray-100 bg-gray-50/50 p-6">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resumen</h3>
              <ul class="space-y-3 text-sm text-gray-600">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  {{ form.companyName || 'Sin empresa registrada' }}
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {{ form.phoneNumber || 'Sin teléfono' }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">

          <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-10 bg-gray-200 rounded sm:col-span-2"></div>
            </div>
            <div class="h-px bg-gray-200 my-6"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>

          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <form @submit.prevent="handleSubmit">

              <div class="p-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <span class="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </span>
                  Información Personal
                </h3>

                <div class="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                  <div class="sm:col-span-2">
                    <label class="form-label">Correo Electrónico</label>
                    <div class="relative">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <input type="text" :value="form.email" disabled class="form-input pl-10 bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded border border-gray-200">No editable</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="firstName" class="form-label">Nombres <span class="text-red-500">*</span></label>
                    <input id="firstName" v-model="form.firstName" type="text" class="form-input" :class="{'error': errors.firstName}" />
                    <p v-if="errors.firstName" class="error-msg">{{ errors.firstName }}</p>
                  </div>

                  <div>
                    <label for="lastName" class="form-label">Apellidos <span class="text-red-500">*</span></label>
                    <input id="lastName" v-model="form.lastName" type="text" class="form-input" :class="{'error': errors.lastName}" />
                    <p v-if="errors.lastName" class="error-msg">{{ errors.lastName }}</p>
                  </div>

                  <div>
                    <label for="phoneNumber" class="form-label">Teléfono</label>
                    <div class="relative">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <input id="phoneNumber" v-model="form.phoneNumber" type="tel" class="form-input pl-10" placeholder="+51 999 999 999" />
                    </div>
                  </div>

                  <div>
                    <label for="companyName" class="form-label">Empresa</label>
                    <div class="relative">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <input id="companyName" v-model="form.companyName" type="text" class="form-input pl-10" placeholder="Nombre de tu empresa" />
                    </div>
                  </div>
                </div>
              </div>

              <hr class="border-gray-100" />

              <div class="p-8 bg-gray-50/30">
                <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <span class="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  Seguridad y Contraseña
                </h3>

                <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                  <div class="sm:col-span-2 max-w-md">
                    <label for="password" class="form-label">Nueva Contraseña</label>
                    <div class="relative mt-1">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      </div>
                      <input
                          id="password"
                          v-model="form.password"
                          :type="showPassword ? 'text' : 'password'"
                          class="form-input pl-10 pr-10"
                          placeholder="••••••••••••"
                          autocomplete="new-password"
                      />
                      <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none">
                        <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      </button>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">Deja este campo vacío si no deseas cambiar tu contraseña. Mínimo 6 caracteres.</p>
                  </div>
                </div>
              </div>

              <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                    type="button"
                    class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    @click="resetForm"
                    :disabled="isSaving"
                >
                  Cancelar
                </button>
                <button
                    type="submit"
                    :disabled="isSaving"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                  <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const auth = useAuth()
const { fetchUserProfile, updateProfile } = auth
const { showSuccess, showError } = useNotifications()

const isLoading = ref(true)
const isSaving = ref(false)
const showPassword = ref(false)
const errors = reactive({})

const form = reactive({
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  companyName: '',
  password: ''
})

const originalData = ref(null)

const loadData = async () => {
  isLoading.value = true
  try {
    const profile = await fetchUserProfile()
    if (profile) {
      form.email = profile.email || ''
      form.firstName = profile.firstName || ''
      form.lastName = profile.lastName || ''
      form.phoneNumber = profile.phoneNumber || ''
      form.companyName = profile.companyName || ''
      form.password = ''

      originalData.value = JSON.parse(JSON.stringify(form))
    }
  } catch (e) {
    showError('Error al cargar la información del perfil')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  if (originalData.value) {
    Object.assign(form, JSON.parse(JSON.stringify(originalData.value)))
    Object.keys(errors).forEach(key => delete errors[key])
    form.password = '' // Asegurar que el password se limpie
  }
}

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio'
    isValid = false
  }
  if (!form.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio'
    isValid = false
  }
  if (form.password && form.password.length < 6) {
    showError('La contraseña debe tener al menos 6 caracteres')
    isValid = false
  }
  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSaving.value = true
  try {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      companyName: form.companyName,
    }
    // Solo añadir password si tiene contenido
    if(form.password) {
      payload.password = form.password
    }

    await updateProfile(payload)

    // Actualizar originalData
    originalData.value = JSON.parse(JSON.stringify({ ...form, password: '' }))
    form.password = '' // Limpiar campo password después de guardar

    showSuccess('Perfil actualizado correctamente')
  } catch (error) {
    console.error(error)
    showError('Error al actualizar el perfil: ' + (error.data?.message || error.message))
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.form-input {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-shadow duration-200 border;
}
.form-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200;
}
.form-input.error {
  @apply border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500;
}
.error-msg {
  @apply mt-1 text-xs text-red-600;
}
</style>