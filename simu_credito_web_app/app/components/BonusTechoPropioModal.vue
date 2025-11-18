<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

            <form @submit.prevent="handleSubmit">
              <div class="bg-white px-6 pt-5 pb-4">
                <h3 class="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                  Editar Parámetros de Techo Propio (AVN)
                </h3>
              </div>

              <div class="px-6 py-4 space-y-5 border-t border-gray-200">
                <div>
                  <label for="bfh_avn" class="form-label">Monto del Bono Familiar Habitacional (BFH)</label>
                  <input id="bfh_avn" v-model.number="form.bfh_avn.numericValue" type="number" step="1" class="input-field" />
                </div>
                <div>
                  <label for="ifm_max" class="form-label">Ingreso Familiar Mensual Máximo (S/)</label>
                  <input id="ifm_max" v-model.number="form.ifm_max.numericValue" type="number" step="1" class="input-field" />
                </div>
                <div>
                  <label for="viv_max" class="form-label">Valor Máximo de Vivienda de Interés Social (S/)</label>
                  <input id="viv_max" v-model.number="form.viv_max.numericValue" type="number" step="1" class="input-field" />
                </div>
              </div>

              <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                    :disabled="isLoading"
                >
                  <span v-if="isLoading">Guardando...</span>
                  <span v-else>Guardar Cambios</span>
                </button>
                <button
                    type="button"
                    class="btn-secondary mt-3 w-full sm:w-auto sm:mt-0"
                    @click="closeModal"
                    :disabled="isLoading"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watchEffect } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  // Recibimos los 3 parámetros como props
  techoPropioParams: {
    type: Object,
    default: () => ({
      bfh_avn: null,
      ifm_max: null,
      viv_max: null,
    })
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  bfh_avn: { id: null, numericValue: 0 },
  ifm_max: { id: null, numericValue: 0 },
  viv_max: { id: null, numericValue: 0 },
})

watchEffect(() => {
  if (props.techoPropioParams) {
    // Rellenamos el formulario (haciendo copias)
    form.bfh_avn = { ...props.techoPropioParams.bfh_avn }
    form.ifm_max = { ...props.techoPropioParams.ifm_max }
    form.viv_max = { ...props.techoPropioParams.viv_max }
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  // Devolvemos el objeto 'form' con los 3 IDs y sus nuevos valores
  emit('save', form)
}
</script>

<style scoped>
/* Estilos (iguales al modal anterior) */
.form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.input-field { @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150; }
.btn-primary { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50; }
.btn-secondary { @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>