<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
        <nav aria-label="Progress" class="px-8 py-6 border-b border-gray-200">
          <ol role="list" class="flex items-center justify-center space-x-8">
            <li v-for="(step, stepIdx) in steps" :key="step.id" class="relative flex-1">
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
                <span class="mt-3 text-sm font-medium transition-colors duration-300" :class="stepStatus(stepIdx) === 'current' ? 'text-indigo-600' : 'text-gray-900'">{{ step.title }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div class="min-h-[600px] px-8 py-10">
          <div v-if="currentStep === 0" class="space-y-10">
            <section>
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Datos del Titular</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label for="holder-nombres" class="form-label">Nombres *</label>
                  <input id="holder-nombres" v-model="formData.holder.nombres" type="text" class="input-field" :class="{ 'error': errors.nombres }" />
                  <p v-if="errors.nombres" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.nombres }}
                  </p>
                </div>
                <div>
                  <label for="holder-apellidos" class="form-label">Apellidos *</label>
                  <input id="holder-apellidos" v-model="formData.holder.apellidos" type="text" class="input-field" :class="{ 'error': errors.apellidos }" />
                  <p v-if="errors.apellidos" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.apellidos }}
                  </p>
                </div>
                <div>
                  <label for="holder-doctype" class="form-label">Tipo de Documento *</label>
                  <select id="holder-doctype" v-model.number="formData.holder.documentTypeId" class="input-field" :class="{ 'error': errors.documentTypeId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="type in documentTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                  </select>
                  <p v-if="errors.documentTypeId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.documentTypeId }}
                  </p>
                </div>
                <div>
                  <label for="holder-docnum" class="form-label">N° de Documento *</label>
                  <input id="holder-docnum" v-model="formData.holder.documentNumber" type="text" class="input-field" :class="{ 'error': errors.documentNumber }" />
                  <p v-if="errors.documentNumber" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.documentNumber }}
                  </p>
                </div>
                <div>
                  <label for="holder-birthdate" class="form-label">Fecha de Nacimiento *</label>
                  <input id="holder-birthdate" v-model="formData.holder.birthDate" type="date" class="input-field" :class="{ 'error': errors.birthDate }" />
                  <p v-if="errors.birthDate" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.birthDate }}
                  </p>
                </div>
                <div>
                  <label for="holder-marital" class="form-label">Estado Civil *</label>
                  <select id="holder-marital" v-model.number="formData.holder.maritalStatusId" class="input-field" :class="{ 'error': errors.maritalStatusId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="status in maritalStatuses" :key="status.id" :value="status.id">{{ status.name }}</option>
                  </select>
                  <p v-if="errors.maritalStatusId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.maritalStatusId }}
                  </p>
                </div>
                <div>
                  <label for="holder-education" class="form-label">Grado de Instrucción *</label>
                  <select id="holder-education" v-model.number="formData.holder.educationLevelId" class="input-field" :class="{ 'error': errors.educationLevelId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="level in educationLevels" :key="level.id" :value="level.id">{{ level.name }}</option>
                  </select>
                  <p v-if="errors.educationLevelId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.educationLevelId }}
                  </p>
                </div>
              </div>
            </section>

            <section class="border-t border-gray-200 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Datos de Contacto</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label for="holder-email" class="form-label">Correo Electrónico *</label>
                  <input id="holder-email" v-model="formData.holder.correo" type="email" class="input-field" :class="{ 'error': errors.correo }" />
                  <p v-if="errors.correo" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.correo }}
                  </p>
                </div>
                <div>
                  <label for="holder-phone" class="form-label">Teléfono de Contacto *</label>
                  <input id="holder-phone" v-model="formData.holder.telefono" type="tel" class="input-field" :class="{ 'error': errors.telefono }" />
                  <p v-if="errors.telefono" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.telefono }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label for="holder-address" class="form-label">Dirección Actual</label>
                  <input id="holder-address" v-model="formData.holder.direccion" type="text" class="input-field" />
                </div>
              </div>
            </section>

            <section v-if="isSpouseRequired" id="spouse-personal-info" class="border-t border-gray-200 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Datos del Cónyuge / Conviviente</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label for="spouse-nombres" class="form-label">Nombres *</label>
                  <input id="spouse-nombres" v-model="formData.spouse.nombres" type="text" class="input-field" :class="{ 'error': errors.spouseNombres }" />
                  <p v-if="errors.spouseNombres" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.spouseNombres }}
                  </p>
                </div>
                <div>
                  <label for="spouse-apellidos" class="form-label">Apellidos *</label>
                  <input id="spouse-apellidos" v-model="formData.spouse.apellidos" type="text" class="input-field" :class="{ 'error': errors.spouseApellidos }" />
                  <p v-if="errors.spouseApellidos" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.spouseApellidos }}
                  </p>
                </div>
                <div>
                  <label for="spouse-doctype" class="form-label">Tipo de Documento *</label>
                  <select id="spouse-doctype" v-model.number="formData.spouse.documentTypeId" class="input-field" :class="{ 'error': errors.spouseDocumentTypeId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="type in documentTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                  </select>
                  <p v-if="errors.spouseDocumentTypeId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.spouseDocumentTypeId }}
                  </p>
                </div>
                <div>
                  <label for="spouse-docnum" class="form-label">N° de Documento *</label>
                  <input id="spouse-docnum" v-model="formData.spouse.documentNumber" type="text" class="input-field" :class="{ 'error': errors.spouseDocumentNumber }" />
                  <p v-if="errors.spouseDocumentNumber" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.spouseDocumentNumber }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div v-if="currentStep === 1" class="space-y-10">
            <section>
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Condición Laboral</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <div>
                  <label for="holder-activity" class="form-label">Actividad Económica (Titular) *</label>
                  <select id="holder-activity" v-model.number="formData.holder.economicActivityId" class="input-field" :class="{ 'error': errors.economicActivityId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="activity in economicActivities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
                  </select>
                  <p v-if="errors.economicActivityId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.economicActivityId }}
                  </p>
                </div>
                <div>
                  <label for="holder-profession" class="form-label">Profesión / Oficio (Titular)</label>
                  <input id="holder-profession" v-model="formData.holder.profesion" type="text" class="input-field" />
                </div>
                <div>
                  <label for="holder-income" class="form-label">Ingreso Neto Mensual (Titular) *</label>
                  <input id="holder-income" v-model.number="formData.holder.monthlyNetIncome" type="number" step="0.01" class="input-field" :class="{ 'error': errors.monthlyNetIncome }" />
                  <p v-if="errors.monthlyNetIncome" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.monthlyNetIncome }}
                  </p>
                </div>
              </div>

              <div v-if="isSpouseRequired" class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mt-6 border-t border-gray-200 pt-6" id="spouse-financial-info">
                <div>
                  <label for="spouse-activity" class="form-label">Actividad Económica (Cónyuge) *</label>
                  <select id="spouse-activity" v-model.number="formData.spouse.economicActivityId" class="input-field" :class="{ 'error': errors.spouseEconomicActivityId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="activity in economicActivities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
                  </select>
                  <p v-if="errors.spouseEconomicActivityId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.spouseEconomicActivityId }}
                  </p>
                </div>
                <div>
                  <label for="spouse-profession" class="form-label">Profesión / Oficio (Cónyuge)</label>
                  <input id="spouse-profession" v-model="formData.spouse.profesion" type="text" class="input-field" />
                </div>
                <div>
                  <label for="spouse-income" class="form-label">Ingreso Neto Mensual (Cónyuge) *</label>
                  <input id="spouse-income" v-model.number="formData.spouse.monthlyNetIncome" type="number" step="0.01" class="input-field" :class="{ 'error': errors.spouseMonthlyNetIncome }" />
                  <p v-if="errors.spouseMonthlyNetIncome" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.spouseMonthlyNetIncome }}
                  </p>
                </div>
              </div>
            </section>

            <section class="border-t border-gray-200 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Sustento de la Cuota Inicial</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label for="fund-source" class="form-label">Origen de Fondos *</label>
                  <select id="fund-source" v-model.number="formData.fundSourceId" class="input-field" :class="{ 'error': errors.fundSourceId }">
                    <option :value="null" disabled>Seleccione...</option>
                    <option v-for="source in fundSources" :key="source.id" :value="source.id">{{ source.name }}</option>
                  </select>
                  <p v-if="errors.fundSourceId" class="error-message">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.fundSourceId }}
                  </p>
                </div>
              </div>
            </section>

            <section class="border-t border-gray-200 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Declaración de Elegibilidad</h4>
              <div class="space-y-6">
                <fieldset>
                  <legend class="form-label">¿El titular, cónyuge o hijos menores son propietarios de otra vivienda en el país? *</legend>
                  <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                        :class="formData.isOwnerOfAnotherProperty === true ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'"
                        class="relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all">
                      <input type="radio" v-model="formData.isOwnerOfAnotherProperty" :value="true" name="isOwner" class="sr-only" aria-labelledby="isOwner-yes-label">
                      <span id="isOwner-yes-label" class="text-sm font-medium text-gray-900">Sí, es propietario</span>
                      <svg v-if="formData.isOwnerOfAnotherProperty === true" class="absolute top-3 right-3 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </label>
                    <label
                        :class="formData.isOwnerOfAnotherProperty === false ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'"
                        class="relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all">
                      <input type="radio" v-model="formData.isOwnerOfAnotherProperty" :value="false" name="isOwner" class="sr-only" aria-labelledby="isOwner-no-label">
                      <span id="isOwner-no-label" class="text-sm font-medium text-gray-900">No, no es propietario</span>
                      <svg v-if="formData.isOwnerOfAnotherProperty === false" class="absolute top-3 right-3 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </label>
                  </div>
                </fieldset>

                <fieldset>
                  <legend class="form-label">¿El titular o cónyuge han recibido antes apoyo del estado (FONAVI, Techo Propio, etc.)? *</legend>
                  <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                        :class="formData.receivedPreviousSupport === true ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'"
                        class="relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all">
                      <input type="radio" v-model="formData.receivedPreviousSupport" :value="true" name="hasSupport" class="sr-only" aria-labelledby="hasSupport-yes-label">
                      <span id="hasSupport-yes-label" class="text-sm font-medium text-gray-900">Sí, ha recibido apoyo</span>
                      <svg v-if="formData.receivedPreviousSupport === true" class="absolute top-3 right-3 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </label>
                    <label
                        :class="formData.receivedPreviousSupport === false ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'"
                        class="relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all">
                      <input type="radio" v-model="formData.receivedPreviousSupport" :value="false" name="hasSupport" class="sr-only" aria-labelledby="hasSupport-no-label">
                      <span id="hasSupport-no-label" class="text-sm font-medium text-gray-900">No, no ha recibido apoyo</span>
                      <svg v-if="formData.receivedPreviousSupport === false" class="absolute top-3 right-3 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </label>
                  </div>
                </fieldset>
              </div>
            </section>

            <section class="border-t border-gray-200 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Calificación para Bonos Adicionales</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <fieldset>
                  <legend class="form-label">¿Aplica para el Bono Integrador?</legend>
                  <p class="text-xs text-gray-500 mb-2">(Seleccione si pertenece a alguna categoría)</p>
                  <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                        :class="formData.appliesForIntegratorBonus === true ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'"
                        class="relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all">
                      <input type="radio" v-model="formData.appliesForIntegratorBonus" :value="true" name="appliesBonus" class="sr-only" aria-labelledby="appliesBonus-yes-label">
                      <span id="appliesBonus-yes-label" class="text-sm font-medium text-gray-900">Sí, aplica</span>
                      <svg v-if="formData.appliesForIntegratorBonus === true" class="absolute top-3 right-3 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </label>
                    <label
                        :class="formData.appliesForIntegratorBonus === false ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'"
                        class="relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all">
                      <input type="radio" v-model="formData.appliesForIntegratorBonus" :value="false" name="appliesBonus" class="sr-only" aria-labelledby="appliesBonus-no-label">
                      <span id="appliesBonus-no-label" class="text-sm font-medium text-gray-900">No, no aplica</span>
                      <svg v-if="formData.appliesForIntegratorBonus === false" class="absolute top-3 right-3 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </label>
                  </div>
                </fieldset>
                <div>
                  <label for="conadis-card" class="form-label">N° de Carné CONADIS</label>
                  <p class="text-xs text-gray-500 mb-2">(Opcional, si aplica)</p>
                  <input id="conadis-card" v-model="formData.conadisCardNumber" type="text" class="input-field" />
                </div>
              </div>
            </section>
          </div>

          <div v-if="currentStep === 2" class="space-y-10">
            <section>
              <h4 class="text-lg font-semibold text-gray-900 mb-6">Resumen del Cliente</h4>
              <dl class="bg-gray-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-sm">
                  <dt class="text-gray-500 font-medium">Nombre completo</dt>
                  <dd class="text-gray-900 font-semibold text-base mt-1">{{ formData.holder.nombres }} {{ formData.holder.apellidos }}</dd>
                </div>
                <div class="text-sm">
                  <dt class="text-gray-500 font-medium">N° de Documento</dt>
                  <dd class="text-gray-900 font-semibold text-base mt-1">{{ formData.holder.documentNumber }}</dd>
                </div>
                <div class="text-sm">
                  <dt class="text-gray-500 font-medium">Ingreso Familiar Neto</dt>
                  <dd class="text-gray-900 font-semibold text-base mt-1">S/ {{ formData.familyNetIncome.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</dd>
                </div>
              </dl>
            </section>

            <div v-if="isSubmitting" class="text-center py-10">
              <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-lg font-medium text-gray-600 mt-4">Calculando pre-calificación...</p>
            </div>

            <div v-if="preQualificationApiResult" class="space-y-10">
              <section class="border-t border-gray-200 pt-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-6">Precalificación para Nuevo Crédito MiVivienda</h4>
                <div class="bg-gray-50 px-6 py-5 rounded-lg border border-gray-200 flex items-center justify-between">
                  <dt class="text-base font-medium text-gray-600">¿Califica para el Crédito?</dt>
                  <dd>
                    <span v-if="preQualificationApiResult.isEligible" class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                      <svg class="-ml-1 mr-1.5 h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      Califica
                    </span>
                    <span v-else class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                      <svg class="-ml-1 mr-1.5 h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>
                      No Califica
                    </span>
                  </dd>
                </div>
              </section>

              <section>
                <h4 class="text-lg font-semibold text-gray-900 mb-6">Análisis de Bonos (MiVivienda)</h4>
                <dl class="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div class="bg-gray-50 px-5 py-4 rounded-lg border border-gray-200">
                    <dt class="text-sm font-medium text-gray-500">Bono del Buen Pagador</dt>
                    <dd class="mt-1 font-semibold" :class="formatStatus(preQualificationApiResult.bbpStatus).class">
                      {{ formatStatus(preQualificationApiResult.bbpStatus).text }}
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-5 py-4 rounded-lg border border-gray-200">
                    <dt class="text-sm font-medium text-gray-500">Bono Sostenible</dt>
                    <dd class="mt-1 font-semibold" :class="formatStatus(preQualificationApiResult.sustainableBonusStatus).class">
                      {{ formatStatus(preQualificationApiResult.sustainableBonusStatus).text }}
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-5 py-4 rounded-lg border border-gray-200">
                    <dt class="text-sm font-medium text-gray-500">Bono Integrador</dt>
                    <dd class="mt-1 font-semibold" :class="formatStatus(preQualificationApiResult.integratorBonusStatus).class">
                      {{ formatStatus(preQualificationApiResult.integratorBonusStatus).text }}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h4 class="text-lg font-semibold text-gray-900 mb-6">Precalificación para Programa Techo Propio</h4>
                <dl class="grid grid-cols-1 gap-5">
                  <div class="bg-gray-50 px-5 py-4 rounded-lg border border-gray-200">
                    <dt class="text-sm font-medium text-gray-500">Potencial candidato</dt>
                    <dd class="mt-1 font-semibold" :class="formatStatus(preQualificationApiResult.techoPropioStatus).class">
                      {{ formatStatus(preQualificationApiResult.techoPropioStatus).text }}
                    </dd>
                  </div>
                </dl>
              </section>

              <section v-if="preQualificationApiResult.recomendacion" class="border-t border-gray-200 pt-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-6">Recomendación / Próximos Pasos</h4>
                <div class="rounded-md bg-blue-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <p class="text-sm text-blue-800">{{ preQualificationApiResult.recomendacion }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div class="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
              @click="previousStep"
              class="btn-secondary inline-flex items-center gap-x-2"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
            </svg>
            <span v-if="currentStep === 0">Cancelar</span>
            <span v-else>Anterior</span>
          </button>
          <div class="flex space-x-3">
            <button v-if="currentStep < steps.length - 1" @click="nextStep" :disabled="isSubmitting" class="btn-primary inline-flex items-center gap-x-2 disabled:opacity-50">
              Siguiente
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
              </svg>
            </button>
            <button v-if="currentStep === steps.length - 1" @click="handleCreateClient" :disabled="isSubmitting || !preQualificationApiResult" class="btn-primary inline-flex items-center gap-x-2 disabled:opacity-50">
              <svg v-if="!isSubmitting" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
              </svg>
              <svg v-if="isSubmitting" class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isSubmitting">Guardando...</span>
              <span v-else>Guardar Cliente</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClients } from '~/composables/useClients.ts'
import { HomeIcon, BanknotesIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const router = useRouter()
const { createClient: apiCreateClient, checkPreQualification } = useClients()

const currentStep = ref(0)
const isSubmitting = ref(false)
const preQualificationApiResult = ref(null)
const steps = [
  { id: 'personal', title: 'Información Personal', icon: HomeIcon },
  { id: 'socioeconomic', title: 'Evaluación Económica', icon: BanknotesIcon },
  { id: 'summary', title: 'Resumen y Precalificación', icon: ClipboardDocumentCheckIcon }
]

const documentTypes = [ { id: 1, name: 'DNI' }, { id: 2, name: 'Carné de Extranjería' }, { id: 3, name: 'Pasaporte' } ]
const maritalStatuses = [ { id: 1, name: 'Soltero(a)' }, { id: 2, name: 'Casado(a)' }, { id: 3, name: 'Conviviente' }, { id: 4, name: 'Divorciado(a)' }, { id: 5, name: 'Viudo(a)' } ]
const educationLevels = [ { id: 1, name: 'Sin Instrucción' }, { id: 2, name: 'Primaria' }, { id: 3, name: 'Secundaria' }, { id: 4, name: 'Técnico' }, { id: 5, name: 'Universitario' }, { id: 6, name: 'Postgrado' } ]
const economicActivities = [ { id: 1, name: 'Dependiente' }, { id: 2, name: 'Independiente' }, { id: 3, name: 'Jubilado' }, { id: 4, name: 'Otro' } ]
const fundSources = [ { id: 1, name: 'Ahorros en Sistema Financiero' }, { id: 2, name: 'Venta de propiedad' }, { id: 3, name: 'Préstamo' }, { id: 4, name: 'Fondos Propios (Negocio)' } ]

const getDefaultFormData = () => ({
  holder: {
    documentTypeId: null, maritalStatusId: null, educationLevelId: null, economicActivityId: null,
    nombres: '', apellidos: '', documentNumber: '', birthDate: '', correo: '', telefono: '', direccion: '', profesion: '', monthlyNetIncome: null
  },
  spouse: {
    documentTypeId: null, maritalStatusId: null, educationLevelId: null, economicActivityId: null,
    nombres: '', apellidos: '', documentNumber: '', birthDate: '', correo: '', telefono: '', direccion: '', profesion: '', monthlyNetIncome: 0
  },
  fundSourceId: null, familyNetIncome: 0, appliesForIntegratorBonus: false, conadisCardNumber: '', isOwnerOfAnotherProperty: false, receivedPreviousSupport: false
})
const formData = reactive(getDefaultFormData())
const errors = reactive({})

const isSpouseRequired = computed(() => {
  return formData.holder.maritalStatusId === 2 || formData.holder.maritalStatusId === 3
})

const getAge = (dateString) => {
  if (!dateString) return 0;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
  return age;
}

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

const formatStatus = (status) => {
  if (!status) {
    return { text: 'No Determinado', class: 'text-gray-500' };
  }
  switch (status.toUpperCase()) {
    case 'ELIGIBLE':
    case 'APPLIES':
      return { text: 'Aplica', class: 'text-green-700' };
    case 'NOT_ELIGIBLE':
      return { text: 'No aplica', class: 'text-red-700' };
    case 'REQUIRES_PROPERTY_EVALUATION':
      return { text: 'Requiere evaluación de inmueble', class: 'text-blue-700' };
    case 'REQUIRES_FURTHER_EVALUATION':
      return { text: 'Requiere evaluación adicional', class: 'text-yellow-700' };
    default:
      return { text: status, class: 'text-gray-900' };
  }
}

const validateStep = (step) => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (step === 0) {
    if (!formData.holder.nombres.trim()) { errors.nombres = 'El nombre es requerido'; isValid = false; }
    if (!formData.holder.apellidos.trim()) { errors.apellidos = 'El apellido es requerido'; isValid = false; }
    if (!formData.holder.documentTypeId) { errors.documentTypeId = 'Tipo de documento es requerido'; isValid = false; }
    if (!formData.holder.documentNumber.trim()) { errors.documentNumber = 'N° de documento es requerido'; isValid = false; }
    if (!formData.holder.birthDate) { errors.birthDate = 'Fecha de nacimiento es requerida'; isValid = false; }
    if (formData.holder.birthDate && getAge(formData.holder.birthDate) < 18) { errors.birthDate = 'Debe ser mayor de 18 años'; isValid = false; }
    if (!formData.holder.maritalStatusId) { errors.maritalStatusId = 'Estado civil es requerido'; isValid = false; }
    if (!formData.holder.educationLevelId) { errors.educationLevelId = 'Grado de instrucción es requerido'; isValid = false; }
    if (!formData.holder.correo.trim()) { errors.correo = 'Email es requerido'; isValid = false; }
    if (!formData.holder.telefono.trim()) { errors.telefono = 'Teléfono es requerido'; isValid = false; }

    if (isSpouseRequired.value) {
      if (!formData.spouse.nombres.trim()) { errors.spouseNombres = 'Nombre del cónyuge es requerido'; isValid = false; }
      if (!formData.spouse.apellidos.trim()) { errors.spouseApellidos = 'Apellido del cónyuge es requerido'; isValid = false; }
      if (!formData.spouse.documentTypeId) { errors.spouseDocumentTypeId = 'Tipo de documento es requerido'; isValid = false; }
      if (!formData.spouse.documentNumber.trim()) { errors.spouseDocumentNumber = 'N° de documento es requerido'; isValid = false; }
    }
  } else if (step === 1) {
    if (!formData.holder.economicActivityId) { errors.economicActivityId = 'Actividad económica es requerida'; isValid = false; }
    if (!formData.holder.monthlyNetIncome || formData.holder.monthlyNetIncome <= 0) { errors.monthlyNetIncome = 'Ingresos del titular son requeridos'; isValid = false; }

    if (isSpouseRequired.value) {
      if (!formData.spouse.economicActivityId) { errors.spouseEconomicActivityId = 'Actividad económica es requerida'; isValid = false; }
      if (formData.spouse.monthlyNetIncome === null || formData.spouse.monthlyNetIncome < 0) {
        errors.spouseMonthlyNetIncome = 'Ingrese 0 si no hay ingresos'; isValid = false;
      }
    }
    if (!formData.fundSourceId) { errors.fundSourceId = 'Origen de fondos es requerido'; isValid = false; }
  }
  return isValid
}

const nextStep = async () => {
  if (!validateStep(currentStep.value)) return

  isSubmitting.value = true
  preQualificationApiResult.value = null

  const holderIncome = formData.holder.monthlyNetIncome || 0
  const spouseIncome = isSpouseRequired.value ? (formData.spouse.monthlyNetIncome || 0) : 0
  formData.familyNetIncome = holderIncome + spouseIncome

  if (currentStep.value === 1) {
    try {
      const preQualPayload = {
        monthlyIncome: formData.holder.monthlyNetIncome,
        familyNetIncome: formData.familyNetIncome,
        age: getAge(formData.holder.birthDate),
        appliesForIntegratorBonus: formData.appliesForIntegratorBonus,
        isOwnerOfAnotherProperty: formData.isOwnerOfAnotherProperty,
        hasReceivedPreviousSupport: formData.receivedPreviousSupport,
        conadisCardNumber: formData.conadisCardNumber || undefined
      }
      const result = await checkPreQualification(preQualPayload)
      preQualificationApiResult.value = result
    } catch (error) {
      console.error('Error checking pre-qualification:', error)
      alert('Error al pre-calificar: ' + error.message)
      isSubmitting.value = false
      return
    }
  }

  isSubmitting.value = false
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value === 0) {
    router.push('/clientes')
  } else {
    currentStep.value--
  }
}

const handleCreateClient = async () => {
  if (isSubmitting.value || !preQualificationApiResult.value) return
  isSubmitting.value = true

  try {
    let payload = { ...formData }
    if (!isSpouseRequired.value) {
      payload.spouse = {
        documentTypeId: null, maritalStatusId: null, educationLevelId: null, economicActivityId: null,
        nombres: null, apellidos: null, documentNumber: null, birthDate: null, correo: null, telefono: null, direccion: null, profesion: null, monthlyNetIncome: 0
      }
    } else {
      payload.spouse.maritalStatusId = payload.holder.maritalStatusId;
      payload.spouse.educationLevelId = payload.spouse.educationLevelId || null;
    }

    await apiCreateClient(payload)
    router.push('/clientes')
  } catch (error) {
    console.error('Error creating client:', error)
    alert('Error al crear el cliente: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  console.log('¡Página /clientes/nuevo.vue MONTADA con éxito!');
});
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.input-field {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150;
}
.input-field.error {
  @apply border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500;
}
.error-message {
  @apply text-sm text-red-600 mt-1 flex items-center;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150;
}
</style>
