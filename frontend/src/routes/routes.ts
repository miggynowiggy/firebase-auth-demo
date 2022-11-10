import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: '',
        name: 'Home',
        meta: {
          isPrivateRoute: true
        },
        component: () => import("@/pages/Home.vue")
      }
    ]
  },
  {
    path: '',
    component: () => import("@/layouts/BlankLayout.vue"),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import("@/pages/Login.vue")
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import("@/pages/Register.vue")
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import("@/pages/ForgotPassword.vue")
      }
    ]
  }
]

export default routes;