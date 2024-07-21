import axios from 'axios'

export const instance = axios.create({
  baseURL: 'http://78.24.222.170:8080',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
})

export const getThermalMapData = async () => {
  try {
    const response = await instance.get('/api/sockets/thermalmapdata')
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await instance.post('/api/user/auth', {
      email,
      password
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
