import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { RoutePath } from '../config'

import LogoIcon from '~/shared/assets/images/logo.png'

export const Logo = memo(() => {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(RoutePath.main)
  }

  return (
    <div className='cursor-pointer'>
      <img className='h-[50px] min-w-[50px]' src={LogoIcon} alt='logo' onClick={handleNavigate} />
    </div>
  )
})
