<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

      <div v-if="loadingInitial" class="flex justify-center items-center h-[calc(100vh-200px)]">
        <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="initialError" class="mt-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center shadow">
        <p class="font-medium">Error al cargar la propiedad</p>
        <p class="text-sm mt-1">{{ initialError }}</p>
        <NuxtLink to="/inmuebles" class="btn-secondary-light mt-4 text-sm">Volver a la lista</NuxtLink>
      </div>

      <div v-else class="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Editar Propiedad</h1>
          <p class="mt-1 text-sm text-gray-600">Actualice la información del inmueble: {{ property?.nombreProyecto || 'N/A' }}</p>
        </div>

        <nav aria-label="Progress" class="px-8 py-6 border-b border-gray-200">
          <ol role="list" class="flex items-center justify-center space-x-8">
            <li v-for="(step, stepIdx) in steps" :key="step.title" class="relative flex-1">
              <div class="relative flex flex-col items-center">
                <div v-if="stepIdx > 0" class="absolute inset-0 top-5 left-0 -translate-x-1/2 h-0.5 w-full" aria-hidden="true">
                  <div class="absolute h-0.5 w-full transition-colors duration-300" :class="stepStatus(stepIdx) === 'upcoming' ? 'bg-gray-200' : 'bg-indigo-600'"></div>
                </div>
                <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 z-10" :class="stepStatusClass(stepIdx)">
                  <svg v-if="stepStatus(stepIdx) === 'complete'" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                  </svg>
                  <component v-else :is="step.icon" class="h-6 w-6" :class="stepStatus(stepIdx) === 'current' ? 'text-indigo-600' : 'text-gray-400'" />
                </span>
                <span class="mt-3 text-sm font-medium transition-colors duration-300 text-center" :class="stepStatus(stepIdx) === 'current' ? 'text-indigo-600' : 'text-gray-900'">{{ step.title }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div class="min-h-[600px] px-8 py-10">
          <transition name="fade" mode="out-in">
            <div v-if="currentStep === 0" key="step1" class="space-y-10">
              <section class="space-y-6">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center"><component :is="steps[0].icon" class="w-4 h-4 text-indigo-600"/></div>
                  <h3 class="text-lg font-semibold text-gray-900">Identificación del Proyecto</h3>
                </div>
                <div class="grid grid-cols-1 gap-6">
                  <div>
                    <label for="nombreProyecto" class="form-label">Nombre del Proyecto *</label>
                    <input id="nombreProyecto" v-model="formData.nombreProyecto" type="text" class="form-input" :class="{ 'error': errors.nombreProyecto }" placeholder="Ej: Condominio Los Alamos"/>
                    <p v-if="errors.nombreProyecto" class="error-message">{{ errors.nombreProyecto }}</p>
                  </div>
                  <div>
                    <label for="descripcion" class="form-label">Descripción del proyecto</label>
                    <textarea id="descripcion" v-model="formData.descripcion" rows="3" class="form-input resize-none" placeholder="Describe las características principales..."></textarea>
                    <p class="text-xs text-gray-500 mt-1">Visible en el catálogo. Máx 500 caracteres.</p>
                  </div>
                </div>
              </section>

              <section class="space-y-6 border-t border-gray-200 pt-8">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                  <h3 class="text-lg font-semibold text-gray-900">Tipo y Estado</h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="propertyTypeId" class="form-label">Tipo de Inmueble *</label>
                    <select id="propertyTypeId" v-model="formData.propertyTypeId" class="form-input" :class="{ 'error': errors.propertyTypeId }"><option :value="null">Seleccione...</option><option value="1">🏠 Casa</option><option value="2">🏢 Departamento</option></select>
                    <p v-if="errors.propertyTypeId" class="error-message">{{ errors.propertyTypeId }}</p>
                  </div>
                  <div>
                    <label for="estadoInmueble" class="form-label">Estado del Inmueble *</label>
                    <select id="estadoInmueble" v-model="formData.estadoInmueble" class="form-input" :class="{ 'error': errors.estadoInmueble }"><option :value="null">Seleccione...</option><option value="Bien Terminado">✅ Bien Terminado</option><option value="En Planos">📐 En Planos</option><option value="En Construcción">🏗️ En Construcción</option></select>
                    <p v-if="errors.estadoInmueble" class="error-message">{{ errors.estadoInmueble }}</p>
                  </div>
                </div>
              </section>

              <section class="space-y-6 border-t border-gray-200 pt-8">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
                  <h3 class="text-lg font-semibold text-gray-900">Ubicación Geográfica</h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div><label for="departamento" class="form-label">Departamento *</label><input id="departamento" v-model="location.departamento" type="text" class="form-input" :class="{ 'error': errors.departamento }" placeholder="Ej: Lima"/> <p v-if="errors.departamento" class="error-message">{{ errors.departamento }}</p> </div>
                  <div><label for="provincia" class="form-label">Provincia *</label><input id="provincia" v-model="location.provincia" type="text" class="form-input" :class="{ 'error': errors.provincia }" placeholder="Ej: Lima"/> <p v-if="errors.provincia" class="error-message">{{ errors.provincia }}</p> </div>
                  <div><label for="distrito" class="form-label">Distrito *</label><input id="distrito" v-model="location.distrito" type="text" class="form-input" :class="{ 'error': errors.distrito }" placeholder="Ej: Miraflores"/> <p v-if="errors.distrito" class="error-message">{{ errors.distrito }}</p> </div>
                </div>
                <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label for="direccion" class="form-label">Dirección (Av./Jr./Calle) *</label><input id="direccion" v-model="location.direccion" type="text" class="form-input" :class="{ 'error': errors.direccion }" placeholder="Ej: Av. Larco"/> <p v-if="errors.direccion" class="error-message">{{ errors.direccion }}</p> </div>
                  <div><label for="numero" class="form-label">Número / Mz-Lote</label><input id="numero" v-model="location.numero" type="text" class="form-input" placeholder="Ej: 123 o Mz A Lote 15"/></div>
                </div>
              </section>

              <section class="space-y-6 border-t border-gray-200 pt-8">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
                  <h3 class="text-lg font-semibold text-gray-900">Características y Distribución</h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><NumberStepper label="Área Construida (m²) *" v-model="formData.builtArea" :step="1" :min="0" unit="m²" :input-class="'focus:ring-indigo-500 focus:border-indigo-500'"/><p v-if="errors.builtArea" class="error-message">{{ errors.builtArea }}</p></div>
                  <div><NumberStepper label="Área de Terreno (m²)" v-model="formData.landArea" :step="1" :min="0" unit="m²" :optional="true" :input-class="'focus:ring-indigo-500 focus:border-indigo-500'"/></div>
                </div>
                <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div><NumberStepper label="N° de Dormitorios *" v-model="formData.bedrooms" :step="1" :min="0" :input-class="'focus:ring-indigo-500 focus:border-indigo-500'"/><p v-if="errors.bedrooms" class="error-message">{{ errors.bedrooms }}</p></div>
                  <div><NumberStepper label="N° de Baños *" v-model="formData.bathrooms" :step="1" :min="0" :input-class="'focus:ring-indigo-500 focus:border-indigo-500'"/><p v-if="errors.bathrooms" class="error-message">{{ errors.bathrooms }}</p></div>
                  <div><NumberStepper label="N° de Cocheras" v-model="formData.garages" :step="1" :min="0" :optional="true" :input-class="'focus:ring-indigo-500 focus:border-indigo-500'"/></div>
                </div>
              </section>
            </div>

            <div v-else-if="currentStep === 1" key="step2" class="space-y-10">
              <section class="space-y-6">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg></div>
                  <h3 class="text-lg font-semibold text-gray-900">Valorización (Precios)</h3>
                </div>
                <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div><NumberStepper label="Precio de Vivienda (S/) *" v-model="formData.propertyPrice" :step="1000" :min="0" unit="S/" :input-class="'font-semibold text-xl text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500'"/><p v-if="errors.propertyPrice" class="error-message">{{ errors.propertyPrice }}</p></div>
                    <div><NumberStepper label="Valor de Cochera (S/)" v-model="formData.garageValue" :step="500" :min="0" unit="S/" :optional="true" :input-class="'font-semibold text-lg focus:ring-indigo-500 focus:border-indigo-500'"/><p v-if="errors.garageValue" class="error-message">{{ errors.garageValue }}</p></div>
                  </div>
                  <div class="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                    <div class="flex items-center space-x-2 text-sm text-indigo-700">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                      <span>Usados para calcular opciones de financiamiento.</span>
                    </div>
                  </div>
                </div>
              </section>

              <section class="space-y-6 border-t border-gray-200 pt-8">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                  <h3 class="text-lg font-semibold text-gray-900">Atributos para Financiamiento</h3>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                  <fieldset>
                    <legend class="form-label mb-4">¿Es Proyecto Sostenible? *</legend>
                    <RadioGroup v-model="formData.isSustainable" class="space-y-4">
                      <RadioGroupOption as="template" :value="true" v-slot="{ checked }">
                        <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                          <div class="flex-1">
                            <RadioGroupLabel as="span" class="font-medium text-gray-900 cursor-pointer">Sí, es un proyecto sostenible</RadioGroupLabel>
                            <RadioGroupDescription as="p" class="text-sm text-gray-600 mt-1">Califica para el Bono Sostenible (MiVivienda Verde).</RadioGroupDescription>
                            <div class="mt-2 flex items-center text-sm text-emerald-700">
                              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                              Bono Verde disponible
                            </div>
                          </div>
                          <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                        </div>
                      </RadioGroupOption>
                      <RadioGroupOption as="template" :value="false" v-slot="{ checked }">
                        <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                          <div class="flex-1">
                            <RadioGroupLabel as="span" class="font-medium text-gray-900 cursor-pointer">No, no es un proyecto sostenible</RadioGroupLabel>
                            <RadioGroupDescription as="p" class="text-sm text-gray-600 mt-1">No califica para beneficios adicionales de sostenibilidad.</RadioGroupDescription>
                          </div>
                          <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                        </div>
                      </RadioGroupOption>
                    </RadioGroup>
                    <p v-if="errors.isSustainable" class="error-message mt-4">{{ errors.isSustainable }}</p>
                  </fieldset>
                </div>
              </section>

              <section class="space-y-6 border-t border-gray-200 pt-8">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                  <h3 class="text-lg font-semibold text-gray-900">Fotos del Inmueble</h3>
                </div>
                <div class="space-y-4">
                  <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50">
                    <div class="text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <label for="photo-upload" class="cursor-pointer">
                        <span class="text-lg font-medium text-indigo-600 hover:text-indigo-500">Haz clic para subir fotos</span>
                        <span class="text-gray-500"> o arrastra y suelta</span>
                      </label>
                      <input id="photo-upload" type="file" multiple @change="handleFileUpload" accept="image/*" class="sr-only"/>
                      <p class="text-sm text-gray-500 mt-2">PNG, JPG, GIF hasta 2MB cada una</p>
                    </div>
                  </div>

                  <div v-if="existingPhotos.length > 0 || photoPreviews.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div v-for="(photoUrl, index) in existingPhotos" :key="'exist-' + index" class="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img :src="photoUrl" class="w-full h-full object-cover" alt="Foto existente"/>
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                        <button @click="removeExistingPhoto(index)" type="button" class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                      <div class="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow">Existente</div>
                    </div>
                    <div v-for="(preview, index) in photoPreviews" :key="'new-' + index" class="relative group aspect-square rounded-lg overflow-hidden border-2 border-indigo-300">
                      <img :src="preview" class="w-full h-full object-cover" alt="Nueva foto"/>
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                        <button @click="removeNewPhoto(index)" type="button" class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                      <div class="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow">Nueva</div>
                    </div>
                  </div>

                  <div v-if="uploadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ uploadError }}</div>
                  <div v-if="isUploading" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-center gap-x-2">
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Subiendo fotos...
                  </div>
                </div>
              </section>
            </div>
          </transition>
        </div>

        <div class="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button @click="previousStep" type="button" class="btn-secondary inline-flex items-center gap-x-2">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" /></svg>
            <span v-if="currentStep === 0">Cancelar</span>
            <span v-else>Anterior</span>
          </button>
          <button v-if="currentStep < steps.length - 1" @click="nextStep" type="button" class="btn-primary inline-flex items-center gap-x-2">
            Siguiente
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" /></svg>
          </button>
          <button v-else @click="handleUpdateProperty" type="button" :disabled="isSaving" class="btn-primary inline-flex items-center gap-x-2 disabled:opacity-50">
            <svg v-if="isSaving" class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M16.743 3.48a.75.75 0 01.09 1.058l-8.5 10a.75.75 0 01-1.148-.066l-4.5-6a.75.75 0 011.116-.99l3.88 5.174 7.942-9.266a.75.75 0 011.058-.09z" /></svg>
            {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { RadioGroup, RadioGroupOption, RadioGroupLabel, RadioGroupDescription } from '@headlessui/vue'
import { useProperties } from '~/composables/useProperties'
import { useNotifications } from '~/composables/useNotifications'

// Asegúrate que la ruta sea correcta o que el componente esté registrado globalmente
const NumberStepper = defineAsyncComponent(() => import('@/components/NumberStepper.vue'))

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getProperty, updateProperty, uploadPhotos } = useProperties()
const { showSuccess, showError } = useNotifications()

const property = ref(null)
const loadingInitial = ref(true)
const initialError = ref(null)
const currentStep = ref(0)
const isSaving = ref(false)
const isUploading = ref(false)
const uploadError = ref('')
const steps = [
  { title: 'Descripción', icon: HomeIcon },
  { title: 'Valorización y Fotos', icon: CurrencyDollarIcon }
]
const formData = reactive({
  nombreProyecto: '', descripcion: '', propertyTypeId: null, estadoInmueble: null,
  builtArea: 0, landArea: 0, bedrooms: 0, bathrooms: 0, garages: 0,
  propertyPrice: 0, garageValue: null, isSustainable: false, photos: []
})
const location = reactive({ departamento: '', provincia: '', distrito: '', numero: '', direccion: '' })
const errors = reactive({})
const photoFiles = ref([])
const photoPreviews = ref([])
const existingPhotos = ref([])
const photosToRemove = ref([])

const parseLocation = (geoString) => {
  if (!geoString) return { departamento: '', provincia: '', distrito: '', numero: '', direccion: '' };
  const parts = geoString.split(',').map(s => s.trim());
  return {
    direccion: parts[0] || '',
    numero: parts[1] || '',
    distrito: parts[2] || '',
    provincia: parts[3] || '',
    departamento: parts[4] || ''
  };
}

onMounted(async () => {
  try {
    loadingInitial.value = true
    initialError.value = null
    const data = await getProperty(route.params.id)
    if (!data) throw new Error('Propiedad no encontrada.')
    property.value = data

    Object.assign(formData, {
      nombreProyecto: data.nombreProyecto || '',
      descripcion: data.descripcion || '',
      propertyTypeId: data.propertyTypeId || null,
      estadoInmueble: data.estadoInmueble || null,
      builtArea: data.builtArea || 0,
      landArea: data.landArea || 0,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      garages: data.garages || 0,
      propertyPrice: data.propertyPrice || 0,
      garageValue: data.garageValue || null,
      isSustainable: data.isSustainable || false,
    });

    const parsedLoc = parseLocation(data.ubicacionGeografica);
    Object.assign(location, parsedLoc);

    let photosArray = [];
    if (data.photos && typeof data.photos === 'string') {
      try {
        photosArray = JSON.parse(data.photos);
        if (!Array.isArray(photosArray)) photosArray = [data.photos];
      } catch {
        photosArray = [data.photos];
      }
    } else if (Array.isArray(data.photos)) {
      photosArray = data.photos;
    }
    existingPhotos.value = photosArray.filter(Boolean);
    formData.photos = [...existingPhotos.value];

  } catch (err) {
    console.error('Error loading property for edit:', err)
    initialError.value = err.message || 'Error al cargar los datos de la propiedad.'
  } finally {
    loadingInitial.value = false
  }
})

const stepStatus = (stepIdx) => {
  if (stepIdx === currentStep.value) return 'current'
  if (stepIdx < currentStep.value) return 'complete'
  return 'upcoming'
}
const stepStatusClass = (stepIdx) => {
  const status = stepStatus(stepIdx)
  if (status === 'complete') return 'bg-indigo-600'
  if (status === 'current') return 'border-2 border-indigo-600 bg-indigo-50'
  return 'border-2 border-gray-300 bg-white'
}

const validateStep = (step) => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true
  if (step === 0) {
    if (!formData.nombreProyecto?.trim()) { errors.nombreProyecto = 'Nombre obligatorio'; isValid = false }
    if (!formData.propertyTypeId) { errors.propertyTypeId = 'Tipo obligatorio'; isValid = false }
    if (!formData.estadoInmueble) { errors.estadoInmueble = 'Estado obligatorio'; isValid = false }
    if (!location.departamento?.trim()) { errors.departamento = 'Departamento obligatorio'; isValid = false }
    if (!location.provincia?.trim()) { errors.provincia = 'Provincia obligatoria'; isValid = false }
    if (!location.distrito?.trim()) { errors.distrito = 'Distrito obligatorio'; isValid = false }
    if (!location.direccion?.trim()) { errors.direccion = 'Dirección obligatoria'; isValid = false }
    if (formData.builtArea <= 0) { errors.builtArea = 'Área > 0'; isValid = false }
    if (formData.bedrooms < 0) { errors.bedrooms = 'N° >= 0'; isValid = false }
    if (formData.bathrooms < 0) { errors.bathrooms = 'N° >= 0'; isValid = false }
  } else if (step === 1) {
    if (formData.propertyPrice <= 0) { errors.propertyPrice = 'Precio > 0'; isValid = false }
    if (formData.garageValue !== null && formData.garageValue < 0) { errors.garageValue = 'Valor >= 0'; isValid = false }
    if (formData.isSustainable === null || formData.isSustainable === undefined) { errors.isSustainable = 'Seleccione una opción'; isValid = false }
  }
  return isValid
}

