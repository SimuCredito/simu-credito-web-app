<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" @click="closeModal" aria-hidden="true"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">

            <form @submit.prevent="handleSubmit" novalidate>
              <div class="bg-white px-6 pt-5 pb-4 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                      {{ isEditMode ? 'Editar Entidad Financiera' : 'Añadir Entidad Financiera' }}
                    </h3>
                    <div v-if="!isEditMode" class="mt-2 flex items-center space-x-4">
                      <div class="flex items-center">
                        <div :class="['w-3 h-3 rounded-full', currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-300']"></div>
                        <span :class="['ml-2 text-sm', currentStep >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500']">Subir Foto</span>
                      </div>
                      <div class="flex items-center">
                        <div :class="['w-3 h-3 rounded-full', currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300']"></div>
                        <span :class="['ml-2 text-sm', currentStep >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500']">Datos de Entidad</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" @click="closeModal" class="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150" aria-label="Cerrar">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">

                <!-- Paso 1: Subir Foto -->
                <div v-if="currentStep === 1 && !isEditMode" class="text-center space-y-6">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-2">Paso 1: Subir Logo de la Entidad</h4>
                    <p class="text-sm text-gray-600">Selecciona la imagen del logo de la entidad financiera</p>
                  </div>

                  <div class="space-y-4">
                    <input id="photo" @change="handleFileChange" type="file" accept="image/png, image/jpeg, image/webp" class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"/>
                    <div class="mt-3 flex items-center justify-center gap-x-3">
                      <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="h-20 w-auto border rounded bg-white p-1 shadow-sm">
                      <div v-else class="h-20 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">Vista previa del logo</div>
                    </div>
                    <p v-if="errors.photo" class="error-message">{{ errors.photo }}</p>
                  </div>
                </div>

                <!-- Paso 2: Datos de la Entidad -->
                <div v-else class="space-y-6">
                  <div v-if="!isEditMode">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Paso 2: Información de la Entidad Financiera</h4>
                  </div>

                  <!-- Información Básica -->
                  <div class="space-y-6">
                    <div>
                      <h4 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Información Básica</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <label for="entityName" class="form-label">Nombre de la Entidad *</label>
                          <input id="entityName" v-model="formData.entityName" type="text" class="form-input" :class="{'error': errors.entityName}" required placeholder="Ej: Banco de Crédito del Perú" />
                          <p v-if="errors.entityName" class="error-message">{{ errors.entityName }}</p>
                        </div>
                        <div>
                          <label for="entityCode" class="form-label">Código (Opcional)</label>
                          <input id="entityCode" v-model="formData.entityCode" type="text" class="form-input" placeholder="Ej: BCP" />
                        </div>
                      </div>
                    </div>

                    <!-- Tasas de Interés -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Tasas de Interés</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <label for="interestRateTea" class="form-label">Tasa Efectiva Promedio (TEA) *</label>
                          <input id="interestRateTea" v-model.number="formData.interestRateTea" type="number" step="0.01" min="0" class="form-input" :class="{'error': errors.interestRateTea}" required placeholder="Ej: 9.50" />
                          <p v-if="errors.interestRateTea" class="error-message">{{ errors.interestRateTea }}</p>
                        </div>
                        <div>
                          <label for="interestRateTna" class="form-label">Tasa Nominal Anual (TNA) (Opcional)</label>
                          <input id="interestRateTna" v-model.number="formData.interestRateTna" type="number" step="0.01" min="0" class="form-input" placeholder="Ej: 9.00" />
                        </div>
                      </div>
                    </div>

                    <!-- Plazos y Montos -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Plazos y Montos</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <label for="minTermMonths" class="form-label">Plazo Mínimo (meses)</label>
                          <input id="minTermMonths" v-model.number="formData.minTermMonths" type="number" min="0" class="form-input" placeholder="Ej: 60 (5 años)" />
                        </div>
                        <div>
                          <label for="maxTermMonths" class="form-label">Plazo Máximo (meses)</label>
                          <input id="maxTermMonths" v-model.number="formData.maxTermMonths" type="number" min="0" class="form-input" placeholder="Ej: 300 (25 años)" />
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
                        <div>
                          <label for="minLoanAmount" class="form-label">Monto Mínimo de Préstamo</label>
                          <input id="minLoanAmount" v-model.number="formData.minLoanAmount" type="number" step="0.01" min="0" class="form-input" placeholder="Ej: 50000" />
                        </div>
                        <div>
                          <label for="maxLoanAmount" class="form-label">Monto Máximo de Préstamo</label>
                          <input id="maxLoanAmount" v-model.number="formData.maxLoanAmount" type="number" step="0.01" min="0" class="form-input" placeholder="Ej: 1000000" />
                        </div>
                      </div>
                    </div>

                    <!-- Costos y Capitalización -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Costos y Capitalización</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <label for="processingFeePercentage" class="form-label">Gastos de Formalización (%)</label>
                          <input id="processingFeePercentage" v-model.number="formData.processingFeePercentage" type="number" step="0.001" min="0" class="form-input" placeholder="Ej: 0.5" />
                        </div>
                        <div>
                          <label for="capitalizationPeriod" class="form-label">Periodo de Capitalización</label>
                          <select id="capitalizationPeriod" v-model="formData.capitalizationPeriod" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option value="DIARIO">Diario</option>
                            <option value="MENSUAL">Mensual</option>
                            <option value="TRIMESTRAL">Trimestral</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="ANUAL">Anual</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Seguros -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Seguros</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <label for="lifeInsurance" class="form-label">Seguro de Desgravamen (%)</label>
                          <input id="lifeInsurance" v-model.number="formData.lifeInsurancePercentage" type="number" step="0.001" min="0" class="form-input" placeholder="Ej: 0.032" />
                        </div>
                        <div>
                          <label for="propertyInsurance" class="form-label">Seguro del Inmueble (%)</label>
                          <input id="propertyInsurance" v-model.number="formData.propertyInsurancePercentage" type="number" step="0.001" min="0" class="form-input" placeholder="Ej: 0.025" />
                        </div>
                      </div>
                    </div>

                    <!-- Periodo de Gracia -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Periodo de Gracia</h4>
                      <div>
                        <label for="periodoGracia" class="form-label">Periodo de Gracia (meses)</label>
                        <input id="periodoGracia" v-model.number="formData.periodoGracia" type="number" min="0" class="form-input" placeholder="Ej: 6" />
                        <p class="text-xs text-gray-500 mt-1">Número de meses de periodo de gracia.</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-gray-100">
                <!-- Botones del Paso 1 -->
                <div v-if="currentStep === 1 && !isEditMode" class="flex w-full justify-between">
                  <button
                      type="button"
                      class="btn-secondary"
                      @click="closeModal"
                      :disabled="isUploadingPhoto"
                  >
                    Cancelar
                  </button>
                  <button
                      type="button"
                      class="btn-primary"
                      @click="nextStep"
                      :disabled="!photoFile || isUploadingPhoto"
                  >
                    <span v-if="isUploadingPhoto" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Subiendo...
                    </span>
                    <span v-else>Siguiente</span>
                  </button>
                </div>

                <!-- Botones del Paso 2 -->
                <div v-else class="sm:flex sm:flex-row-reverse w-full">
                  <button
                      type="submit"
                      class="btn-primary w-full sm:w-auto sm:ml-3"
                      :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="flex items-center">
                       <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Guardando...
                    </span>
                    <span v-else>{{ isEditMode ? 'Guardar Cambios' : 'Crear Entidad' }}</span>
                  </button>
                  <div v-if="!isEditMode" class="flex w-full sm:w-auto">
                    <button
                        type="button"
                        class="btn-secondary mt-3 w-full sm:w-auto sm:mt-0 mr-3"
                        @click="prevStep"
                        :disabled="isLoading"
                    >
                      Anterior
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
                  <button
                      v-else
                      type="button"
                      class="btn-secondary mt-3 w-full sm:w-auto sm:mt-0"
                      @click="closeModal"
                      :disabled="isLoading"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, reactive } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  entity: { type: Object, default: null }, // Datos iniciales para editar
  isLoading: { type: Boolean, default: false } // Estado de carga externo
})

