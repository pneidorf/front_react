import { memo, useCallback } from 'react'
import { Suspense } from 'react'
import { Route, RouteProps, Routes } from 'react-router-dom'

import { routeConfig } from '~/shared/config/'

export const AppRouter = memo(() => {
  const renderWithWrapper = useCallback(
    ({ path, element }: RouteProps) => <Route key={path} path={path} element={element} />,
    []
  )

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      {' '}
      <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>
    </Suspense>
  )
})
