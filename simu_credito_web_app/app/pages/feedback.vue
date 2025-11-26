<template>
  <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-900">Danos tu opinión</h2>
        <p class="mt-1 text-sm text-gray-500">Tu retroalimentación es importante para mejorar la experiencia en SimuCrédito.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Califica tu experiencia</label>
          <div class="flex items-center gap-2">
            <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="form.rating = star"
                class="focus:outline-none transition-transform hover:scale-110 group"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-10 w-10 transition-colors duration-200"
                  :class="star <= form.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 group-hover:text-yellow-200'"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          <p v-if="form.rating > 0" class="text-sm text-indigo-600 mt-2 font-medium">
            {{ getRatingLabel(form.rating) }}
          </p>
        </div>

        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Tipo de comentario</label>
          <select id="type" v-model="form.type" class="form-input">
            <option value="suggestion">Sugerencia</option>
            <option value="bug">Reportar un error</option>
            <option value="compliment">Felicitación</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="form-input resize-none"
              placeholder="Cuéntanos más detalles sobre tu experiencia o lo que te gustaría ver..."
              required
          ></textarea>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-100">
          <button
              type="submit"
              class="btn-primary flex items-center"
              :disabled="isSubmitting || !form.message"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>Enviar comentarios</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { showSuccess } = useNotifications()

const isSubmitting = ref(false)
const form = reactive({
  rating: 0,
  type: 'suggestion',
  message: ''
})

const getRatingLabel = (rating) => {
  const labels = ['Mala', 'Regular', 'Buena', 'Muy Buena', 'Excelente'];
  return labels[rating - 1] || '';
}

const handleSubmit = async () => {
  if (!form.message.trim()) return

  isSubmitting.value = true

  // Simulación de llamada a API
  await new Promise(resolve => setTimeout(resolve, 1500))

  console.log('Feedback sent:', { ...form })
  showSuccess('¡Gracias por tus comentarios! Los hemos recibido correctamente.')

  // Reset form
  form.rating = 0
  form.type = 'suggestion'
  form.message = ''
  isSubmitting.value = false
}
</script>

<style scoped>
.form-input {
  @apply block w-full rounded-lg border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 border;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>