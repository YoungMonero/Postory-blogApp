import axios from 'axios';
import { getToken } from './auth-storage'

const api = axios.create({
  baseURL: 'http://localhost:4000', 
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