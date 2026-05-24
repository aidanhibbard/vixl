import type { Router } from 'vue-router'

let routerInstance: Router | null = null

export const registerRouter = (router: Router): void => {
  routerInstance = router
}

export const getRouter = (): Router => {
  if (!routerInstance) {
    throw new Error('Router is not registered. Ensure main.ts calls registerRouter().')
  }
  return routerInstance
}
