import axios, { AxiosError } from 'axios'

import { getAccessToken } from '../lib'

import { MarkerData } from '~/entities/markers'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(async config => {
  const accessToken = getAccessToken()
  if (config.headers && accessToken) config.headers.Authorization = `Bearer ${accessToken}`

  return config
})

export const api = {
  async getThermalMapData() {
    try {
      const response = await instance.get('/sockets/thermalmapdata')
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  async getRSRPQuality(): Promise<MarkerData[]> {
    try {
      const response = await instance.get('/sockets/getrsrpquality')
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  async login(email: string, password: string) {
    try {
      const response = await instance.post('/user/login', { email, password })
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  async register(email: string, password: string) {
    try {
      const response = await instance.post('/user/register', { email, password })
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  async logout(): Promise<void> {}
}
