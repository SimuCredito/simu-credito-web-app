// app/composables/useAuth.ts
import { jwtDecode } from 'jwt-decode';
import type { Ref } from 'vue';

// 1. Ampliamos la interfaz del perfil para incluir los nuevos campos
interface UserProfile {
    email: string | null;
    initials: string | null;
    name: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    companyName?: string | null;
    role?: string | null;
}

interface JwtPayload {
    sub: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    exp: number;
}

export const useAuth = () => {
    const { apiFetch } = useApi();
    const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    const user: Ref<UserProfile | null> = useState<UserProfile | null>('user-profile', () => null);

    const setFullName = (firstName: string | undefined | null, lastName: string | undefined | null): string | null => {
        const first = firstName || '';
        const last = lastName || '';
        const fullName = `${first} ${last}`.trim();
        return fullName || null;
    }

    const getInitials = (firstName: string | undefined | null, lastName: string | undefined | null): string | null => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        const initials = (firstInitial + lastInitial).trim();
        return initials || null;
    }

    // 2. Helper centralizado mejorado: Ahora acepta un objeto completo de datos
    const updateUserState = (data: any) => {
        // Soporte para cuando data viene del token (campos limitados) o del backend (perfil completo)
        const email = data.email || data.sub;
        const fullName = setFullName(data.firstName, data.lastName);
        const displayName = fullName || email || 'Usuario';
        const initials = getInitials(data.firstName, data.lastName) || (email ? email.substring(0, 2).toUpperCase() : '?');

        user.value = {
            email: email || null,
            name: displayName,
            initials: initials,
            firstName: data.firstName,
            lastName: data.lastName,
            // Estos campos pueden ser undefined si vienen del token, pero se llenarán con fetchUserProfile
            phoneNumber: data.phoneNumber,
            companyName: data.companyName,
            role: data.role
        };
    }

    const fetchUserProfile = async () => {
        if (!token.value) return;
        try {
            const profile = await apiFetch('/auth/me');
            if (profile) {
                updateUserState(profile);
            }
            return profile;
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
            throw error;
        }
    }

    const initializeAuthFromToken = async () => {
        if (user.value) return;

        if (token.value) {
            try {
                const decoded = jwtDecode<JwtPayload>(token.value);
                // Inicializamos rápido con lo que hay en el token
                updateUserState(decoded);

                // Opcional: Cargar datos completos en segundo plano (telefono, empresa)
                // fetchUserProfile();
            } catch (e) {
                console.error("Error decoding token:", e);
                token.value = null;
                user.value = null;
            }
        } else {
            user.value = null;
        }
    }

    callOnce(initializeAuthFromToken);

    const login = async (email: string, password: string) => {
        user.value = null;
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (response.token) {
                token.value = response.token;
                // La respuesta de login suele traer datos básicos, actualizamos estado
                updateUserState(response);
            }
            return response;
        } catch (error) {
            user.value = null;
            throw error;
        }
    }

    const register = async (firstName: string, lastName: string, email: string, password: string, phoneNumber?: string, companyName?: string) => {
        try {
            return await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, firstName, lastName, phoneNumber, companyName }),
            });
        } catch (error) {
            throw error;
        }
    }

    // 3. NUEVO MÉTODO: Actualizar Perfil
    const updateProfile = async (profileData: { firstName: string; lastName: string; phoneNumber?: string; companyName?: string; password?: string }) => {
        try {
            const response = await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });

            // Si la respuesta es exitosa, actualizamos el estado local inmediatamente
            if (response) {
                updateUserState(response);
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        token.value = null;
        user.value = null;
        navigateTo('/login');
    }

    const isAuthenticated = () => {
        return !!token.value;
    }

    return {
        login,
        register,
        logout,
        isAuthenticated,
        fetchUserProfile,
        updateProfile, // Exportamos la nueva función
        user: readonly(user),
    }
}