const nextStep = () => { if (validateStep(currentStep.value) && currentStep.value < steps.length - 1) currentStep.value++ }
const previousStep = () => {
  if (currentStep.value === 0) router.push(`/inmuebles/${route.params.id}`)
  else currentStep.value--
}

const handleFileUpload = (event) => {
  uploadError.value = '';
  const newFiles = Array.from(event.target.files);
  newFiles.forEach(file => {
    if (file.size > 2 * 1024 * 1024) {
      uploadError.value = `El archivo ${file.name} excede los 2MB.`;
      return;
    }
    photoFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => photoPreviews.value.push(e.target.result);
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

const removeExistingPhoto = (index) => {
  const removedUrl = existingPhotos.value.splice(index, 1)[0];
  if (removedUrl) photosToRemove.value.push(removedUrl);
}

const removeNewPhoto = (index) => {
  photoFiles.value.splice(index, 1);
  photoPreviews.value.splice(index, 1);
}

const handleUpdateProperty = async () => {
  if (!validateStep(currentStep.value)) return

  isSaving.value = true
  uploadError.value = ''
  let newPhotoUrls = []

  if (photoFiles.value.length > 0) {
    isUploading.value = true
    try {
      const uploadResult = await uploadPhotos(photoFiles.value)
      if (uploadResult && Array.isArray(uploadResult.photos)) {
        newPhotoUrls = uploadResult.photos.map(p => p.firebaseUrl)
      } else { throw new Error('Respuesta inesperada de subida.') }
    } catch (error) {
      console.error('Error uploading new photos:', error);
      showError('Error al subir las nuevas imágenes.');
      uploadError.value = 'Error al subir nuevas imágenes.';
      isUploading.value = false; isSaving.value = false; return;
    } finally { isUploading.value = false; }
  }

  const finalPhotoUrls = [...existingPhotos.value, ...newPhotoUrls];

  const ubicacionParts = [
    location.direccion,
    location.numero,
    location.distrito,
    location.provincia,
    location.departamento
  ];
  const ubicacionGeografica = ubicacionParts.filter(Boolean).join(', ');

  const payload = {
    ...formData,
    photos: finalPhotoUrls,
    ubicacionGeografica: ubicacionGeografica,
    garageValue: formData.garageValue === 0 ? null : formData.garageValue
  }
  payload.propertyTypeId = Number(payload.propertyTypeId) || null;
  payload.builtArea = Number(payload.builtArea) || 0;
  payload.landArea = Number(payload.landArea) || 0;
  payload.bedrooms = Number(payload.bedrooms) || 0;
  payload.bathrooms = Number(payload.bathrooms) || 0;
  payload.garages = Number(payload.garages) || 0;
  payload.propertyPrice = Number(payload.propertyPrice) || 0;
  payload.garageValue = payload.garageValue ? Number(payload.garageValue) : null;
  try {
    await updateProperty(route.params.id, payload)
    showSuccess('Propiedad actualizada exitosamente.')
    router.push(`/inmuebles/${route.params.id}`)
  } catch (error) {
    console.error('Error updating property:', error)
    showError('Error al guardar los cambios: ' + (error.message || 'Error desconocido'))
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.form-input { @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150; }
.btn-primary { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50; }
.btn-secondary { @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150; }
.btn-secondary-light { @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150;}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from { opacity: 0; transform: translateX(20px); }
.fade-leave-to { opacity: 0; transform: translateX(-20px); }

.error { @apply border-red-500 ring-red-500 focus:ring-red-500 focus:border-red-500; }
.error-message { @apply text-red-600 text-xs mt-1; }

.radio-checked { @apply bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500 relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all; }
.radio-unchecked { @apply bg-white border-gray-300 hover:border-gray-400 relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all; }
.radio-icon { @apply absolute top-3 right-3 h-5 w-5 text-indigo-600; }
</style>