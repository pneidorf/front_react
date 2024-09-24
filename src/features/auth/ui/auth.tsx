// import axios from 'axios'
// import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import { Logo } from '~/shared/ui'
// import { useMutationLogin } from '../api/useMutationLogin'
import { IAuth } from '../model/types'
// import { Input } from './validation'
import { Input } from '../validation/Input'
import {
  email_validation,
  login_password_validation, //   name_validation,
  password_validation,
  repeat_validation //   surname_validation
} from '../validation/utils/inputValidations'

import { api } from '~/shared/api'

interface IReg {
  setFirstIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

// import { api } from '~/shared/api/api'

export const LoginForm = () => {
  const navigate = useNavigate()
  // const methods = useForm()
  const methods = useForm<IAuth>()

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: api.login,
    onSuccess: () => {
      navigate('/')
      toast.info('Успешная авторизация', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
        // theme: 'dark'
        // transition: Flip
      })
    },
    onError: () => {
      toast.error('Ошибка авторизации!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
        // theme: 'dark'
        // transition: Flip
      })
    }
  })

  const handleLogin = async ({ email, password }: IAuth) => {
    console.log('Submitting: ', { email, password })
    mutation.mutate({ email, password })
  }
  // Протипизировать, что в onSubmit приходит ILogin, и можно кинуть там внутри мутацию вместо handleLogin
  // const onSubmit = methods.handleSubmit(data => {
  //   handleLogin(data)
  // })

  const onSubmit = methods.handleSubmit((data: IAuth) => {
    handleLogin(data)
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        noValidate
        autoComplete='off'
        className='registration-container-form max-h-full w-[500px]'
      >
        <div className='mb-14 w-full'>
          <Input {...email_validation} />
        </div>
        <div className='mb-2 mt-14 w-full'>
          <Input {...login_password_validation} />
        </div>
        <div className='for-reg pb-[10px]'>
          <Link to={''}>
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <p className='text-lg text-[#9e9e9e] underline'>Забыли пароль?</p>
          </Link>
        </div>
        <div className='flex w-full justify-center'>
          <button
            className='w-full max-w-32 rounded-[14px] bg-[#deb0f4] p-3 text-white hover:bg-[#b44be5]'
            type='submit'
            // eslint-disable-next-line i18next/no-literal-string
          >
            Войти
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export const RegistrationForm = ({ setFirstIsActive }: IReg) => {
  // const navigate = useNavigate()
  // const methods = useForm()
  const methods = useForm<IAuth>()

  const mutation = useMutation({
    mutationKey: ['register'],
    mutationFn: api.register,
    onSuccess: () => {
      // alert('Проверьте почту')
      toast.success('Проверьте почту!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
        // theme: 'dark'
        // transition: Flip
      })
      // navigate('/auth')
      setFirstIsActive(true)
    },
    onError: () => {
      toast.error('Пользователь с таким Email уже существует', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
        // theme: 'dark'
        // transition: Flip
      })
    }
  })

  const handleRegistration = async ({ email, password }: IAuth) => {
    console.log('Submitting: ', { email, password })
    mutation.mutate({ email, password })
  }

  const onSubmit = methods.handleSubmit((data: IAuth) => {
    console.log('Data: ', { data })
    handleRegistration({ email: data.email, password: data.password })
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        noValidate
        autoComplete='off'
        className='pre-registration-container-form max-h-full w-[500px]'
      >
        <div className='mb-14 w-full'>
          <Input {...email_validation} />
        </div>
        <div className='my-14 w-full'>
          <Input {...password_validation} />
        </div>
        <div className='mb-2 mt-14 w-full pb-[15px]'>
          <Input {...repeat_validation} />
        </div>
        <div className='flex w-full justify-center'>
          <button
            className='w-full max-w-48 rounded-[14px] bg-[#deb0f4] p-3 text-white hover:bg-[#b44be5]'
            type='submit'
            // eslint-disable-next-line i18next/no-literal-string
          >
            Зарегестрироваться
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
