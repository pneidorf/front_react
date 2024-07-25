import { describe, it, expect } from 'vitest'
import { getThermalMapData, loginUser, regUser } from '../../shared/api'

describe('Тестирование запросов на бэкенд', () => {
  it('Получает успешный ответ от сервера, при попытке запроса данных', async () => {
    const response = await getThermalMapData()
    expect(response.status).toBe(200)
  })

  it('Успешная попытка логина', async () => {
    const data = {
      email: 'pnejdorf@mail.ru',
      password: 'testadmin'
    }

    const response = await loginUser(data.email, data.password)
    expect(response.status).toBe(200)
  })

  it('Успешная попытка регистрации', async () => {
    const data = {
      email: 'kirill@mail.ru',
      password: 'testadmin123'
    }

    const response = await regUser(data.email, data.password)
    expect(response.status).toBe(400)
  })
})
