import { FC } from 'react'
import { ToastContainer } from 'react-toastify'

import { PageWrapper } from './page-wrapper'
import { AppRouter } from './providers/route-provider'

export const App: FC = () => (
  <div className='h-[100vh] w-full bg-white dark:bg-black'>
    <PageWrapper>
      <AppRouter />
    </PageWrapper>
    <ToastContainer />
  </div>
)
