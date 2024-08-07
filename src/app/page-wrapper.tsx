import { FC, ReactNode } from 'react'

import { Header } from '~/widgets/header'

interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper: FC<PageWrapperProps> = ({ children }) => (
  <div className='relative h-full w-full pt-[70px] text-primary'>
    <Header />
    {children}
  </div>
)
