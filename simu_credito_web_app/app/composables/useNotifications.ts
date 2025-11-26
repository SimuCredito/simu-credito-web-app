import { ref, readonly } from 'vue'

export interface Notification {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

// --- CORRECCIÓN: Estado Global (Definido FUERA de la función) ---
// Al estar fuera, todos los componentes comparten la misma lista.
const notifications = ref<Notification[]>([])

export const useNotifications = () => {

    const removeNotification = (id: string) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2)
        const newNotification: Notification = {
            id,
            duration: 5000, // 5 segundos por defecto
            ...notification,
        }

        notifications.value.push(newNotification)

        // Auto-eliminar
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, newNotification.duration)
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
        notifications: readonly(notifications), // Solo lectura para los componentes
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
    }
}