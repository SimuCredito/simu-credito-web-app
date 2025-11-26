import { jwtDecode } from 'jwt-decode';
import type { Ref } from 'vue';

interface UserProfile {
    email: string | null;
    initials: string | null;
    name: string | null;
}

// Definimos la estructura interna de nuestro token decodificado
interface JwtPayload {
    sub: string;      // email standard
    email?: string;   // por si acaso
    firstName?: string; // Nuestro campo custom
    lastName?: string;  // Nuestro campo custom
    exp: number;
}

export const useAuth = () => {
    const { apiFetch } = useApi();
    const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
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

    // Esta función sigue siendo útil para mantener datos frescos, pero ya no es crítica para la carga inicial
    const fetchUserProfile = async () => {
        if (!token.value) return;
        try {
            const profile = await apiFetch('/auth/me');
            if (profile) {
                // Mapeo seguro de la respuesta del backend
                const firstName = profile.firstName;
                const lastName = profile.lastName;
                const email = profile.email;

                updateUserState(email, firstName, lastName);
            }
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            if (error.response && error.response.status === 401) {
                logout(); // Si el token no sirve, fuera
            }
        }
    }

    // Helper centralizado para actualizar el estado
    const updateUserState = (email: string, firstName?: string, lastName?: string) => {
        const fullName = setFullName(firstName, lastName);
        // Si no hay nombre completo, usamos el email, si no hay email, 'Usuario'
        const displayName = fullName || email || 'Usuario';
        const initials = getInitials(firstName, lastName) || (email ? email.substring(0, 2).toUpperCase() : '?');

        user.value = {
            email: email || null,
            name: displayName,
            initials: initials
        };
    }

    const initializeAuthFromToken = async () => {
        if (user.value) return;

        if (token.value) {
            try {
                // 1. LEER DATOS DIRECTAMENTE DEL TOKEN (INSTANTÁNEO)
                const decoded = jwtDecode<JwtPayload>(token.value);
                const email = decoded.sub || decoded.email || '';

                // Aquí ocurre la magia: leemos los campos custom que agregamos en el backend
                const tokenFirstName = decoded.firstName;
                const tokenLastName = decoded.lastName;

                // Actualizamos el estado inmediatamente con lo que hay en el token
                updateUserState(email, tokenFirstName, tokenLastName);

                // 2. (Opcional) Validar con backend en segundo plano si quieres estar 100% seguro de que sigue activo
                // await fetchUserProfile();

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
                // Al hacer login, tenemos la respuesta fresca
                updateUserState(response.email, response.firstName, response.lastName);
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
        user: readonly(user),
    }
}