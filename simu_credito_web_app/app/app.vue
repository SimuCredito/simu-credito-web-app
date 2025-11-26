<template>
  <div>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import NotificationToast from "~/components/notifications/NotificationToast.vue";
</script>