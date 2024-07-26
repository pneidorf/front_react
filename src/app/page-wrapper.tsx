import clsx from 'clsx'
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
    <div
      className={clsx('relative h-full w-full pt-[70px] text-primary', {
        'pl-[60px]': pathname !== RoutePath.auth
      })}
    >
      <Header />
      {pathname !== RoutePath.auth && <Sidebar />}
      {children}
    </div>
  )
}
