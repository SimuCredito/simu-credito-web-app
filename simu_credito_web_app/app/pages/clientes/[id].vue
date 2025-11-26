<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex-1 min-w-0">
          <button @click="$router.back()" class="btn-secondary-light inline-flex items-center gap-x-2 text-sm mb-4">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
            </svg>
            Volver a clientes
          </button>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Detalles del Cliente</h1>
          <p class="mt-2 text-sm text-gray-600">Información completa del cliente y estado de precalificación.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center space-x-3">
          <template v-if="isEditing">
            <button @click="cancelEdit" type="button" class="btn-secondary">
              Cancelar
            </button>
            <button @click="saveChanges" type="button" class="btn-primary inline-flex items-center gap-x-2" :disabled="isSaving">
              <svg v-if="isSaving" class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </template>
          <template v-else>
            <button @click="toggleEdit" type="button" class="btn-secondary">
              Editar
            </button>
            <button @click="openDeleteModal" type="button" class="btn-danger">
              Eliminar
            </button>
          </template>
        </div>
      </div>

      <div v-if="loading" class="mt-8 flex justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="error" class="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {{ error }}
      </div>

      <form v-else-if="client" @submit.prevent="saveChanges" class="mt-8 space-y-8">

        <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-semibold text-gray-900">Información Personal y de Contacto (Titular)</h3>
          </div>
          <div class="border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="dl-row">
                <dt class="dl-dt">Nombre Completo</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.holder.nombres }} {{ client.holder.apellidos }}</dd>
                <dd v-else class="dl-dd-edit grid grid-cols-2 gap-4">
                  <input v-model="editableClient.holder.nombres" type="text" class="input-field" placeholder="Nombres" />
                  <input v-model="editableClient.holder.apellidos" type="text" class="input-field" placeholder="Apellidos" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Tipo de Documento</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getDocumentTypeText(client.holder.documentTypeId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.holder.documentTypeId" class="input-field">
                    <option v-for="type in documentTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                  </select>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">N° Documento</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.holder.documentNumber }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.holder.documentNumber" type="text" class="input-field" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Fecha de Nacimiento</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ formatDateForDisplay(client.holder.birthDate) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.holder.birthDate" type="date" class="input-field" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Email</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.holder.correo }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.holder.correo" type="email" class="input-field" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Teléfono</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.holder.telefono || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.holder.telefono" type="tel" class="input-field" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Dirección</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.holder.direccion || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.holder.direccion" type="text" class="input-field" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Grado de Instrucción</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getEducationLevelText(client.holder.educationLevelId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.holder.educationLevelId" class="input-field">
                    <option v-for="level in educationLevels" :key="level.id" :value="level.id">{{ level.name }}</option>
                  </select>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div v-if="isSpouseRequired" class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-semibold text-gray-900">Información del Cónyuge / Conviviente</h3>
          </div>
          <div class="border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="dl-row">
                <dt class="dl-dt">Nombre Completo</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.spouse.nombres || 'N/A' }} {{ client.spouse.apellidos || '' }}</dd>
                <dd v-else class="dl-dd-edit grid grid-cols-2 gap-4">
                  <input v-model="editableClient.spouse.nombres" type="text" class="input-field" placeholder="Nombres" />
                  <input v-model="editableClient.spouse.apellidos" type="text" class="input-field" placeholder="Apellidos" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Tipo de Documento</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getDocumentTypeText(client.spouse.documentTypeId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.spouse.documentTypeId" class="input-field">
                    <option v-for="type in documentTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                  </select>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">N° Documento</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.spouse.documentNumber || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.spouse.documentNumber" type="text" class="input-field" />
                </dd>
              </div>

              <div class="dl-row">
                <dt class="dl-dt">Fecha de Nacimiento</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ formatDateForDisplay(client.spouse.birthDate) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.spouse.birthDate" type="date" class="input-field" />
                </dd>
              </div>

              <div class="dl-row">
                <dt class="dl-dt">Grado de Instrucción</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getEducationLevelText(client.spouse.educationLevelId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.spouse.educationLevelId" class="input-field">
                    <option v-for="level in educationLevels" :key="level.id" :value="level.id">{{ level.name }}</option>
                  </select>
                </dd>
              </div>

              <div class="dl-row">
                <dt class="dl-dt">Email</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.spouse.correo || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.spouse.correo" type="email" class="input-field" />
                </dd>
              </div>

              <div class="dl-row">
                <dt class="dl-dt">Teléfono</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.spouse.telefono || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.spouse.telefono" type="tel" class="input-field" />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-semibold text-gray-900">Información Laboral y Financiera</h3>
          </div>
          <div class="border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="dl-row">
                <dt class="dl-dt">Estado Civil (Titular)</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getMaritalStatusText(client.holder.maritalStatusId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.holder.maritalStatusId" class="input-field">
                    <option v-for="status in maritalStatuses" :key="status.id" :value="status.id">{{ status.name }}</option>
                  </select>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Actividad Económica (Titular)</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getEconomicActivityText(client.holder.economicActivityId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.holder.economicActivityId" class="input-field">
                    <option v-for="activity in economicActivities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
                  </select>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Profesión (Titular)</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.holder.profesion || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.holder.profesion" type="text" class="input-field" />
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Ingreso Neto (Titular)</dt>
                <dd v-if="!isEditing" class="dl-dd">S/ {{ client.holder.monthlyNetIncome?.toLocaleString('es-PE') || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model.number="editableClient.holder.monthlyNetIncome" type="number" step="0.01" class="input-field" />
                </dd>
              </div>

              <template v-if="isSpouseRequired">
                <div class="dl-row">
                  <dt class="dl-dt">Actividad Económica (Cónyuge)</dt>
                  <dd v-if="!isEditing" class="dl-dd">{{ getEconomicActivityText(client.spouse.economicActivityId) }}</dd>
                  <dd v-else class="dl-dd-edit">
                    <select v-model.number="editableClient.spouse.economicActivityId" class="input-field">
                      <option v-for="activity in economicActivities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
                    </select>
                  </dd>
                </div>
                <div class="dl-row">
                  <dt class="dl-dt">Profesión (Cónyuge)</dt>
                  <dd v-if="!isEditing" class="dl-dd">{{ client.spouse.profesion || 'N/A' }}</dd>
                  <dd v-else class="dl-dd-edit">
                    <input v-model="editableClient.spouse.profesion" type="text" class="input-field" />
                  </dd>
                </div>
                <div class="dl-row">
                  <dt class="dl-dt">Ingreso Neto (Cónyuge)</dt>
                  <dd v-if="!isEditing" class="dl-dd">S/ {{ client.spouse?.monthlyNetIncome?.toLocaleString('es-PE') || 'N/A' }}</dd>
                  <dd v-else class="dl-dd-edit">
                    <input v-model.number="editableClient.spouse.monthlyNetIncome" type="number" step="0.01" class="input-field" />
                  </dd>
                </div>
              </template>

              <div class="dl-row bg-gray-50 font-semibold">
                <dt class="dl-dt">Ingreso Neto Familiar</dt>
                <dd class="dl-dd">S/ {{ (isEditing ? calculatedFamilyIncome : client.familyNetIncome)?.toLocaleString('es-PE') || 'N/A' }}</dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">Origen de Fondos</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ getFundSourceText(client.fundSourceId) }}</dd>
                <dd v-else class="dl-dd-edit">
                  <select v-model.number="editableClient.fundSourceId" class="input-field">
                    <option v-for="source in fundSources" :key="source.id" :value="source.id">{{ source.name }}</option>
                  </select>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-semibold text-gray-900">Declaración de Elegibilidad</h3>
          </div>
          <div class="border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="dl-row">
                <dt class="dl-dt">¿Propietario de otra vivienda?</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.isOwnerOfAnotherProperty ? 'Sí' : 'No' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <RadioGroup v-model="editableClient.isOwnerOfAnotherProperty" class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioGroupOption as="template" :value="true" v-slot="{ checked }">
                      <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                        <span>Sí, es propietario</span>
                        <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      </div>
                    </RadioGroupOption>
                    <RadioGroupOption as="template" :value="false" v-slot="{ checked }">
                      <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                        <span>No, no es propietario</span>
                        <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      </div>
                    </RadioGroupOption>
                  </RadioGroup>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">¿Recibió apoyo previo del estado?</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.receivedPreviousSupport ? 'Sí' : 'No' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <RadioGroup v-model="editableClient.receivedPreviousSupport" class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioGroupOption as="template" :value="true" v-slot="{ checked }">
                      <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                        <span>Sí, ha recibido apoyo</span>
                        <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      </div>
                    </RadioGroupOption>
                    <RadioGroupOption as="template" :value="false" v-slot="{ checked }">
                      <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                        <span>No, no ha recibido apoyo</span>
                        <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      </div>
                    </RadioGroupOption>
                  </RadioGroup>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">¿Aplica a Bono Integrador?</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.appliesForIntegratorBonus ? 'Sí' : 'No' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <RadioGroup v-model="editableClient.appliesForIntegratorBonus" class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RadioGroupOption as="template" :value="true" v-slot="{ checked }">
                      <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                        <span>Sí, aplica</span>
                        <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      </div>
                    </RadioGroupOption>
                    <RadioGroupOption as="template" :value="false" v-slot="{ checked }">
                      <div :class="checked ? 'radio-checked' : 'radio-unchecked'">
                        <span>No, no aplica</span>
                        <svg v-if="checked" class="radio-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                      </div>
                    </RadioGroupOption>
                  </RadioGroup>
                </dd>
              </div>
              <div class="dl-row">
                <dt class="dl-dt">N° Carné CONADIS</dt>
                <dd v-if="!isEditing" class="dl-dd">{{ client.conadisCardNumber || 'N/A' }}</dd>
                <dd v-else class="dl-dd-edit">
                  <input v-model="editableClient.conadisCardNumber" type="text" class="input-field" />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div v-if="!isEditing" class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-semibold text-gray-900">Elegibilidad y Pre-calificación</h3>
            <button @click="runPreQualification" type="button" class="btn-secondary-light text-sm" :disabled="isPreQualifying">
              <svg v-if="isPreQualifying" class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isPreQualifying ? 'Ejecutando...' : 'Volver a ejecutar' }}
            </button>
          </div>
          <div class="border-t border-gray-200 px-6 py-5">
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div class="status-card">
                <dt class="status-dt">Bono del Buen Pagador</dt>
                <dd class="status-dd" :class="formatStatus(client.bbpStatus).class">{{ formatStatus(client.bbpStatus).text }}</dd>
              </div>
              <div class="status-card">
                <dt class="status-dt">Bono Sostenible</dt>
                <dd class="status-dd" :class="formatStatus(client.sustainableBonusStatus).class">{{ formatStatus(client.sustainableBonusStatus).text }}</dd>
              </div>
              <div class="status-card">
                <dt class="status-dt">Bono Integrador</dt>
                <dd class="status-dd" :class="formatStatus(client.integratorBonusStatus).class">{{ formatStatus(client.integratorBonusStatus).text }}</dd>
              </div>
              <div class="status-card">
                <dt class="status-dt">Programa Techo Propio</dt>
                <dd class="status-dd" :class="formatStatus(client.techoPropioStatus).class">{{ formatStatus(client.techoPropioStatus).text }}</dd>
              </div>
              <div class="status-card md:col-span-2">
                <dt class="status-dt">Recomendación</dt>
                <dd class="status-dd text-gray-900">{{ client.recomendacion || 'N/A' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </form>
    </div>

    <DeleteConfirmationModal
        :is-open="showDeleteModal"
        :message="deleteMessage"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClients } from '~/composables/useClients'
import { useNotifications } from '~/composables/useNotifications'
import DeleteConfirmationModal from '~/components/modals/DeleteConfirmationModal.vue'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getClient, deleteClient, checkPreQualification, updateClient } = useClients()
const { showSuccess, showError } = useNotifications()

const client = ref(null)
const editableClient = ref(null)
const loading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const isPreQualifying = ref(false)
const error = ref(null)
const showDeleteModal = ref(false)
const deleteMessage = ref('')

const documentTypes = [ { id: 1, name: 'DNI' }, { id: 2, name: 'Carné de Extranjería' }, { id: 3, name: 'Pasaporte' } ]
const maritalStatuses = [ { id: 1, name: 'Soltero(a)' }, { id: 2, name: 'Casado(a)' }, { id: 3, name: 'Conviviente' }, { id: 4, name: 'Divorciado(a)' }, { id: 5, name: 'Viudo(a)' } ]
const educationLevels = [ { id: 1, name: 'Sin Instrucción' }, { id: 2, name: 'Primaria' }, { id: 3, name: 'Secundaria' }, { id: 4, name: 'Técnico' }, { id: 5, name: 'Universitario' }, { id: 6, name: 'Postgrado' } ]
const economicActivities = [ { id: 1, name: 'Dependiente' }, { id: 2, name: 'Independiente' }, { id: 3, name: 'Jubilado' }, { id: 4, name: 'Otro' } ]
const fundSources = [ { id: 1, name: 'Ahorros en Sistema Financiero' }, { id: 2, name: 'Venta de propiedad' }, { id: 3, name: 'Préstamo' }, { id: 4, name: 'Fondos Propios (Negocio)' } ]

const defaultSpouse = {
  documentTypeId: null, maritalStatusId: null, educationLevelId: null, economicActivityId: null,
  nombres: '', apellidos: '', documentNumber: '', birthDate: null, correo: '', telefono: '', direccion: '', profesion: '', monthlyNetIncome: 0
}

const isSpouseRequired = computed(() => {
  const statusId = isEditing.value ? editableClient.value?.holder.maritalStatusId : client.value?.holder.maritalStatusId
  return statusId === 2 || statusId === 3
})

const calculatedFamilyIncome = computed(() => {
  if (!editableClient.value) return 0
  const holderIncome = editableClient.value.holder.monthlyNetIncome || 0
  const spouseIncome = isSpouseRequired.value ? (editableClient.value.spouse?.monthlyNetIncome || 0) : 0
  return holderIncome + spouseIncome
})

const getAge = (dateString) => {
  if (!dateString) return 0
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const fetchClient = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await getClient(route.params.id)
    client.value = data
  } catch (err) {
    console.error('Error fetching client:', err)
    error.value = 'Error al cargar los datos del cliente'
  } finally {
    loading.value = false
  }
}

const toggleEdit = () => {
  isEditing.value = true
  editableClient.value = JSON.parse(JSON.stringify(client.value))

  editableClient.value.holder.birthDate = formatDateForInput(editableClient.value.holder.birthDate)
  if (!editableClient.value.spouse) {
    editableClient.value.spouse = { ...defaultSpouse }
  }
  editableClient.value.spouse.birthDate = formatDateForInput(editableClient.value.spouse.birthDate)
}

const cancelEdit = () => {
  isEditing.value = false
  editableClient.value = null
}

const saveChanges = async () => {
  if (!editableClient.value) return
  isSaving.value = true

  const payload = JSON.parse(JSON.stringify(editableClient.value))
  payload.familyNetIncome = calculatedFamilyIncome.value

  if (!isSpouseRequired.value) {
    payload.spouse = null
  }

  try {
    const updatedData = await updateClient(payload.id, payload)
    client.value = updatedData
    isEditing.value = false
    editableClient.value = null
    showSuccess('Cliente actualizado correctamente')
  } catch (err) {
    console.error('Error updating client:', err)
    showError('Error al guardar los cambios: ' + (err.message || 'Intente nuevamente'))
  } finally {
    isSaving.value = false
  }
}

const openDeleteModal = () => {
  deleteMessage.value = `¿Está seguro de que desea eliminar al cliente "${client.value?.holder.nombres}"? Esta acción no se puede deshacer.`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await deleteClient(route.params.id)
    showSuccess('Cliente eliminado del sistema')
    router.push('/clientes')
  } catch (err) {
    console.error('Error deleting client:', err)
    showError('Error al eliminar el cliente: ' + (err.message || 'Verifique dependencias'))
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

const runPreQualification = async () => {
  if (!client.value) return
  isPreQualifying.value = true
  try {
    const payload = {
      monthlyIncome: client.value.holder.monthlyNetIncome || 0,
      familyNetIncome: client.value.familyNetIncome || 0,
      age: getAge(client.value.holder.birthDate),
      appliesForIntegratorBonus: client.value.appliesForIntegratorBonus,
      isOwnerOfAnotherProperty: client.value.isOwnerOfAnotherProperty,
      hasReceivedPreviousSupport: client.value.receivedPreviousSupport,
      conadisCardNumber: client.value.conadisCardNumber
    }

    const result = await checkPreQualification(payload)

    client.value.bbpStatus = result.bbpStatus
    client.value.sustainableBonusStatus = result.sustainableBonusStatus
    client.value.integratorBonusStatus = result.integratorBonusStatus
    client.value.techoPropioStatus = result.techoPropioStatus
    client.value.recomendacion = result.recomendacion

  } catch (err) {
    console.error('Error running pre-qualification:', err)
    showError('No se pudo ejecutar la pre-calificación. Revise los datos.')
  } finally {
    isPreQualifying.value = false
  }
}

const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0]
  } catch (e) {
    return ''
  }
}

const getDocumentTypeText = (id) => {
  const type = documentTypes.find(t => t.id === id)
  return type ? type.name : 'N/A'
}

const getMaritalStatusText = (id) => {
  const status = maritalStatuses.find(s => s.id === id)
  return status ? status.name : 'N/A'
}

const getEducationLevelText = (id) => {
  const level = educationLevels.find(l => l.id === id)
  return level ? level.name : 'N/A'
}

const getEconomicActivityText = (id) => {
  const activity = economicActivities.find(a => a.id === id)
  return activity ? activity.name : 'N/A'
}

const getFundSourceText = (id) => {
  const source = fundSources.find(s => s.id === id)
  return source ? source.name : 'N/A'
}

const formatStatus = (status) => {
  if (!status) {
    return { text: 'No Determinado', class: 'text-gray-500' };
  }
  switch (status.toUpperCase()) {
    case 'ELIGIBLE':
    case 'APPLIES':
      return { text: 'aplica', class: 'text-green-700' };
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

onMounted(() => {
  fetchClient()
})
</script>

<style scoped>
.dl-row {
  @apply px-6 py-5 grid grid-cols-1 sm:grid-cols-3 sm:gap-4;
}
.dl-row:nth-child(even) {
  @apply bg-gray-50;
}
.dl-dt {
  @apply text-sm font-medium text-gray-500;
}
.dl-dd {
  @apply mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2;
}
.dl-dd-edit {
  @apply mt-1 sm:mt-0 sm:col-span-2;
}
.input-field {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150;
}
.btn-secondary-light {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150;
}
.btn-danger {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150;
}
.status-card {
  @apply bg-gray-50 px-5 py-4 rounded-lg border border-gray-200;
}
.status-dt {
  @apply text-sm font-medium text-gray-500;
}
.status-dd {
  @apply mt-1 text-base font-semibold;
}
.radio-checked {
  @apply bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500 relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all;
}
.radio-unchecked {
  @apply bg-white border-gray-300 hover:border-gray-400 relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all;
}
.radio-icon {
  @apply absolute top-3 right-3 h-5 w-5 text-indigo-600;
}
</style>