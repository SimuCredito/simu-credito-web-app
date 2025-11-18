<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 sm:px-6 lg:px-8 py-8">

      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <nav aria-label="Progress">
            <ol role="list" class="flex items-center justify-center max-w-3xl mx-auto">
              <li v-for="(step, stepIdx) in steps" :key="step.title" :class="['relative flex-1', { 'pr-8 sm:pr-20': stepIdx < steps.length - 1 }]">
                <div class="absolute inset-0 top-6 left-0 -ml-px h-0.5 w-full" aria-hidden="true">
                  <div class="absolute h-0.5 w-full transition-colors duration-300" :class="stepStatus(stepIdx) === 'upcoming' ? 'bg-gray-200' : 'bg-indigo-600'"></div>
                </div>
                <div class="relative flex flex-col items-center">
                <span class="flex h-12 w-12 bg-gray-50 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300" :class="stepStatusClass(stepIdx)">
                  <svg v-if="stepStatus(stepIdx) === 'complete'" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                  </svg>
                  <component v-else :is="step.icon" class="h-6 w-6" :class="stepStatus(stepIdx) === 'current' ? 'text-indigo-600' : 'text-gray-400'" />
                </span>
                  <span class="mt-3 text-sm font-medium transition-colors duration-300" :class="stepStatus(stepIdx) === 'current' ? 'text-indigo-600' : 'text-gray-500'">{{ step.title }}</span>
                  <span v-if="step.description" class="mt-1 text-xs text-gray-400 text-center max-w-24">{{ step.description }}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div class="px-8 py-8">
            <div class="min-h-[600px]">
              <transition name="fade" mode="out-in">
                <div v-if="currentStep === 0" key="step1" class="space-y-10">
                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Identificación del Proyecto</h3>
                    </div>

                    <div class="grid grid-cols-1 gap-6">
                      <div class="space-y-2">
                        <label class="form-label">Nombre del Proyecto *</label>
                        <input
                            v-model="formData.nombreProyecto"
                            type="text"
                            class="form-input"
                            :class="{ 'error': errors.nombreProyecto }"
                            placeholder="Ej: Condominio Los Alamos"
                        />
                        <p v-if="errors.nombreProyecto" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.nombreProyecto }}
                        </p>
                      </div>

                      <div class="space-y-2">
                        <label class="form-label">Descripción del proyecto</label>
                        <textarea
                            v-model="formData.descripcion"
                            rows="3"
                            class="form-input resize-none"
                            placeholder="Describe las características principales del proyecto que serán visibles en el catálogo..."
                        ></textarea>
                        <p class="text-sm text-gray-500">Opcional. Máximo 500 caracteres.</p>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Tipo y Estado</h3>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="form-label">Tipo de Inmueble *</label>
                        <select
                            v-model="formData.propertyTypeId"
                            class="form-input"
                            :class="{ 'error': errors.propertyTypeId }"
                        >
                          <option :value="null">Seleccione un tipo...</option>
                          <option value="1">🏠 Casa</option>
                          <option value="2">🏢 Departamento</option>
                        </select>
                        <p v-if="errors.propertyTypeId" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.propertyTypeId }}
                        </p>
                      </div>

                      <div class="space-y-2">
                        <label class="form-label">Estado del Inmueble *</label>
                        <select
                            v-model="formData.estadoInmueble"
                            class="form-input"
                            :class="{ 'error': errors.estadoInmueble }"
                        >
                          <option :value="null">Seleccione estado...</option>
                          <option value="Bien Terminado">✅ Bien Terminado</option>
                          <option value="En Planos">📐 En Planos</option>
                          <option value="En Construcción">🏗️ En Construcción</option>
                        </select>
                        <p v-if="errors.estadoInmueble" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.estadoInmueble }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Ubicación Geográfica</h3>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div class="space-y-2">
                        <label class="form-label">Departamento *</label>
                        <input
                            v-model="location.departamento"
                            type="text"
                            class="form-input"
                            :class="{ 'error': errors.departamento }"
                            placeholder="Ej: Lima"
                        />
                        <p v-if="errors.departamento" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.departamento }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label class="form-label">Provincia *</label>
                        <input
                            v-model="location.provincia"
                            type="text"
                            class="form-input"
                            :class="{ 'error': errors.provincia }"
                            placeholder="Ej: Lima"
                        />
                        <p v-if="errors.provincia" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.provincia }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label class="form-label">Distrito *</label>
                        <input
                            v-model="location.distrito"
                            type="text"
                            class="form-input"
                            :class="{ 'error': errors.distrito }"
                            placeholder="Ej: Miraflores"
                        />
                        <p v-if="errors.distrito" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.distrito }}
                        </p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="form-label">Número / Mz-Lote</label>
                        <input
                            v-model="location.numero"
                            type="text"
                            class="form-input"
                            placeholder="Ej: Mz A Lote 15"
                        />
                      </div>
                      <div class="space-y-2">
                        <label class="form-label">Dirección (Av./Jr./Calle) *</label>
                        <input
                            v-model="location.direccion"
                            type="text"
                            class="form-input"
                            :class="{ 'error': errors.direccion }"
                            placeholder="Ej: Av. Larco 123"
                        />
                        <p v-if="errors.direccion" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.direccion }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Características y Distribución</h3>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <NumberStepper
                            label="Área Construida (m²) *"
                            v-model="formData.builtArea"
                            :step="1"
                            :min="0"
                            unit="m²"
                            :input-class="'transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errors.builtArea" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.builtArea }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <NumberStepper
                            label="Área de Terreno (m²)"
                            v-model="formData.landArea"
                            :step="1"
                            :min="0"
                            unit="m²"
                            :optional="true"
                            :input-class="'transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div class="space-y-2">
                        <NumberStepper
                            label="N° de Dormitorios *"
                            v-model="formData.bedrooms"
                            :step="1"
                            :min="0"
                            :input-class="'transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errors.bedrooms" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.bedrooms }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <NumberStepper
                            label="N° de Baños *"
                            v-model="formData.bathrooms"
                            :step="1"
                            :min="0"
                            :input-class="'transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                        <p v-if="errors.bathrooms" class="error-message">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ errors.bathrooms }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <NumberStepper
                            label="N° de Cocheras"
                            v-model="formData.garages"
                            :step="1"
                            :min="0"
                            :optional="true"
                            :input-class="'transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <div v-else-if="currentStep === 1" key="step2" class="space-y-10">
                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Valorización (Precios)</h3>
                    </div>

                    <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <NumberStepper
                              label="Precio de Vivienda (S/) *"
                              v-model="formData.propertyPrice"
                              :step="1000"
                              :min="0"
                              unit="S/"
                              :input-class="'font-semibold text-xl text-indigo-600 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                          />
                          <p v-if="errors.propertyPrice" class="error-message">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {{ errors.propertyPrice }}
                          </p>
                        </div>
                        <div class="space-y-2">
                          <NumberStepper
                              label="Valor de Cochera (S/)"
                              v-model="formData.garageValue"
                              :step="500"
                              :min="0"
                              unit="S/"
                              :optional="true"
                              :input-class="'font-semibold text-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'"
                          />
                          <p v-if="errors.garageValue" class="error-message">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {{ errors.garageValue }}
                          </p>
                        </div>
                      </div>
                      <div class="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                        <div class="flex items-center space-x-2 text-sm text-indigo-700">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                          </svg>
                          <span>Estos precios serán utilizados para calcular las opciones de financiamiento disponibles.</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Atributos para Financiamiento</h3>
                    </div>

                    <div class="bg-white border border-gray-200 rounded-xl p-6">
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-4">¿Es Proyecto Sostenible?</legend>
                        <div class="space-y-4">
                          <div class="relative flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer"
                               :class="formData.isSustainable === true ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'"
                               @click="formData.isSustainable = true">
                            <div class="flex h-5 items-center">
                              <input
                                  id="isSustainable"
                                  v-model="formData.isSustainable"
                                  type="radio"
                                  :value="true"
                                  name="sustainable"
                                  class="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600"
                              >
                            </div>
                            <div class="ml-3 flex-1">
                              <label for="isSustainable" class="font-medium text-gray-900 cursor-pointer">Sí, es un proyecto sostenible</label>
                              <p class="text-sm text-gray-600 mt-1">Este proyecto califica para el Bono Sostenible (MiVivienda Verde), lo que puede reducir significativamente el costo de financiamiento.</p>
                              <div class="mt-2 flex items-center text-sm text-emerald-700">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                Bono Verde disponible
                              </div>
                            </div>
                          </div>

                          <div class="relative flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer"
                               :class="formData.isSustainable === false ? 'border-gray-300 bg-gray-50' : 'border-gray-200 hover:border-gray-300'"
                               @click="formData.isSustainable = false">
                            <div class="flex h-5 items-center">
                              <input
                                  id="notSustainable"
                                  v-model="formData.isSustainable"
                                  type="radio"
                                  :value="false"
                                  name="sustainable"
                                  class="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                              >
                            </div>
                            <div class="ml-3 flex-1">
                              <label for="notSustainable" class="font-medium text-gray-900 cursor-pointer">No, no es un proyecto sostenible</label>
                              <p class="text-sm text-gray-600 mt-1">Este proyecto no califica para beneficios adicionales de sostenibilidad.</p>
                            </div>
                          </div>

                          <p v-if="errors.isSustainable" class="error-message mt-4">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {{ errors.isSustainable }}
                          </p>
                        </div>
                      </fieldset>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">Fotos del Inmueble</h3>
                    </div>

                    <div class="space-y-4">
                      <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50">
                        <div class="text-center">
                          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <div class="space-y-2">
                            <label for="photo-upload" class="cursor-pointer">
                              <span class="text-lg font-medium text-indigo-600 hover:text-indigo-500">Haz clic para subir fotos</span>
                              <span class="text-gray-500"> o arrastra y suelta</span>
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                multiple
                                @change="handleFileUpload"
                                accept="image/*"
                                class="hidden"
                            />
                            <p class="text-sm text-gray-500">PNG, JPG, GIF hasta 2MB cada una</p>
                          </div>
                        </div>
                      </div>

                      <div v-if="photoPreviews.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <div
                            v-for="(preview, index) in photoPreviews"
                            :key="'preview-' + index"
                            class="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-indigo-300 transition-all"
                        >
                          <img
                              :src="preview"
                              class="w-full h-full object-cover"
                              alt="Preview"
                          />
                          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <button
                                @click="removePhoto(index)"
                                class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 transition-all hover:bg-red-600"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                          <div class="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {{ index + 1 }}
                          </div>
                        </div>
                      </div>

                      <div v-if="uploadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div class="flex items-center">
                          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          {{ uploadError }}
                        </div>
                      </div>

                      <div v-if="isUploading" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                        <div class="flex items-center">
                          <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subiendo fotos...
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </transition>
            </div>
          </div>

          <div class="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div class="flex justify-between items-center">
              <button
                  @click="previousStep"
                  class="btn-secondary inline-flex items-center gap-x-2 px-6 py-3 transition-all duration-200 hover:shadow-md"
                  :class="{ 'opacity-50 cursor-not-allowed': isSaving }"
                  :disabled="isSaving"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
                </svg>
                <span v-if="currentStep === 0">Cancelar</span>
                <span v-else>Anterior</span>
              </button>

              <div class="flex items-center space-x-4">
                <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <span>{{ currentStep + 1 }} de {{ steps.length }}</span>
                  <div class="flex space-x-1">
                    <div
                        v-for="(step, index) in steps"
                        :key="index"
                        class="w-2 h-2 rounded-full transition-all duration-300"
                        :class="index <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'"
                    ></div>
                  </div>
                </div>

                <button
                    v-if="currentStep < steps.length - 1"
                    @click="nextStep"
                    class="btn-primary inline-flex items-center gap-x-2 px-8 py-3 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                    :class="{ 'opacity-50 cursor-not-allowed': isSaving }"
                    :disabled="isSaving"
                >
                  Siguiente
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                  </svg>
                </button>

                <button
                    v-else
                    @click="handleSaveProperty"
                    :disabled="isSaving"
                    class="btn-primary inline-flex items-center gap-x-2 px-8 py-3 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="isSaving" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                  <span v-else class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Guardar Propiedad
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { HomeIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import { useProperties } from '~/composables/useProperties'
import { useNotifications } from '~/composables/useNotifications'

const NumberStepper = defineAsyncComponent(() => import('@/components/NumberStepper.vue'))

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const router = useRouter()
const { createProperty, uploadPhotos } = useProperties()
const { showSuccess, showError } = useNotifications()

const currentStep = ref(0)
const isSaving = ref(false)
const isUploading = ref(false)
const uploadError = ref('')
const steps = [
  {
    title: 'Descripción del inmueble',
    description: 'Información básica y características',
    icon: HomeIcon
  },
  {
    title: 'Valorización y Atributos Financieros',
    description: 'Precios y opciones de financiamiento',
    icon: BuildingOfficeIcon
  }
]

const getDefaultFormData = () => ({
  nombreProyecto: '',
  descripcion: '',
  propertyTypeId: null,
  estadoInmueble: null,
  builtArea: 0,
  landArea: 0,
  bedrooms: 0,
  bathrooms: 0,
  garages: 0,
  propertyPrice: 0,
  garageValue: null,
  isSustainable: false,
  photos: []
})
const formData = reactive(getDefaultFormData())
const location = reactive({ departamento: '', provincia: '', distrito: '', numero: '', direccion: '' })
const errors = reactive({})
const photoFiles = ref([])
const photoPreviews = ref([])

const stepStatus = (stepIdx) => {
  if (stepIdx === currentStep.value) return 'current'
  if (stepIdx < currentStep.value) return 'complete'
  return 'upcoming'
}

const stepStatusClass = (stepIdx) => {
  const status = stepStatus(stepIdx)
  if (status === 'complete') return 'bg-indigo-600'
  if (status === 'current') return 'border-2 border-indigo-600'
  return 'border-2 border-gray-300'
}

const validateStep = (step) => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (step === 0) {
    if (!formData.nombreProyecto?.trim()) {
      errors.nombreProyecto = 'El nombre del proyecto es obligatorio'
      isValid = false
    }
    if (!formData.propertyTypeId) {
      errors.propertyTypeId = 'Debe seleccionar un tipo de inmueble'
      isValid = false
    }
    if (!formData.estadoInmueble) {
      errors.estadoInmueble = 'Debe seleccionar el estado del inmueble'
      isValid = false
    }
    if (!location.departamento?.trim()) {
      errors.departamento = 'El departamento es obligatorio'
      isValid = false
    }
    if (!location.provincia?.trim()) {
      errors.provincia = 'La provincia es obligatoria'
      isValid = false
    }
    if (!location.distrito?.trim()) {
      errors.distrito = 'El distrito es obligatorio'
      isValid = false
    }
    if (!location.direccion?.trim()) {
      errors.direccion = 'La dirección es obligatoria'
      isValid = false
    }
    if (formData.builtArea <= 0) {
      errors.builtArea = 'El área construida debe ser mayor a 0'
      isValid = false
    }
    if (formData.bedrooms < 0) {
      errors.bedrooms = 'El número de dormitorios no puede ser negativo'
      isValid = false
    }
    if (formData.bathrooms < 0) {
      errors.bathrooms = 'El número de baños no puede ser negativo'
      isValid = false
    }
  } else if (step === 1) {
    if (formData.propertyPrice <= 0) {
      errors.propertyPrice = 'El precio de la vivienda debe ser mayor a 0'
      isValid = false
    }
    if (formData.garageValue !== null && formData.garageValue < 0) {
      errors.garageValue = 'El valor de cochera no puede ser negativo'
      isValid = false
    }
    if (formData.isSustainable === null || formData.isSustainable === undefined) {
      errors.isSustainable = 'Debe seleccionar si el proyecto es sostenible'
      isValid = false
    }
  }
  return isValid
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }
}

