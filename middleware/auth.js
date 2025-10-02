export default function ({ store, app, route, redirect }) {
  if (route.path === "/") {
    //  we are on a protected route
    // if (app.$fire.auth.currentUser == null) {
    //   //take them to sign in page
    //   return redirect("/login");
    // } else {
    //   //ff
    //   // return redirect("admin/dashboard");
    // }
  }else   if (route.path === "/admin") {
    //  we are on a protected route
    if (app.$fire.auth.currentUser == null) {
      //take them to sign in page
      return redirect("/login");
    } else {
      //ff
      // return redirect("admin/dashboard");
    }
  }

}
