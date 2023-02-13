import axios, { AxiosRequestConfig } from 'axios'

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
}, function (error) {
    console.log(error)
    return Promise.reject(error)
})

const BASE_URL = import.meta.env.VITE_API_URL

function createUrl(resource: string) {
    return `${BASE_URL}/${resource}`
}

function createConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    const token = localStorage.getItem('token')
    return {
        ...config,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

class HttpClient {
    async get<TResponse = any>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
        const response = await axios.get<TResponse>(createUrl(url), createConfig(config))
        return response.data
    }

    async post<TBody = any, TResponse = any>(url: string, body: TBody, config?: AxiosRequestConfig): Promise<TResponse> {
        const response = await axios.post<TResponse>(createUrl(url), body, createConfig(config))
        return response.data
    }

    async put<TBody = any, TResponse = any>(url: string, body: TBody, config?: AxiosRequestConfig): Promise<TResponse> {
        const response = await axios.put<TResponse>(createUrl(url), body, createConfig(config))
        return response.data
    }

    async delete(url: string, config?: AxiosRequestConfig) {
        const response = await axios.delete(createUrl(url), createConfig(config))
        return response.data
    }
}

const httpClient = new HttpClient()
export default httpClient