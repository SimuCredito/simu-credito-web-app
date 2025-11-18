                                                                                               <template>
  <div class="space-y-4">
    <div class="flex items-center">
      <h3 class="text-lg font-semibold text-gray-900">Condiciones Adicionales</h3>
      <button class="ml-2 text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <!-- Periodo de Gracia -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Período de Gracia</label>
      <div class="flex rounded-lg border border-gray-200 p-1 bg-white">
        <button
          v-for="grace in gracePeriods"
          :key="grace.id"
          @click="selectedGracePeriod = grace.id"
          :class="[
            'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors',
            selectedGracePeriod === grace.id
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ grace.label }}
        </button>
      </div>
      <p v-if="selectedEntity" class="text-xs text-indigo-600 mt-1">{{ selectedEntity.entityName }} ofrece hasta {{ selectedEntity.periodoGracia }} meses de gracia parcial para créditos MiVivienda.</p>
    </div>

    <!-- Duración en Meses -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Duración en Meses</label>
      <input
        v-model="graceDuration"
        type="number"
        min="0"
        max="6"
        class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedEntity: {
    type: Object,
    default: null
  }
})

const gracePeriods = [
  { id: 'none', label: 'Sin Gracia' },
  { id: 'partial', label: 'Parcial' },
  { id: 'total', label: 'Total' }
]

const selectedGracePeriod = ref('none')
const graceDuration = ref(0)

const emit = defineEmits(['update:gracePeriod', 'update:graceDuration'])

// Pre-load grace period from selected entity
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity && newEntity.periodoGracia) {
    graceDuration.value = newEntity.periodoGracia
    // Set grace period type based on duration
    if (newEntity.periodoGracia > 0) {
      selectedGracePeriod.value = 'partial' // Assuming partial for any grace period
    } else {
      selectedGracePeriod.value = 'none'
    }

    emit('update:gracePeriod', selectedGracePeriod.value)
    emit('update:graceDuration', graceDuration.value)
  }
}, { immediate: true })

// Observar cambios locales y emitirlos al padre
watch(selectedGracePeriod, (newValue) => {
  emit('update:gracePeriod', newValue)
})
watch(graceDuration, (newValue) => {
  emit('update:graceDuration', newValue)
})

// Emitir valores iniciales
emit('update:gracePeriod', selectedGracePeriod.value)
emit('update:graceDuration', graceDuration.value)
</script>