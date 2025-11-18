// app/composables/useApi.ts

export const useApi = () => {
    const config = useRuntimeConfig()
    const token = useCookie('auth_token')

    const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
        const url = `${config.public.apiBase}${endpoint}`

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        if (token.value) {
            headers['Authorization'] = `Bearer ${token.value}`
        }

        try {
            // Hacemos la petición $fetch como antes
            return await $fetch(url, {
                ...options,
                headers: headers,
            })
        } catch (error) {
            // --- MODIFICACIÓN ---
            // Solo registra el error 401, pero no fuerces el logout aquí
            if (error.response && error.response.status === 401) {
                console.error(`[API] Unauthorized (401) request to ${url}. Token might be invalid or expired, OR user lacks permissions for this specific resource.`);

                // NO borramos el token ni redirigimos desde aquí
                // token.value = null
                // await navigateTo({ ... });
            }
            // --- FIN MODIFICACIÓN ---

            // Re-lanzamos el error para que el componente que llamó
            // pueda manejarlo si es necesario (ej. mostrar un mensaje)
            throw error
        }
    }

    return {
        apiFetch,
    }
}