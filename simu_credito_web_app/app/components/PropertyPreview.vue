<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">Inmueble Seleccionado</label>
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div v-if="property" class="flex items-center">
        <!-- Property Image -->
        <img
          :src="property.photos?.[0] || '/placeholder-logo.png'"
          :alt="property.nombreProyecto"
          class="w-16 h-16 rounded-md object-cover mr-4"
        />

        <!-- Property Info -->
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900">{{ property.nombreProyecto }}</h3>
          <p class="text-lg font-bold text-indigo-600">S/ {{ property.propertyPrice?.toLocaleString() }}</p>
          <span v-if="property.isSustainable" class="inline-block px-2 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded">
            Eco-Sostenible
          </span>
        </div>

        <!-- Change Button -->
        <button
          @click="$emit('change-property')"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cambiar
        </button>
      </div>

      <!-- No property selected -->
      <div v-else class="text-center py-8 text-gray-500">
        <p>No se ha seleccionado ningún inmueble</p>
        <button
          @click="$emit('change-property')"
          class="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Seleccionar Inmueble
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  property: {
    type: Object,
    default: null
  }
})

defineEmits(['change-property'])
</script>