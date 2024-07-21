import { Input } from './validation'
import { FormProvider, useForm } from 'react-hook-form'
import { email_validation, login_password_validation } from './utils/inputValidations'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { loginUser } from '../shared/api/index.jsx'

export const LoginForm = () => {
  const navigate = useNavigate()
  const methods = useForm()

  const handleLogin = async data => {
    try {
      await loginUser(data.email, data.password)
      if (response.status === 200) {
        navigate('/main')
      } else {
        throw new Error('Ошибка авторизации')
      }
    } catch (error) {
      alert('Неверный логин или пароль')
    }
  }

  const onSubmit = methods.handleSubmit(data => {
    handleLogin(data)
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        noValidate
        autoComplete='off'
        className='registration-container-form'
      >
        <Input {...email_validation} />
        <Input {...login_password_validation} />
        <button className='form-button' type='submit'>
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
        autoComplete='off'
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
