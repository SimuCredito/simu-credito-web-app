<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">Programa</label>
    <div class="flex rounded-lg border border-gray-200 p-1 bg-white">
      <button
        v-for="program in programs"
        :key="program.id"
        @click="$emit('program-selected', program.id)"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="selectedProgram === program.id ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'"
      >
        {{ program.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const programs = [
  { id: 'mivivienda', label: 'Nuevo Crédito MiVivienda' },
  { id: 'techo_propio', label: 'Programa Techo Propio' }
]

defineProps({
  selectedProgram: {
    type: String,
    default: 'mivivienda'
  }
})

defineEmits(['program-selected'])
</script>