<template>
  <div
    @click="handleSelect"
    class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md hover:border-indigo-300"
    :class="{ 'ring-2 ring-indigo-500 border-indigo-500': selected }"
  >
    <!-- Logo -->
    <div class="flex justify-center mb-4">
      <img
        :src="entity.photoUrl || '/placeholder-logo.png'"
        :alt="entity.entityName"
        class="w-16 h-16 object-contain"
      />
    </div>

    <!-- Name -->
    <div class="text-center mb-4">
      <h3 class="text-sm font-medium text-gray-900">{{ entity.entityName }}</h3>
      <p class="text-xs text-gray-500">{{ entity.entityCode }}</p>
    </div>

    <!-- Details -->
    <div class="space-y-2 text-xs text-gray-600">
      <div class="flex justify-between">
        <span>TEA:</span>
        <span class="font-medium">{{ entity.interestRateTea }}%</span>
      </div>
      <div class="flex justify-between">
        <span>TNA:</span>
        <span class="font-medium">{{ entity.interestRateTna }}%</span>
      </div>
      <div class="flex justify-between">
        <span>Plazo máx:</span>
        <span class="font-medium">{{ entity.maxTermMonths }} meses</span>
      </div>
      <div class="flex justify-between">
        <span>Monto máx:</span>
        <span class="font-medium">S/ {{ entity.maxLoanAmount?.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between">
        <span>Gracia:</span>
        <span class="font-medium">{{ entity.periodoGracia }} meses</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  entity: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const handleSelect = () => {
  console.log('Entity selected:', props.entity)
  emit('select', props.entity)
}
</script>