import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import pipeline from '../middleware/pipeline'
import { useValidationStore } from '../stores/validation'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  scrollBehavior() {
    window.scrollTo(0, 0)
  }
})

// navigation guards for language
router.beforeEach(async (to, from, next) => {
  // document.title = `${process.env.VUE_APP_NAME}`
  document.title = `${process.env.VUE_APP_NAME} | ${to.meta.title}`

  const validation = useValidationStore()
  validation.clearErrors()

  // Middleware
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]

  const context = {
    to,
    from,
    next,
    router
  }

  return middleware[0]({
    ...context,
    next: pipeline(context, middleware, 1),
  })

})
export default router
