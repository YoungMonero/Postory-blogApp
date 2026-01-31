import axios from 'axios';
import { getToken } from './auth-storage'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true,            
});

api.interceptors.request.use((config) => {
  const token = getToken();
  
  console.log("TOKEN IN INTERCEPTOR:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;