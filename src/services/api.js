// src/services/api.js
import axios from "axios";

// axios instance that automatically uses your API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // useful later for login/auth
});

export default api;
