import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const axiosClient = axios.create({
  baseURL: '',
  timeout: 10 * 60 * 1000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,  
});

axiosClient.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'public, max-age=300'; // 5 minutes cache
    }
    
    if (typeof window === 'undefined') {
      config.headers['User-Agent'] = 'NerdMine-WebApp/1.0';
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status == 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
        window.localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);

export const GET = (config: AxiosRequestConfig) =>
  axiosClient({ method: 'GET', ...config });

export const POST = (config: AxiosRequestConfig) =>
  axiosClient({ method: 'POST', ...config });

export const PUT = (config: AxiosRequestConfig) =>
  axiosClient({ method: 'PUT', ...config });

export const PATCH = (config: AxiosRequestConfig) =>
  axiosClient({ method: 'PATCH', ...config });

export const DELETE = (config: AxiosRequestConfig) =>
  axiosClient({ method: 'DELETE', ...config });