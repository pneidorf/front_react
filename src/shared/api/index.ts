import axios, { AxiosError } from 'axios'

import { DiagramsData } from '~/entities/diagrams/model/types'
// import Cookies from 'js-cookie'
// import { getAccessToken } from '../lib'
import { MarkerData } from '~/entities/markers'

// import { LoginData } from '~/features/auth/model/types'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
})
export const instance_rsrp = axios.create({
  baseURL: import.meta.env.VITE_API_RSRP,
  // withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': false,
    'Content-Type': 'application/json'
  }
})

export const instance_diagrams = axios.create({
  baseURL: 'http://109.172.114.128:10000/api',
  // withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': false,
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
  async getThermalMapDataPoint(x1: number, y1: number, x2: number, y2: number) {
    try {
      const endpoint = `/v1/filter/dataheatmap/${x1}/${y1}/${x2}/${y2}`
      const response = await instance_rsrp.get(endpoint)
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  async getThermalMapDataHandover(x1: number, y1: number, x2: number, y2: number) {
    try {
      const endpoint = `/v1/filter/handover/${x1}/${y1}/${x2}/${y2}`
      const response = await instance_rsrp.get(endpoint)
      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },
  // async getRSRPQuality(): Promise<MarkerData[]> {
  //   try {
  //     // const response = await instance.get('/sockets/getrsrpquality')
  //     const response = await instance_rsrp.get('/sockets/getrsrpquality')

  //     // const { token } = response.data
  //     // localStorage.setItem('token', token)
  //     // const filteredData = response.data.filter((_: never, index: number) => index % 80 === 0)
  //     // return filteredData.data
  //     return response.data
  //   } catch (error) {
  //     const { response } = error as AxiosError
  //     throw response?.data
  //   }
  // },
  async getRSRPQuality(timestart: string, timeend: string): Promise<MarkerData[]> {
    try {
      const endpoint = `/v1/filter/ltequality/${timestart}/${timeend}`
      const response = await instance_rsrp.get(endpoint)

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },

  async getMnc() {
    try {
      const endpoint = `/v1/filter/available/mnc`
      const response = await instance_rsrp.get(endpoint)

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },

  async getCellId(mnc: string) {
    try {
      const endpoint = `/v1/filter/available/ci/${mnc}`
      const response = await instance_rsrp.get(endpoint)

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },

  async getBand(mnc: string, ci: string) {
    try {
      const endpoint = `/v1/filter/available/band/${mnc}/${ci}`
      const response = await instance_rsrp.get(endpoint)

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },

  async getInfoQuality(params: string) {
    try {
      const endpoint = `/v1/filter/data/${params}`
      const response = await instance_rsrp.get(endpoint)

      return response.data
    } catch (error) {
      const { response } = error as AxiosError
      throw response?.data
    }
  },

  async getAppTraffic(): Promise<DiagramsData[]> {
    try {
      // const response = await instance.get('/sockets/getrsrpquality')
      const response = await instance_diagrams.get('/user/getapptrafic')

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
      // const response = await instance.post('/v1/auth/login', { email, password })
      const response = await instance.post('/v1/auth/signin', { email, password })

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
      const response = await instance.post('/v1/auth/signup', { email, password })

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
