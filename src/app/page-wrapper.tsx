import { FC, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { RoutePath } from '~/shared/config'
import { Header } from '~/widgets/header'
import { Sidebar } from '~/widgets/sidebar'

interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper: FC<PageWrapperProps> = ({ children }) => {
  const { pathname } = useLocation()
  return (
    <div className='relative w-full bg-primary text-primary'>
      <Header />
      {pathname !== RoutePath.auth && <Sidebar />}
      {children}
    </div>
  )
}