// Estado para el proceso de dos pasos
const currentStep = ref(1) // 1: Subir foto, 2: Datos de entidad
const photoUrl = ref(null) // URL de la foto subida
const isUploadingPhoto = ref(false)

const emit = defineEmits(['close', 'save'])

// Importar la función de subida de fotos
const { uploadFinancialEntityPhoto } = useConfiguration()

// Función para crear el estado inicial/por defecto del formulario
const createDefaultFormData = () => ({
  entityName: '',
  entityCode: '',
  isActive: true, // Asumir activo por defecto
  maxLoanAmount: null,
  minLoanAmount: null,
  maxTermMonths: null,
  minTermMonths: null,
  interestRateTea: null,
  interestRateTna: null,
  capitalizationPeriod: null,
  processingFeePercentage: null,
  lifeInsurancePercentage: null,
  propertyInsurancePercentage: null,
  periodoGracia: null,
  photoUrl: null
})

const formData = reactive(createDefaultFormData())
const photoFile = ref(null) // Para el nuevo archivo de imagen
const imagePreview = ref(null) // Para la vista previa de la nueva imagen
const errors = reactive({}) // Para validación simple

const isEditMode = computed(() => !!props.entity)

// Observador para llenar el formulario cuando 'entity' (prop) cambia
watch(() => props.entity, (newEntity) => {
  if (props.isOpen) { // Solo actualiza si el modal está abierto o abriéndose
    // Limpiar errores previos
    Object.keys(errors).forEach(key => delete errors[key]);
    if (newEntity) {
      // Modo Edición: Copia profunda para evitar mutaciones reactivas no deseadas
      const cleanEntity = JSON.parse(JSON.stringify(newEntity))
      Object.assign(formData, createDefaultFormData(), cleanEntity) // Asegura todos los campos
      // Limpiamos foto y preview al abrir en modo edición
      photoFile.value = null
      imagePreview.value = null
      photoUrl.value = newEntity.photoUrl || null
      currentStep.value = 2 // En edición saltamos al paso 2
    } else {
      // Modo Añadir: Resetea al estado por defecto
      Object.assign(formData, createDefaultFormData())
      photoFile.value = null
      imagePreview.value = null
      photoUrl.value = null
      currentStep.value = 1 // Comenzamos en el paso 1
    }
  }
}, { immediate: true, deep: true }) // Deep para detectar cambios internos si fuera necesario

