export default defineNuxtRouteMiddleware((to, from) => {
    console.log('[AUTH MIDDLEWARE] Middleware triggered for route:', to.fullPath)

    const { isAuthenticated } = useAuth()
    const authenticated = isAuthenticated()
    console.log('[AUTH MIDDLEWARE] User authenticated:', authenticated)

    if (!authenticated) {
        console.log('[AUTH MIDDLEWARE] Redirecting to login with redirect:', to.fullPath)
        // Redirige si no está autenticado (funciona en servidor y cliente)
        return navigateTo({
            path: '/login',
            query: {
                redirect: '/login'
            }
        })
    }

    console.log('[AUTH MIDDLEWARE] Allowing access to protected route')
})