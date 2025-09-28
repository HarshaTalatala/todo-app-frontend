import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiError } from '../types/task';

// Use relative URL in development to leverage Vite proxy, absolute URL in production
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? import.meta.env.VITE_TASKS_BASE_PATH || '/api/tasks'
  : `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_TASKS_BASE_PATH}`;

export const http: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response?.data) {
      const errorData = error.response.data as any;
      
      if (typeof errorData === 'string') {
        apiError.message = errorData;
      } else if (errorData.message) {
        apiError.message = errorData.message;
      } else if (errorData.error) {
        apiError.message = errorData.error;
      }
      
      // Handle validation errors with field information
      if (errorData.field) {
        apiError.field = errorData.field;
      }
    } else if (error.message) {
      apiError.message = error.message;
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 404:
        apiError.message = 'Resource not found';
        break;
      case 500:
        apiError.message = 'Internal server error';
        break;
      case 0:
      case undefined:
        apiError.message = 'Network error - please check if the backend is running';
        break;
    }

    return Promise.reject(apiError);
  }
);

export default http;