const handleFileChange = (event) => {
  const file = event.target.files[0]
  errors.photo = undefined // Clear previous photo error

  if (file && file.type.startsWith('image/')) {
    if (file.size > 2 * 1024 * 1024) { // Límite de 2MB
      errors.photo = 'El logo no debe exceder los 2MB.';
      photoFile.value = null;
      imagePreview.value = null;
    } else {
      photoFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => { imagePreview.value = e.target.result }
      reader.readAsDataURL(file)
    }
  } else {
    photoFile.value = null
    imagePreview.value = null
    if (file) { // Si se seleccionó un archivo pero no es imagen
      errors.photo = 'Por favor, selecciona un archivo de imagen válido (PNG, JPG, WEBP).';
    }
  }
  // Resetear input para permitir subir el mismo archivo si se elimina y se vuelve a agregar
  event.target.value = ''
}

const clearPhoto = () => {
  photoFile.value = null;
  imagePreview.value = null;
  formData.photoUrl = null; // También elimina la URL existente si la hay
  errors.photo = undefined; // Limpia error de foto
  // Si tienes un input file con ref, puedes resetearlo también:
  // const fileInput = document.getElementById('photo');
  // if (fileInput) fileInput.value = '';
}


const closeModal = () => {
  if (!props.isLoading && !isUploadingPhoto.value) {
    emit('close')
  }
}

