/* eslint-disable i18next/no-literal-string */
import { memo } from 'react'
import { useState } from 'react'

// import phone from '../features/auth/icons/phone'
import Mobile from '../shared/assets/svg/auth/Mobile.svg?react'
import MapMobile from '../shared/assets/svg/auth/mapMobile.svg?react'

import { LoginForm, RegistrationForm } from '~/features/auth/ui/auth'
import LogoIcon from '~/shared/assets/images/logo.png'

// eslint-disable-next-line i18next/no-literal-string
export const AuthPage = memo(() => {
  const [firstIsActive, setFirstIsActive] = useState(true)
  const handleClick = () => {
    setFirstIsActive(!firstIsActive)
  }
  return (
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
              {/*  */}
              <MapMobile />
            </button>
          </div>
          <div className='col-span-2 col-start-3 row-start-8 grid items-center justify-items-start'>
            <button className='ml-2 rounded-md text-[#ffffff]'>
              {/*  */}
              <Mobile />
            </button>
          </div>
        </div>
        <div className='col-span-2 col-start-9 row-span-2 row-start-3 flex flex-col gap-2'>
          <button
            onClick={handleClick}
            className={
              firstIsActive
                ? 'text-3xl h-20 rounded-l-full bg-[#ffffff] text-[#202020]'
                : 'text-3xl h-20 rounded-l-full bg-[#202020] text-[#ffffff]'
            }
          >
            sign in
          </button>
          <button
            onClick={handleClick}
            className={
              firstIsActive
                ? 'text-3xl h-20 rounded-l-full bg-[#202020] text-[#ffffff]'
                : 'text-3xl h-20 rounded-l-full bg-[#ffffff] text-[#202020]'
            }
          >
            sign up
          </button>
        </div>
      </div>
      <div className='grid basis-1/2 grid-rows-7 bg-[#ffffff]'>
        <div className='row-start-2 grid justify-center'>
          {/* <p className='text-2xl h-[172px] w-[172px]'> */}
          <img className='h-[120px] min-w-[120px]' src={LogoIcon} />
          {/* </p> */}
        </div>
        <div className='h-100 row-span-3 row-start-3 grid justify-center'>
          {firstIsActive ? <LoginForm /> : <RegistrationForm setFirstIsActive={setFirstIsActive} />}
        </div>
      </div>
    </div>
  )
})
