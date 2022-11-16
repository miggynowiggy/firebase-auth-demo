import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: {
          isPrivateRoute: true,
        },
        component: () => import('src/pages/Home.vue'),
      },
    ],
  },
  {
    path: '',
    component: () => import('src/layouts/BlankLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('src/pages/Login.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('src/pages/Register.vue'),
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('src/pages/ForgotPassword.vue'),
      },
    ],
  },
]

export default routes
