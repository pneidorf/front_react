import { memo } from 'react'
import { Link } from 'react-router-dom'

import { tabs } from '../lib/constants'

import { ThemeSwitcher } from '~/features/theme-switcher'
import { Button, CurrentDate, Logo } from '~/shared/ui'

export const Header = memo(() => (
  <div className='fixed left-0 right-0 top-0 z-30 h-[70px]'>
    <div className='flex h-full w-full items-center justify-between px-6 py-3'>
      <div className='flex flex-row items-center'>
        <Logo />
        <div className='ml-8'>
          <CurrentDate />
        </div>
      </div>
      <div className='flex flex-row gap-6'>
        {tabs.map(({ title, href }) => (
          <Link
            className={`rounded-default bg-tertiary px-6 py-1 text-xl transition-all duration-300 hover:bg-secondary`}
            key={title}
            to={href}
          >
            {title}
          </Link>
        ))}
      </div>
      <div className='flex gap-4'>
        <Button size='large' appearance='primary'>
          Войти
        </Button>
        <ThemeSwitcher />
      </div>
    </div>
  </div>
))
