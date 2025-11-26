<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">Inmueble Seleccionado</label>
    <div class="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300">
      <div v-if="property" class="flex items-center">
        <img
            :src="getMainPhoto(property.photos)"
            :alt="property.nombreProyecto"
            class="w-16 h-16 rounded-md object-cover mr-4"
            @error="handleImageError"
        />

        <div class="flex-1">
          <h3 class="font-semibold text-gray-900">{{ property.nombreProyecto }}</h3>

          <div class="flex items-baseline gap-2">
            <p class="text-lg font-bold text-indigo-600">
              {{ displayPrice }}
            </p>
            <span v-if="currency === 'USD'" class="text-xs text-gray-500">
              (Ref. S/ {{ property.propertyPrice?.toLocaleString() }})
            </span>
          </div>

          <span v-if="property.isSustainable" class="inline-block px-2 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded">
            Eco-Sostenible
          </span>
        </div>

        <button
            @click="$emit('change-property')"
            class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cambiar
        </button>
      </div>

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
import { computed } from 'vue'

const props = defineProps({
  property: { type: Object, default: null },
  currency: { type: String, default: 'PEN' },
  exchangeRate: { type: Number, default: 1 }
})

defineEmits(['change-property'])

const displayPrice = computed(() => {
  if (!props.property?.propertyPrice) return 'S/ 0';

  if (props.currency === 'PEN') {
    return `S/ ${props.property.propertyPrice.toLocaleString('es-PE')}`;
  } else {
    // Convertir a Dólares
    const priceInUsd = props.property.propertyPrice / props.exchangeRate;
    return `$ ${priceInUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
})

const getMainPhoto = (photos) => {
  if (!photos) return '/placeholder-logo.png';
  if (Array.isArray(photos) && photos.length > 0) return photos[0];
  if (typeof photos === 'string' && photos.startsWith('[')) {
    try { return JSON.parse(photos)[0] } catch { return '/placeholder-logo.png' }
  }
  return typeof photos === 'string' ? photos : '/placeholder-logo.png';
}

const handleImageError = (e) => {
  e.target.src = '/placeholder-logo.png';
}
</script>