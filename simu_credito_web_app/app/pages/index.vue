<template>
  <div></div>
</template>

<script setup>
defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth() //

  if (isAuthenticated()) {
    return navigateTo('/dashboard')
  } else {
    return navigateTo('/login')
  }
})
</script>