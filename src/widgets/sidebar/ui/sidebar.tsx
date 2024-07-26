import { memo } from 'react'

export const Sidebar = memo(() => (
  <div className='fixed bottom-0 left-0 top-0 z-20 w-[60px] border-r-[1px] border-solid border-secondary'>
    <div className='flex h-full flex-col items-center justify-center py-3'></div>
  </div>
))
