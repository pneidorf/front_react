/* eslint-disable max-len */
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { tabs } from '../lib/constants'

import { LangSwitcher } from '~/features/lang-switcher'
import { ThemeSwitcher } from '~/features/theme-switcher'
import { RoutePath } from '~/shared/config'
import { Button, CurrentDate } from '~/shared/ui'

// import { Logo } from '~/shared/ui'

export const Header = memo(() => {
  const { t } = useTranslation('header')

  return (
    <div className='fixed left-0 right-0 top-0 z-30 h-[70px]'>
      <div className='phone:gap-[0.8rem] flex h-full w-full items-center justify-between px-6 py-3'>
        <div className='flex flex-row items-center'>
          {/* <Logo /> */}
          {/* <div className='ml-8'> */}
          <CurrentDate />
        </div>
        <div className='flex flex-row gap-6'>
          {tabs.map(({ title, href }) => (
            <Link
              className={`phone:text-[1rem] rounded-default bg-tertiary px-6 py-1 text-xl transition-all duration-300 hover:bg-secondary`}
              key={title}
              to={href}
            >
              {t(title)}
            </Link>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <Link to={RoutePath.auth}>
            <Button
              size='large'
              appearance='primary'
              className='phone:w-[5rem] phone:h-[3rem] phone:text-[1rem] phone:flex phone:flex-row phone:justify-center'
            >
              {t('login')}
            </Button>
          </Link>
          <ThemeSwitcher />
          <LangSwitcher />
        </div>
      </div>
    </div>
  )
})
