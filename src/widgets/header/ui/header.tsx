import { memo } from 'react'

import { ThemeSwitcher } from '~/features/theme-switcher'
import { Button } from '~/shared/ui'

export const Header = memo(() => (
  <div className='fixed left-[60px] right-0 top-0 z-30 h-[70px] border-b-[1px] border-solid border-b-secondary'>
    <div className='flex h-full w-full items-center justify-between px-6 py-3'>
      <div className='ml-auto flex gap-4'>
        <Button size='large' appearance='primary'>
          Войти
        </Button>
        <ThemeSwitcher />
      </div>
    </div>
  </div>
))
