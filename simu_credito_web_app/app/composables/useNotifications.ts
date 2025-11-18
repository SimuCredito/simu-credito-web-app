export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useNotifications = () => {
  const notifications = ref<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    }

    notifications.value.push(newNotification)

    // Auto-dismiss after duration
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showSuccess = (message: string, duration?: number) => {
    addNotification({ message, type: 'success', duration })
  }

  const showError = (message: string, duration?: number) => {
    addNotification({ message, type: 'error', duration })
  }

  const showInfo = (message: string, duration?: number) => {
    addNotification({ message, type: 'info', duration })
  }

  const showWarning = (message: string, duration?: number) => {
    addNotification({ message, type: 'warning', duration })
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}