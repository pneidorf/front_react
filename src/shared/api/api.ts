import axios from 'axios'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true
  }
})

export const api = {
  async getThermalMapData() {
    const response = await instance.get('/sockets/thermalmapdata')
    return response.data
  },
  async login(email: string, password: string) {
    const response = await instance.post('/user/login', { email, password })
    return response.data
  },
  async register(email: string, password: string) {
    const response = await instance.post('/user/register', { email, password })
    return response.data
  },
  async logout() {}
}
