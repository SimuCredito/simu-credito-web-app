<template>
  <NuxtPage />
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>