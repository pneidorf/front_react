/* eslint-disable i18next/no-literal-string */

/* eslint-disable max-len */
import { memo, useEffect, useState } from 'react'

import Mobile from '../shared/assets/svg/auth/Mobile.svg?react'
import MapMobile from '../shared/assets/svg/auth/mapMobile.svg?react'

import { LoginForm, RegistrationForm } from '~/features/auth/ui/auth'

interface AuthProps {
  firstIsActive: boolean
  handleClick: () => void
  setFirstIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

const DesktopAuth = ({ firstIsActive, handleClick, setFirstIsActive }: AuthProps) => (
  <div className='reg-window-block flex h-full'>
    <div className='grid basis-1/2 grid-cols-10 grid-rows-6 gap-2 bg-[#202020]'>
      <div className='col-span-10 bg-[#202020]'>
        <div className='ml-28 mt-10 text-[#ffffff]'>
          <p className='text-[32px]'>Слоган</p>
          <p className='text-[25px]'>пара предложений о приложении</p>
        </div>
      </div>
      <div className='phone outline-3 col-span-6 col-start-2 row-span-5 mx-2 flex grid grid-cols-4 grid-rows-8 gap-2 rounded-t-[75px] border-x-8 border-t-8 border-black bg-gray-400 outline outline-offset-2 outline-white'>
        <div className='col-span-2 row-start-8 grid items-center justify-items-end'>
          <button className='mr-2 rounded-md text-[#ffffff]'>
            <MapMobile />
          </button>
        </div>
        <div className='col-span-2 col-start-3 row-start-8 grid items-center justify-items-start'>
          <button className='ml-2 rounded-md text-[#ffffff]'>
            <Mobile />
          </button>
        </div>
      </div>
      <div className='col-span-2 col-start-9 row-span-2 row-start-3 flex flex-col gap-2'>
        <button
          onClick={handleClick}
          className={`text-3xl h-20 rounded-l-full ${firstIsActive ? 'bg-[#ffffff] text-[#202020]' : 'bg-[#202020] text-[#ffffff]'}`}
        >
          sign in
        </button>
        <button
          onClick={handleClick}
          className={`text-3xl h-20 rounded-l-full ${firstIsActive ? 'bg-[#202020] text-[#ffffff]' : 'bg-[#ffffff] text-[#202020]'}`}
        >
          sign up
        </button>
      </div>
    </div>
    <div className='grid basis-1/2 grid-rows-7 bg-[#ffffff]'>
      <div className='row-start-2 grid justify-center'></div>
      <div className='h-100 row-span-3 row-start-3 grid justify-center'>
        {firstIsActive ? <LoginForm /> : <RegistrationForm setFirstIsActive={setFirstIsActive} />}
      </div>
    </div>
  </div>
)

const MobileAuth = ({ firstIsActive, handleClick, setFirstIsActive }: AuthProps) => (
  <div className='reg-window-block flex h-full flex-col items-center p-4'>
    <div className='w-full bg-[#202020] p-6 text-center'>
      <p className='text-[22px] text-[#ffffff]'>Слоган</p>
      <p className='text-[15px] text-[#ffffff]'>пара предложений о приложении</p>
    </div>
    <div className='flex w-full flex-col items-center gap-4'>
      <div className='flex gap-4'>
        <button
          onClick={handleClick}
          className={`h-12 w-32 rounded-md text-[1.5rem] ${firstIsActive ? 'bg-[#ffffff] text-[#202020]' : 'bg-[#202020] text-[#ffffff]'}`}
        >
          sign in
        </button>
        <button
          onClick={handleClick}
          className={`h-12 w-32 rounded-md text-[1.5rem] ${firstIsActive ? 'bg-[#202020] text-[#ffffff]' : 'bg-[#ffffff] text-[#202020]'}`}
        >
          sign up
        </button>
      </div>
      <div className='flex w-full justify-center'>
        {firstIsActive ? <LoginForm /> : <RegistrationForm setFirstIsActive={setFirstIsActive} />}
      </div>
      <div className='flex gap-4'>
        <button className='rounded-md text-[#ffffff]'>
          <MapMobile />
        </button>
        <button className='rounded-md text-[#ffffff]'>
          <Mobile />
        </button>
      </div>
    </div>
  </div>
)

export const AuthPage = memo(() => {
  const [firstIsActive, setFirstIsActive] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640)

  const handleClick = () => setFirstIsActive(!firstIsActive)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile ? (
    <MobileAuth
      firstIsActive={firstIsActive}
      handleClick={handleClick}
      setFirstIsActive={setFirstIsActive}
    />
  ) : (
    <DesktopAuth
      firstIsActive={firstIsActive}
      handleClick={handleClick}
      setFirstIsActive={setFirstIsActive}
    />
  )
})
