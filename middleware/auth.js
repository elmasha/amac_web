export default function ({ app, route, redirect }) {
  const user = app.$fire?.auth?.currentUser

  const protectedRoutes = [
    '/admin',
  ]

 

//   const authRoutes = [
//     '/employer',
//     '/auth/account'
//   ]

//   const authRoutes1 = [
//     '/bureau',
//     '/auth/account'
//   ]

  // Not logged in & trying to access protected routes
  // if (protectedRoutes.includes(route.path) && !user) {
  //   return redirect('/login')
  // }



  // Logged in & trying to access auth pages
//   if (authRoutes.includes(route.path) && user) {
//     return redirect('/register/employer')
//   }
//   // Logged in & trying to access auth pages
//   if (authRoutes1.includes(route.path) && user) {
//     return redirect('/register/bureau')
//   }
}
