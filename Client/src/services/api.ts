import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (userName: string, password: string) => {
  const response = await api.post('/users/login', { userName, password });
  return response.data;
};

export const register = async (userName: string, email: string, password: string) => {
  const response = await api.post('/users', { userName, email, password });
  return response.data;
};

export default api;