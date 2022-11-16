import { Logout } from '@/services'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { AUTH } from './firebase'
import constants from './constants'

const baseURL = constants.API_URL || ''

const API = axios.create({ baseURL })

const requestInterceptor = async (config: AxiosRequestConfig) => {
  const isFormData = config.data instanceof FormData
  config.headers!['Content-Type'] = isFormData
    ? 'multipart/form-data'
    : 'application/json'

  const token = await AUTH.currentUser?.getIdToken() || ''

  if (token) config.headers!.authorization = `Bearer ${token}`
  return config
}
const responseInterceptor = (response: AxiosResponse) => response.data

const handleHTTP400 = () => {}
const handleHTTP401 = async () => {
  await Logout()
}
const handleHTTP403 = () => {}
const handleHTTP500 = () => {}
const handleHTTP502 = () => {}

const errorResponseCallback: Record<number, any> = {
  1: () => {},
  400: handleHTTP400,
  401: handleHTTP401,
  403: handleHTTP403,
  500: handleHTTP500,
  502: handleHTTP502
}

const errorInterceptor = (error: AxiosError) => {
  const message = error.response;
  const statusCode = error.response?.status ?? 0;

  if (errorResponseCallback[statusCode]) errorResponseCallback[statusCode]()

  return Promise.reject({ message, status: statusCode })
}

API.interceptors.request.use(requestInterceptor)
API.interceptors.response.use(responseInterceptor, errorInterceptor)

export default API
