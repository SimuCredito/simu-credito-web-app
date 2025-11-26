<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="space-y-8">

      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Centro de Ayuda</h1>
        <p class="mt-2 text-lg text-gray-600">¿Cómo podemos ayudarte hoy?</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-5 hover:shadow-md transition-all duration-200 hover:border-indigo-200 group">
          <div class="flex-shrink-0 bg-indigo-50 rounded-lg p-3 group-hover:bg-indigo-100 transition-colors">
            <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 text-lg">Soporte por Correo</h3>
            <p class="text-sm text-gray-500 mt-1 leading-relaxed">Envíanos tus dudas detalladas y te responderemos a la brevedad.</p>
            <a href="mailto:soporte@simucredito.com" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 inline-flex items-center">
              soporte@simucredito.com
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-5 hover:shadow-md transition-all duration-200 hover:border-green-200 group">
          <div class="flex-shrink-0 bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 text-lg">Línea Directa</h3>
            <p class="text-sm text-gray-500 mt-1 leading-relaxed">Atención inmediata de Lunes a Viernes de 9:00 am a 6:00 pm.</p>
            <a href="tel:+5112345678" class="text-green-600 hover:text-green-800 text-sm font-medium mt-3 inline-flex items-center">
              (01) 123-4567
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/80">
          <h3 class="text-lg font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Preguntas Frecuentes
          </h3>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="(faq, index) in faqs" :key="index" class="p-0">
            <button
                @click="toggleFaq(index)"
                class="flex justify-between items-center w-full text-left px-6 py-5 focus:outline-none group hover:bg-gray-50 transition-colors"
            >
              <span class="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{{ faq.question }}</span>
              <span class="ml-6 flex-shrink-0 bg-gray-100 rounded-full p-1 group-hover:bg-indigo-100 transition-colors">
                <svg
                    class="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transform transition-transform duration-200"
                    :class="{'rotate-180': faq.open}"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="faq.open" class="px-6 pb-5 overflow-hidden">
                <div class="pt-2 border-t border-dashed border-gray-100">
                  <p class="text-sm text-gray-600 leading-relaxed">{{ faq.answer }}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const faqs = ref([
  {
    question: '¿Cómo se calcula el Bono del Buen Pagador?',
    answer: 'El Bono del Buen Pagador (BBP) se calcula automáticamente según el valor de la vivienda ingresado y los rangos vigentes configurados en el sistema. Si la vivienda es sostenible, se aplica el bono correspondiente. Recuerda mantener actualizados los parámetros en la sección de Configuración.',
    open: false
  },
  {
    question: '¿Puedo editar una simulación ya generada?',
    answer: 'Sí, puedes ir a la sección de "Historial", seleccionar la simulación deseada y, una vez en la vista de resultados, usar el botón "Editar Parámetros" situado en la parte superior derecha. Esto cargará los datos en el simulador para que puedas hacer ajustes y recalcular.',
    open: false
  },
  {
    question: '¿Cómo actualizo los parámetros de la UIT o el Tipo de Cambio?',
    answer: 'Ve a la sección de Configuración > Valores Globales. Allí podrás modificar el valor de la UIT y el tipo de cambio del día. Estos valores afectarán a todas las nuevas simulaciones que realices.',
    open: false
  },
  {
    question: '¿La información de mis clientes es segura?',
    answer: 'Absolutamente. Toda la información de tus clientes y sus simulaciones está protegida y encriptada. Solo tú tienes acceso a esta información a través de tu cuenta de agente autorizada.',
    open: false
  },
  {
    question: '¿Cómo funciona la pre-calificación de clientes?',
    answer: 'La pre-calificación evalúa los ingresos, edad y propiedades del cliente para determinar a qué bonos del estado puede aplicar (BBP, Bono Verde, Techo Propio, etc.). Es una herramienta de ayuda y no garantiza la aprobación final del crédito por parte de la entidad financiera.',
    open: false
  }
])

const toggleFaq = (index) => {
  // Opcional: Cerrar otros al abrir uno (comportamiento de acordeón estricto)
  // faqs.value.forEach((faq, i) => {
  //   if (i !== index) faq.open = false
  // })
  faqs.value[index].open = !faqs.value[index].open
}
</script>