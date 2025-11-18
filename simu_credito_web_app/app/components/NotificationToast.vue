<template>
  <TransitionGroup
    name="notification"
    tag="div"
    class="notification-container"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="['notification-toast', `notification-${notification.type}`]"
    >
      <div class="notification-content">
        <span class="notification-icon">
          <Icon v-if="notification.type === 'success'" name="heroicons:check-circle" />
          <Icon v-else-if="notification.type === 'error'" name="heroicons:exclamation-triangle" />
          <Icon v-else-if="notification.type === 'warning'" name="heroicons:exclamation-circle" />
          <Icon v-else name="heroicons:information-circle" />
        </span>
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button
        class="notification-close"
        @click="removeNotification(notification.id)"
      >
        <Icon name="heroicons:x-mark" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification-toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideIn 0.3s ease-out;
}

.notification-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.notification-error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.notification-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.notification-info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.notification-icon {
  flex-shrink: 0;
}

.notification-message {
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Vue transition classes */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>