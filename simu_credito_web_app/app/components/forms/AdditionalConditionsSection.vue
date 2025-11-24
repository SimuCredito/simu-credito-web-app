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
            :class="['flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors', selectedGracePeriod === grace.id ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50']"
        >
          {{ grace.label }}
        </button>
      </div>
      <p v-if="selectedEntity" class="text-xs text-indigo-600 mt-1">{{ selectedEntity.entityName }} ofrece hasta {{ selectedEntity.periodoGracia }} meses de gracia.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">Duración en meses (max 6 meses)</label>
      <input v-model="graceDuration" type="number" min="0" max="6" class="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedEntity: { type: Object, default: null },
  initialGraceType: { type: String, default: 'none' },
  initialGraceDuration: { type: Number, default: 0 }
})

const gracePeriods = [ { id: 'none', label: 'Sin Gracia' }, { id: 'partial', label: 'Parcial' }, { id: 'total', label: 'Total' } ]

const selectedGracePeriod = ref(props.initialGraceType)
const graceDuration = ref(props.initialGraceDuration)

const emit = defineEmits(['update:gracePeriod', 'update:graceDuration'])

// Watchers para edición
watch(() => props.initialGraceType, (val) => selectedGracePeriod.value = val)
watch(() => props.initialGraceDuration, (val) => graceDuration.value = val)

// Lógica de entidad: Solo aplica si el usuario selecciona una entidad manualmente y NO estamos en modo edición restaurando valores
watch(() => props.selectedEntity, (newEntity) => {
  if (newEntity && newEntity.periodoGracia && graceDuration.value === 0) {
    graceDuration.value = newEntity.periodoGracia
    selectedGracePeriod.value = newEntity.periodoGracia > 0 ? 'partial' : 'none'
  }
}, { immediate: true })

watch(selectedGracePeriod, (val) => emit('update:gracePeriod', val))
watch(graceDuration, (val) => emit('update:graceDuration', val))

emit('update:gracePeriod', selectedGracePeriod.value)
emit('update:graceDuration', graceDuration.value)
</script>