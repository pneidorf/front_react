import axios, { AxiosError } from 'axios'

// import Cookies from 'js-cookie'
// import { getAccessToken } from '../lib'
import { MarkerData } from '~/entities/markers'

// import { LoginData } from '~/features/auth/model/types'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
})

export const instance_rsrp = axios.create({
  baseURL: import.meta.env.VITE_API_RSRP,
  withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(async config => {
  const accessToken = localStorage.getItem('token')
  // const sessionCookie = Cookies.get('session')
  if (config.headers && accessToken) config.headers.Authorization = `Bearer ${accessToken}`

  // if (config.headers && sessionCookie) {
  //   config.headers['Cookie'] = `session=${sessionCookie}`
  // }

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
      // const response = await instance.get('/sockets/getrsrpquality')
      const response = await instance_rsrp.get('/sockets/getrsrpquality')

      // const { token } = response.data
      // localStorage.setItem('token', token)
      // const filteredData = response.data.filter((_: never, index: number) => index % 80 === 0)
      // return filteredData.data
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  async login({ email, password }: { email: string; password: string }) {
    try {
      // /user/auth
      const response = await instance.post('/v1/auth/login', { email, password })
      const { jwt } = response.data
      localStorage.setItem('token', jwt)
      // console.log(response.data)

      // const sessionCookie = response.headers['Set-Cookie']?.find((cookie: string) =>
      //   cookie.startsWith('session')
      // )
      // if (sessionCookie) {
      //   const sessionValue = sessionCookie.split(';')[0].split('=')[1]
      //   Cookies.set('session', sessionValue, { expires: 7 })
      // }

      // const setCookieHeader = response.headers['set-cookie'] || response.headers['Set-Cookie']
      // if (setCookieHeader) {
      //   const sessionCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('session'))
      //   if (sessionCookie) {
      //     const sessionValue = sessionCookie.split(';')[0].split('=')[1]
      //     Cookies.set('session', sessionValue, { expires: 7 })
      //   }
      // }

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      console.error(response?.data) //
      throw response?.data
    }
  },
  async register({ email, password }: { email: string; password: string }) {
    try {
      // /user/register
      const response = await instance.post('/v1/auth/register', { email, password })

      // const { token } = response.data
      // localStorage.setItem('token', token)

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      console.error(response?.data) //
      throw response?.data
    }
  },
  async logout(): Promise<void> {}
}