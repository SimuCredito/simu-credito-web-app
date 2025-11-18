<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="property in properties"
      :key="property.id"
      class="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <!-- Property Image -->
      <img
        :src="property.photos?.[0] || '/placeholder-logo.png'"
        :alt="property.nombreProyecto"
        class="w-full h-48 object-cover"
      />

      <!-- Content -->
      <div class="p-4">
        <!-- Top row: Eco tag and Select button -->
        <div class="flex justify-between items-center mb-2">
          <span
            v-if="property.isSustainable"
            class="px-2 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded"
          >
            Eco-Sostenible
          </span>
          <button
            @click="$emit('select-property', property)"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Seleccionar
          </button>
        </div>

        <!-- Property Name -->
        <h3 class="font-semibold text-gray-900 mb-1">{{ property.nombreProyecto }}</h3>

        <!-- Property Price -->
        <p class="text-lg font-bold text-indigo-600">S/ {{ property.propertyPrice?.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  properties: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select-property'])
</script>