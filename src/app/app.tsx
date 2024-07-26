import { FC } from 'react'

import { PageWrapper } from './page-wrapper'
import { AppRouter } from './providers/route-provider'

export const App: FC = () => (
  <PageWrapper>
    <AppRouter />
  </PageWrapper>
)
