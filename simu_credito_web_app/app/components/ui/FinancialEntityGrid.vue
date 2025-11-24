<template>
  <div class="space-y-6">
    <!-- Section Title -->
    <div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Seleccionar entidad financiera</h2>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FinancialEntityCard
        v-for="entity in displayedEntities"
        :key="entity.id"
        :entity="entity"
        :selected="selectedEntity?.id === entity.id"
        @select="handleEntitySelect"
      />
    </div>

    <!-- View More Link -->
    <div class="text-center">
      <button
        @click="showAll = !showAll"
        class="text-indigo-600 hover:text-indigo-800 underline text-sm"
      >
        {{ showAll ? 'Mostrar menos' : `Ver otras ${totalEntities - displayedEntities.length} entidades...` }}
      </button>
    </div>

    <!-- Info Message -->
    <div v-if="selectedEntity" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-800">
        Al seleccionar '{{ selectedEntity.entityName }}', la tasa y las opciones de gracia se pre-cargarán con los valores referenciales de esta entidad.
      </p>
    </div>

    <!-- Optional Selection Message -->
    <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p class="text-sm text-gray-600">
        <span class="font-medium">Selección opcional:</span> Puede seleccionar una entidad financiera para pre-cargar valores referenciales, o continuar sin selección.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FinancialEntityCard from '~/components/ui/FinancialEntityCard.vue'

const props = defineProps({
  entities: {
    type: Array,
    default: () => []
  },
  selectedEntity: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['entity-selected'])

const showAll = ref(false)

const displayedEntities = computed(() => {
  if (showAll.value) {
    return props.entities
  }
  return props.entities.slice(0, 6) // Show first 6 entities initially
})

const totalEntities = computed(() => props.entities.length)

const handleEntitySelect = (entity) => {
  console.log('Entity selected in grid:', entity)
  emit('entity-selected', entity)
}
</script>