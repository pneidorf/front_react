import { RouteProps } from 'react-router-dom'

import { AuthPage } from '~/pages/auth'
import { MainPage } from '~/pages/main-page'
import { NotFoundPage } from '~/pages/not-found'

export const AppRoutes = {
  MAIN: 'main',
  AUTH: 'auth',
  NOTFOUND: 'notFound',
  MAP: 'map'
} as const

export type AppRoutesT = (typeof AppRoutes)[keyof typeof AppRoutes]

export const RoutePath: Record<AppRoutesT, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.AUTH]: '/auth',
  [AppRoutes.MAP]: '/map',
  [AppRoutes.NOTFOUND]: '*'
}

export const routeConfig: Record<AppRoutesT, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />
  },
  [AppRoutes.NOTFOUND]: {
    path: RoutePath.notFound,
    element: <NotFoundPage />
  },
  [AppRoutes.AUTH]: {
    path: RoutePath.auth,
    element: <AuthPage />
  },
  [AppRoutes.MAP]: {
    path: RoutePath.map,
    element: <AuthPage />
  }
}
