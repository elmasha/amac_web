export default function ({ app, route, redirect }) {
  // Wait for Firebase auth to initialize
  const user = app.$fire?.auth?.currentUser

  // Define protected routes (admin area)
  const protectedRoutes = [
    '/admin',
    '/admin',
  ]

  // Check if current route is protected
  const isProtected = protectedRoutes.some(path => 
    route.path === path || route.path.startsWith(path + '/')
  )

  // Not logged in & trying to access protected route → redirect to login
  if (isProtected && !user) {
    return redirect('/auth/login')
  }

  // Logged in & trying to access login page → redirect to admin
  if (user && route.path === '/auth/login') {
    return redirect('/admin')
  }
}