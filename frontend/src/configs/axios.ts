import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AUTH } from './firebase'

const baseURL = process.env.VUE_APP_API_URL || ''

const API = axios.create({ baseURL })

const requestInterceptor = async (config: AxiosRequestConfig) => {
  const isFormData = config.data instanceof FormData
  config.headers!['Content-Type'] = isFormData
    ? 'multipart/form-data'
    : 'application/json'

  const token = (await AUTH.currentUser?.getIdToken()) || ''

  if (token) {
    config.headers!.Authorization = `Bearer ${token}`
  }

  return config
}

const responseInterceptor = (response: AxiosResponse) => response.data

API.interceptors.request.use(requestInterceptor)
API.interceptors.response.use(responseInterceptor)

export default API