const nextStep = async () => {
  if (!photoFile.value) return

  isUploadingPhoto.value = true
  try {
    console.log('Uploading photo in nextStep...')
    photoUrl.value = await uploadFinancialEntityPhoto(photoFile.value)
    console.log('Photo uploaded successfully, URL:', photoUrl.value)
    currentStep.value = 2
  } catch (error) {
    console.error('Error uploading photo:', error)
    // Error ya se maneja en uploadFinancialEntityPhoto
  } finally {
    isUploadingPhoto.value = false
  }
}

const prevStep = () => {
  currentStep.value = 1
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Limpiar errores previos
  let isValid = true;

  if (!formData.entityName?.trim()) {
    errors.entityName = 'El nombre de la entidad es obligatorio.';
    isValid = false;
  }
  if (formData.interestRateTea === null || formData.interestRateTea === undefined || formData.interestRateTea < 0) {
    errors.interestRateTea = 'La tasa TEA es obligatoria y debe ser >= 0.';
    isValid = false;
  }
  // Añadir más validaciones según sea necesario (formato de número, rangos, etc.)

  return isValid;
}


const handleSubmit = () => {
  if (!validateForm()) return;

  console.log('handleSubmit called, photoUrl value:', photoUrl.value)

  // Preparamos los datos a enviar.
  // La API POST espera application/json con photoUrl incluido
  // La API PUT espera application/json solo con los datos de la entidad
  const { id, createdAt, updatedAt, photoUrl: formPhotoUrl, ...entityJsonData } = formData

  // Siempre incluir la photoUrl: para nuevas entidades usamos la subida, para edición mantenemos la existente
  if (!isEditMode.value && photoUrl.value) {
    // Nueva entidad: usar la photoUrl del paso 1
    entityJsonData.photoUrl = photoUrl.value
  } else if (isEditMode.value) {
    // Edición: siempre mantener la photoUrl existente (nunca se actualiza)
    entityJsonData.photoUrl = formPhotoUrl
  }

  // Convertimos números vacíos (que pueden ser null o '') a null explícitamente si la API lo requiere
  entityJsonData.maxLoanAmount = entityJsonData.maxLoanAmount || null;
  entityJsonData.minLoanAmount = entityJsonData.minLoanAmount || null;
  entityJsonData.maxTermMonths = entityJsonData.maxTermMonths || null;
  entityJsonData.minTermMonths = entityJsonData.minTermMonths || null;
  entityJsonData.interestRateTna = entityJsonData.interestRateTna || null;
  entityJsonData.processingFeePercentage = entityJsonData.processingFeePercentage || null;
  entityJsonData.lifeInsurancePercentage = entityJsonData.lifeInsurancePercentage || null;
  entityJsonData.propertyInsurancePercentage = entityJsonData.propertyInsurancePercentage || null;
  entityJsonData.capitalizationPeriod = entityJsonData.capitalizationPeriod || null;
  entityJsonData.periodoGracia = entityJsonData.periodoGracia || null;
  entityJsonData.interestRateTea = Number(entityJsonData.interestRateTea) || 0; // Asegurar que sea número

  // Asegurar que photoUrl sea string o null
  entityJsonData.photoUrl = typeof entityJsonData.photoUrl === 'string' ? entityJsonData.photoUrl : null;

  console.log('Final entityData to send:', entityJsonData)

  emit('save', {
    entityData: entityJsonData,
    photoUrl: photoUrl.value, // URL de la foto subida en el paso 1
    entityId: isEditMode.value ? props.entity?.id : null
  })
}

// Fallback visual si la URL de la imagen existente falla
const onImageError = (event) => {
  event.target.src = '/placeholder-logo.png'
}
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.form-input { @apply block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150; }
.form-select { @apply block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 cursor-pointer; }
.form-input.error { @apply border-red-500 ring-red-500 focus:ring-red-500 focus:border-red-500; }
.error-message { @apply text-red-600 text-xs mt-1; }

.btn-primary { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50; }
.btn-secondary { @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150; }

.modal-backdrop { @apply fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50; }

/* Transición del Modal */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>