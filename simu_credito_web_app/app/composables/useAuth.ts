import { jwtDecode } from 'jwt-decode';
import type { Ref } from 'vue';

interface UserProfile {
    email: string | null;
    initials: string | null;
    name: string | null;
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

    // Intenta reconstruir el usuario desde el token al recargar (si el token contiene info)
    const initializeAuthFromToken = () => {
        // Solo ejecuta si useState está vacío pero el token existe
        if (!user.value && token.value) {
            try {
                // Intenta decodificar el token para buscar datos
                const decoded: { sub?: string, firstName?: string, lastName?: string, name?: string, email?: string } = jwtDecode(token.value);

                const firstName = decoded.firstName;
                const lastName = decoded.lastName;
                // Intenta obtener nombre completo del campo 'name' o construirlo
                const fullName = decoded.name || setFullName(firstName, lastName);
                // Prioriza email de 'sub', luego 'email', luego null
                const email = decoded.sub || decoded.email || null;
                // Calcula iniciales si hay nombre
                const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : (email ? email.substring(0,2).toUpperCase() : '?');

                // Si encontramos al menos email o nombre en el token, actualizamos el estado
                if (email || fullName) {
                    user.value = {
                        email: email,
                        name: fullName,
                        initials: initials
                    };
                } else {
                    user.value = null; // Token no contiene información útil
                }

            } catch (e) {
                console.error("Error decoding token during initialization, clearing token:", e);
                token.value = null; // Token inválido
                user.value = null;
            }
        } else if (!token.value) {
            user.value = null; // Asegura que el usuario esté nulo si no hay token
        }
    }

    callOnce(initializeAuthFromToken);

    const login = async (email: string, password: string) => {
        user.value = null; // Limpiar estado previo
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (response.token) {
                token.value = response.token;

                // Asume que la respuesta del login contiene estos campos
                const respFirstName = response.firstName;
                const respLastName = response.lastName;
                const respEmail = response.email; // O usa response.sub si es el caso

                const calculatedName = setFullName(respFirstName, respLastName);
                const calculatedInitials = getInitials(respFirstName, respLastName);

                // Actualiza el estado useState
                user.value = {
                    email: respEmail || null, // Asegúrate de que tu API devuelve 'email' o ajusta el nombre
                    initials: calculatedInitials || (respEmail ? respEmail.substring(0,2).toUpperCase() : '?'),
                    name: calculatedName || respEmail || null // Fallback a email si no hay nombre
                };

            } else {
                // Si no hay token en la respuesta, limpia el usuario
                user.value = null;
            }
            return response;
        } catch (error) {
            user.value = null; // Limpia en caso de error
            throw error;
        }
    }

    const register = async (firstName: string, lastName: string, email: string, password: string, phoneNumber?: string, companyName?: string) => {
        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email, password, firstName, lastName, phoneNumber, companyName
                }),
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        token.value = null;
        user.value = null; // Limpia useState
        navigateTo('/login');
    }

    const isAuthenticated = () => {
        // Puedes basar esto solo en el token o requerir también datos de usuario
        return !!token.value;
        // return !!token.value && !!user.value;
    }

    return {
        login,
        register,
        logout,
        isAuthenticated,
        user: readonly(user),
    }
}

