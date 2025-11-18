<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">

            <form @submit.prevent="handleSubmit">
              <div class="bg-white px-6 pt-5 pb-4">
                <h3 class="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                  Editar Valores para {{ rangeData.rangeName }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ rangeData.valueRangeText }}
                </p>
              </div>

              <div class="px-6 py-4 space-y-5 border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label :for="`bbp_trad_${rangeData.rangeName}`" class="form-label">BBP Tradicional (S/)</label>
                    <input :id="`bbp_trad_${rangeData.rangeName}`" v-model.number="form.tradicional.bonusAmount" type="number" step="1" class="input-field" />
                  </div>
                  <div>
                    <label :for="`bbp_sost_${rangeData.rangeName}`" class="form-label">BBP Sostenible (S/)</label>
                    <input :id="`bbp_sost_${rangeData.rangeName}`" v-model.number="form.sostenible.bonusAmount" type="number" step="1" class="input-field" />
                  </div>
                  <div>
                    <label :for="`bbp_int_${rangeData.rangeName}`" class="form-label">BBP Integrador (S/)</label>
                    <input :id="`bbp_int_${rangeData.rangeName}`" v-model.number="form.integrador.bonusAmount" type="number" step="1" class="input-field" />
                  </div>
                  <div>
                    <label :for="`bbp_int_sost_${rangeData.rangeName}`" class="form-label">BBP Integrador Sostenible (S/)</label>
                    <input :id="`bbp_int_sost_${rangeData.rangeName}`" v-model.number="form.integradorSostenible.bonusAmount" type="number" step="1" class="input-field" />
                  </div>
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
import { ref, watchEffect, reactive } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  rangeData: { // Este objeto es el Rango AGRUPADO
    type: Object,
    default: () => ({
      rangeName: '',
      valueRangeText: '',
      tradicional: null,
      sostenible: null,
      integrador: null,
      integradorSostenible: null,
    })
  }
})

const emit = defineEmits(['close', 'save'])

// Usamos reactive para un objeto anidado
const form = reactive({
  tradicional: { id: null, bonusAmount: 0 },
  sostenible: { id: null, bonusAmount: 0 },
  integrador: { id: null, bonusAmount: 0 },
  integradorSostenible: { id: null, bonusAmount: 0 }
})

// Rellenamos el formulario cuando las props cambian
watchEffect(() => {
  if (props.rangeData) {
    form.tradicional = { ...props.rangeData.tradicional }
    form.sostenible = { ...props.rangeData.sostenible }
    form.integrador = { ...props.rangeData.integrador }
    form.integradorSostenible = { ...props.rangeData.integradorSostenible }
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  // Devolvemos el objeto 'form' que contiene los IDs y los nuevos bonusAmount
  emit('save', form)
}
</script>

<style scoped>
/* Estilos importados de los componentes anteriores para consistencia */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.input-field {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>