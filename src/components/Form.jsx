/*-------------------------------------------------------------------
|  🐼 React FC Form
|
|  🦝 Todo: CREATE AN AWESOME AND MAINTAINABLE FORM COMPONENT 
|
|  🐸 Returns:  JSX
*-------------------------------------------------------------------*/

import { Input } from './validation'
import { FormProvider, useForm } from 'react-hook-form'
import {
  name_validation,
  desc_validation,
  email_validation,
  num_validation,
  password_validation,
  login_password_validation,
  surname_validation,
  repeat_validation,
} from './utils/inputValidations'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'




export const LoginForm = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/main')
  }
  const methods = useForm()

  const onSubmit = methods.handleSubmit(data => {
    handleLoginClick()
  })

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className="registration-container-form"
      >
        <Input {...email_validation} />
        <Input {...login_password_validation} />
        <button className='form-button' type='button' onClick={onSubmit}>
          Войти
        </button>
        <div className='for-reg'>
          <p style={{ marginRight: '10px' }}>У вас нет учетной записи?</p>
          <Link to='/prereg'>Зарегистрироваться</Link>
        </div>
      </form>
    </FormProvider>
  )
}

export const RegistrationForm = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/')
  }
  const methods = useForm()

  const onSubmit = methods.handleSubmit(data => {
    handleLoginClick()
  })

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className='pre-registration-container-form'
      >
        <h3 className='h3-registr'>Регистрация</h3>
        <Input {...name_validation} />
        <Input {...surname_validation} />
        <Input {...email_validation} />
        <Input {...password_validation} />
        <Input {...repeat_validation} />
        <button className='form-button' type='button' onClick={onSubmit}>
          Зарегестрироваться
        </button>
      </form>
    </FormProvider>
  )
}