const previousStep = () => {
  if (currentStep.value === 0) {
    router.push('/inmuebles')
  } else {
    currentStep.value--
  }
}

const handleFileUpload = (event) => {
  uploadError.value = '';
  const newFiles = Array.from(event.target.files);
  newFiles.forEach(file => {
    if (file.size > 2 * 1024 * 1024) {
      uploadError.value += `El archivo ${file.name} excede los 2MB. `;
      return; // Skip this file
    }
    // Check if file already exists (simple check by name)
    if (!photoFiles.value.some(existingFile => existingFile.name === file.name)) {
      photoFiles.value.push(file); // Append new file
      const reader = new FileReader();
      reader.onload = (e) => photoPreviews.value.push(e.target.result); // Append new preview
      reader.readAsDataURL(file);
    } else {
      uploadError.value += `El archivo ${file.name} ya fue agregado. `;
    }
  });
  event.target.value = ''; // Reset file input
}


const removePhoto = (index) => {
  photoFiles.value.splice(index, 1)
  photoPreviews.value.splice(index, 1)
}

const handleSaveProperty = async () => {
  if (!validateStep(currentStep.value)) return

  isSaving.value = true
  uploadError.value = ''
  let photoUrls = []

  if (photoFiles.value.length > 0) {
    isUploading.value = true
    try {
      const uploadResult = await uploadPhotos(photoFiles.value)
      if (uploadResult && Array.isArray(uploadResult.photos)) {
        photoUrls = uploadResult.photos.map(p => p.firebaseUrl)
      } else {
        throw new Error('La respuesta de subida de fotos no tiene el formato esperado.')
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
      showError('Error al subir las imágenes.')
      uploadError.value = 'Ocurrió un error al subir las imágenes.'
      isUploading.value = false
      isSaving.value = false
      return
    } finally {
      isUploading.value = false
    }
  }

  const ubicacionParts = [
    location.direccion,
    location.numero,
    location.distrito,
    location.provincia,
    location.departamento
  ]
  const ubicacionGeografica = ubicacionParts.filter(Boolean).join(', ')

  const payload = {
    ...formData,
    photos: photoUrls,
    ubicacionGeografica: ubicacionGeografica,
    propertyTypeId: Number(formData.propertyTypeId) || null,
    builtArea: Number(formData.builtArea) || 0,
    landArea: Number(formData.landArea) || 0,
    bedrooms: Number(formData.bedrooms) || 0,
    bathrooms: Number(formData.bathrooms) || 0,
    garages: Number(formData.garages) || 0,
    propertyPrice: Number(formData.propertyPrice) || 0,
    garageValue: formData.garageValue ? Number(formData.garageValue) : null
  }

  try {
    await createProperty(payload)
    showSuccess('Propiedad creada exitosamente.')
    router.push('/inmuebles')
  } catch (error) {
    console.error('Error creating property:', error)
    showError('Error al guardar la propiedad.')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.form-input {
  @apply block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.btn-secondary {
  @apply inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.form-input:focus {
  @apply ring-2 ring-indigo-500 ring-offset-2;
}

.animate-pulse-custom {
  animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-custom {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .step-indicator {
    display: none;
  }
}

.form-input.error {
  @apply border-red-300 ring-red-500 focus:border-red-500 focus:ring-red-500;
}

.error-message {
  @apply text-red-600 text-sm mt-1 flex items-center;
}

.success-message {
  @apply text-green-600 text-sm mt-1 flex items-center;
}

.photo-preview {
  @apply relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 cursor-pointer;
}

.photo-preview:hover .photo-overlay {
  @apply opacity-100;
}

.photo-overlay {
  @apply absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center;
}

.photo-number {
  @apply absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium;
}
</style>