// src/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ev-charger-app.onrender.com/api', // Change if backend is hosted
});

// Add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
