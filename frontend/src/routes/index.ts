import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'
import { useUserStore } from 'src/store/user'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((nextPage, prevPage) => {
  const user = useUserStore()

  // If the user is not yet logged in, redirect them to the Login page
  if (nextPage.meta?.isPrivateRoute && !user.isLoggedIn) {
    return { name: 'Login', query: { redirectTo: prevPage.fullPath } }
  }

  if (
    nextPage.name === 'Login' &&
    user.isLoggedIn &&
    user.authUser?.emailVerified
  ) {
    return { name: 'Home', replace: true }
  }
})

export default router
