import { RouteProps } from 'react-router-dom'

import { AuthPage, MainPage, MapPage, NotFoundPage, PlotsPage } from '~/pages'
import { DiagramsPage } from '~/pages/diagrams-page'

export const AppRoutes = {
  MAIN: 'main',
  AUTH: 'auth',
  NOTFOUND: 'notFound',
  MAP: 'map',
  PLOTS: 'plots',
  DIAGRAMS: 'diagrams'
} as const

export type AppRoutesT = (typeof AppRoutes)[keyof typeof AppRoutes]

export const RoutePath: Record<AppRoutesT, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.AUTH]: '/auth',
  [AppRoutes.MAP]: '/map',
  [AppRoutes.NOTFOUND]: '*',
  [AppRoutes.PLOTS]: '/plots',
  [AppRoutes.DIAGRAMS]: '/diagrams'
}

export const routeConfig: Record<AppRoutesT, RouteProps> = {
  [AppRoutes.NOTFOUND]: {
    path: RoutePath.notFound,
    element: <NotFoundPage />
  },
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />
  },
  [AppRoutes.AUTH]: {
    path: RoutePath.auth,
    element: <AuthPage />
  },
  [AppRoutes.MAP]: {
    path: RoutePath.map,
    element: <MapPage />
  },
  [AppRoutes.PLOTS]: {
    path: RoutePath.plots,
    element: <PlotsPage />
  },
  [AppRoutes.DIAGRAMS]: {
    path: RoutePath.diagrams,
    element: <DiagramsPage />
  }
}
