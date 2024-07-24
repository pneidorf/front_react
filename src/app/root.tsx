import { FC } from 'react'

import './app.css'
import { AppRouter } from './providers/route-provider'

export const Root: FC = () => (
  <div>
    <AppRouter />
  </div>
)
